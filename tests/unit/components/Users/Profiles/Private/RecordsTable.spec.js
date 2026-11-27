import { flushPromises, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import RecordTable from "@/components/Users/Profiles/Private/RecordsTable";
import userStore from "@/store/users.js";

import {
  VBtnStub,
  VDataTableStub,
  VDialogStub,
  VMenuStub,
  VRouterLinkStub,
} from "../../../../../stubs/index.js";
import { VIconStub } from "../../../../../stubs/VIconStub.js";

const $router = { push: vi.fn() };
const records = [
  {
    id: 12,
    name: "Test_record",
    type: "repository",
    isApproved: true,
    status: "pending",
  },
];

describe("RecordsTable.vue", () => {
  let wrapper;
  let $store;

  beforeEach(() => {
    $router.push.mockClear();
    $store = new Vuex.Store({
      modules: {
        users: {
          ...userStore,
          state: { ...userStore.state, user: () => ({ is_curator: false }) },
        },
      },
    });
    vi.spyOn(window, "open").mockReturnValue(null);
    wrapper = shallowMount(RecordTable, {
      mocks: { $store, $router },
      global: {
        stubs: {
          VDataTable: {
            ...VDataTableStub,
            name: "VDataTable",
            props: {
              ...VDataTableStub.props,
              itemsPerPage: Number,
              footerProps: Object,
            },
            template: `
            <table data-test="v-data-table">
              <thead><tr><th v-for="header in headers" :key="header.value">{{ header.title }}</th></tr></thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="item.id ?? index">
                  <td v-for="header in headers" :key="header.value">
                    <slot :name="'item.' + header.value" :item="item" />
                  </td>
                </tr>
                <tr v-if="!items.length"><td><slot name="no-data" /></td></tr>
              </tbody>
            </table>
          `,
          },
          VMenu: VMenuStub,
          VDialog: VDialogStub,
          VBtn: VBtnStub,
          VIcon: VIconStub,
          "router-link": VRouterLinkStub,
          VListItem: {
            name: "VListItem",
            template:
              '<button type="button"><slot name="prepend" /><slot /></button>',
          },
        },
      },
    });
  });

  afterEach(async () => {
    await flushPromises();
    wrapper.unmount();
    vi.restoreAllMocks();
  });

  it("can be mounted with watched records", async () => {
    await wrapper.setProps({ records: [], source: "watchedRecords" });
    const title = "RecordsTable";
    expect(wrapper.vm.$options.name).toMatch(title);
    expect(wrapper.vm.perPage).toBe(7);
  });

  it("can be mounted with maintained records", async () => {
    await wrapper.setProps({ records: [], source: "maintainedRecords" });
    const title = "RecordsTable";
    expect(wrapper.vm.$options.name).toMatch(title);
    expect(wrapper.vm.perPage).toBe(5);
  });

  it("can be mounted with maintenance requests", async () => {
    await wrapper.setProps({ source: "maintenanceRequests" });
    const title = "RecordsTable";
    expect(wrapper.vm.$options.name).toMatch(title);
    expect(wrapper.vm.perPage).toBe(5);
  });

  it("can show and hide the overlay", async () => {
    await wrapper.setProps({ source: "maintenanceRequests" });
    wrapper.vm.previewRecord(12);
    expect(wrapper.vm.targetID).toBe(12);
    expect(wrapper.vm.showOverlay).toBe(true);
    wrapper.vm.hideOverlay(12);
    expect(wrapper.vm.targetID).toBe(null);
    expect(wrapper.vm.showOverlay).toBe(false);
    wrapper.vm.goToEdit(12);
    expect($router.push).toHaveBeenCalledWith({ path: "/12/edit" });
  });

  it("can open the record page", async () => {
    wrapper.vm.goToRecord(12);
    expect(window.open).toHaveBeenCalledExactlyOnceWith("/12", "_blank");
  });

  it.each([
    [
      "maintenanceRequests",
      "You do not have any maintenance requests.",
      ["Name", "Registry", "Status", "Actions"],
      5,
    ],
    [
      "createdRecords",
      "You did not create any record yet. Start creating one",
      ["Name", "Registry", "Approved", "Actions"],
      5,
    ],
    [
      "maintainedRecords",
      "You do not maintain any records.",
      ["Name", "Registry", "Approved", "Actions"],
      5,
    ],
    [
      "publicMaintainedRecords",
      "This user does not maintain any records.",
      ["Name", "Registry", "Approved", "Actions"],
      5,
    ],
    [
      "watchedRecords",
      "You are not watching any record.",
      ["Name", "Registry", "Actions"],
      7,
    ],
  ])(
    "renders empty-state text, columns and pagination for %s",
    async (source, message, headers, pageSize) => {
      await wrapper.setProps({ source });
      expect(wrapper.text()).toContain(message);
      expect(wrapper.findAll("th").map((item) => item.text())).toEqual(headers);
      const table = wrapper.findComponent({ name: "VDataTable" });
      expect(table.props("itemsPerPage")).toBe(pageSize);
      expect(table.props("footerProps")).toEqual({
        "items-per-page-options": [pageSize],
      });
      expect(wrapper.find('a[href="/new"]').exists()).toBe(
        source === "createdRecords",
      );
    },
  );

  it("renders record details and binds approval or maintenance status to the pills", async () => {
    await wrapper.setProps({
      records: structuredClone(records),
      source: "maintainedRecords",
    });
    expect(wrapper.text()).toContain("Test record");
    expect(wrapper.text()).toContain("Repository");
    expect(wrapper.findComponent({ name: "Icon" }).props()).toMatchObject({
      item: "repository",
      height: 30,
    });
    expect(
      wrapper.findComponent({ name: "StatusPills" }).props(),
    ).toMatchObject({ approved: true, small: false });
    expect(
      wrapper.findComponent({ name: "VDataTable" }).props("items"),
    ).toEqual(records);
    await wrapper.setProps({ source: "maintenanceRequests" });
    expect(
      wrapper.findComponent({ name: "StatusPills" }).props(),
    ).toMatchObject({ status: "pending", small: false });
    await wrapper.setProps({ source: "watchedRecords" });
    expect(wrapper.findComponent({ name: "StatusPills" }).exists()).toBe(false);
  });

  it.each([
    ["watchedRecords", false, false],
    ["watchedRecords", true, true],
    ["maintenanceRequests", false, false],
    ["maintenanceRequests", true, false],
    ["createdRecords", false, true],
    ["maintainedRecords", false, true],
    ["publicMaintainedRecords", false, true],
  ])(
    "controls Edit for source=%s and curator=%s",
    async (source, isCurator, canEdit) => {
      $store.state.users.user = () => ({ is_curator: isCurator });
      await wrapper.setProps({ source, records: structuredClone(records) });
      const actions = wrapper.findAllComponents({ name: "VListItem" });
      expect(
        actions.some((item) => item.text().includes("Preview record")),
      ).toBe(true);
      expect(actions.some((item) => item.text().includes("Go to record"))).toBe(
        true,
      );
      const edit = actions.find((item) => item.text().includes("Edit record"));
      expect(Boolean(edit)).toBe(canEdit);
      if (canEdit) {
        await edit.trigger("click");
        expect($router.push).toHaveBeenCalledExactlyOnceWith({
          path: "/12/edit",
        });
      }
    },
  );

  it("opens the selected record preview and closes it using the Record event and button", async () => {
    await wrapper.setProps({
      records: structuredClone(records),
      source: "createdRecords",
    });
    await wrapper
      .findAllComponents({ name: "VListItem" })
      .find((item) => item.text().includes("Preview record"))
      .trigger("click");
    const record = wrapper.findComponent({ name: "Record" });
    expect(record.props("target")).toBe(12);
    expect(wrapper.vm.showOverlay).toBe(true);
    expect(wrapper.find("button.absolute").exists()).toBe(false);
    await record.vm.$emit("show-dialog", true);
    expect(wrapper.vm.closeButton).toBe(true);
    await record.vm.$emit("show-dialog", false);
    expect(wrapper.find("button.absolute").exists()).toBe(false);
    await record.vm.$emit("show-dialog", true);
    await wrapper.find("button.absolute").trigger("click");
    expect(wrapper.vm.showOverlay).toBe(false);
    expect(wrapper.vm.targetID).toBeNull();
    expect(wrapper.vm.closeButton).toBe(false);
    expect(wrapper.find('[data-test="v-dialog"]').exists()).toBe(false);
  });

  it("updates preview visibility through the dialog v-model", async () => {
    wrapper.vm.previewRecord(12);
    await wrapper.vm.$nextTick();
    await wrapper
      .findComponent({ name: "VDialog" })
      .vm.$emit("update:modelValue", false);
    expect(wrapper.vm.showOverlay).toBe(false);
    expect(wrapper.find('[data-test="v-dialog"]').exists()).toBe(false);
  });

  it("opens the selected record in a new tab from the row menu", async () => {
    await wrapper.setProps({ records: structuredClone(records) });
    await wrapper
      .findAllComponents({ name: "VListItem" })
      .find((item) => item.text().includes("Go to record"))
      .trigger("click");
    expect(window.open).toHaveBeenCalledExactlyOnceWith("/12", "_blank");
  });

  it("updates displayed rows when the records prop changes", async () => {
    await wrapper.setProps({
      records: structuredClone(records),
      source: "maintainedRecords",
    });
    expect(wrapper.findAll("tbody tr")).toHaveLength(1);
    const updated = [
      ...structuredClone(records),
      { ...records[0], id: 13, name: "Another_record", isApproved: false },
    ];
    await wrapper.setProps({ records: updated });
    expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    expect(wrapper.text()).toContain("Another record");
    expect(
      wrapper
        .findAllComponents({ name: "StatusPills" })
        .map((item) => item.props("approved")),
    ).toEqual([true, false]);
  });
});
