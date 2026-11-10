import { flushPromises, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import EditsTable from "@/components/Users/Profiles/Private/EditsTable";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getUserEditEventsQuery from "@/lib/GraphClient/queries/getUserEditEvents.json";
import userStore from "@/store/users.js";

import {
  VBtnStub,
  VDataTableStub,
  VDialogStub,
  VMenuStub,
} from "../../../../../stubs/index.js";
import { VIconStub } from "../../../../../stubs/VIconStub.js";

const $router = {
  push: vi.fn(),
  currentRoute: { value: { path: "/accounts/profile" } },
};
const edits = [
  {
    fairsharingRecord: { id: 1, name: "Wibble", type: "repository" },
    createdAt: "2021-11-24T13:14:55.571Z",
    editType: "edits",
    editEvent: "update",
  },
];

describe("EditsTable.vue", () => {
  let wrapper;
  let $store, graphStub;

  beforeEach(() => {
    $router.currentRoute.value.path = "/accounts/profile";
    $router.push.mockClear();
    $store = new Vuex.Store({
      modules: {
        users: {
          ...userStore,
          state: {
            ...userStore.state,
            user: () => ({ id: 42, credentials: { token: "test-token" } }),
          },
        },
      },
    });
    graphStub = vi
      .spyOn(GraphClient.prototype, "executeQuery")
      .mockResolvedValue({
        user: { editEvents: structuredClone(edits) },
      });
    vi.spyOn(window, "open").mockReturnValue(null);
    wrapper = shallowMount(EditsTable, {
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

  it("can be mounted", async () => {
    await wrapper.setData({ edits: structuredClone(edits) });
    const title = "EditsTable";
    expect(wrapper.vm.$options.name).toMatch(title);
    expect(wrapper.vm.perPage).toBe(10);
    expect(wrapper.text()).toContain("Wibble");
    expect(wrapper.text()).toContain("update");
    expect(wrapper.text()).toContain("edits");
    expect(wrapper.text()).toContain("Wednesday, November 24th 2021, 13:14");
    expect(wrapper.findComponent({ name: "Icon" }).props()).toMatchObject({
      item: "repository",
      height: 30,
    });
    const table = wrapper.findComponent({ name: "VDataTable" });
    expect(table.props("items")).toEqual(edits);
    expect(table.props("itemsPerPage")).toBe(10);
    expect(table.props("footerProps")).toEqual({
      "items-per-page-options": [10],
    });
    expect(wrapper.findAll("th").map((item) => item.text())).toEqual([
      "Record",
      "Event",
      "Type",
      "Date",
      "Actions",
    ]);
  });

  it("can show and hide the overlay", () => {
    wrapper.vm.previewRecord(12);
    expect(wrapper.vm.targetID).toBe(12);
    expect(wrapper.vm.showOverlay).toBe(true);
    wrapper.vm.hideOverlay(12);
    expect(wrapper.vm.targetID).toBe(null);
    expect(wrapper.vm.showOverlay).toBe(false);
  });

  it("can open the record page", async () => {
    wrapper.vm.goToRecord(12);
    expect(window.open).toHaveBeenCalledExactlyOnceWith("/12", "_blank");
  });

  it("formats fields as required", () => {
    expect(wrapper.vm.moment("2021-12-20T10:38:58Z")).toEqual(
      "Monday, December 20th 2021, 10:38",
    );
    expect(wrapper.vm.noData).toEqual("This user has not edited any records.");
  });

  it("loads the signed-in user's edits and disables Load while waiting", async () => {
    let finishRequest;
    graphStub.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finishRequest = resolve;
        }),
    );
    const button = wrapper.find("button");
    expect(button.text()).toBe("Load");
    await button.trigger("click");
    expect(wrapper.vm.loading).toBe(true);
    expect(button.attributes("disabled")).toBeDefined();
    expect(button.find("span").classes()).toContain("d-none");
    expect(graphStub).toHaveBeenCalledExactlyOnceWith(getUserEditEventsQuery);
    expect(getUserEditEventsQuery.queryParam.id).toBe(42);
    finishRequest({ user: { editEvents: structuredClone(edits) } });
    await flushPromises();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.edits).toEqual(edits);
    expect(wrapper.text()).toContain("Wibble");
    expect(
      wrapper.findAll("button").some((item) => item.text() === "Load"),
    ).toBe(false);
  });

  it("loads public profile edits using the user ID from the route", async () => {
    $router.currentRoute.value.path = "/users/73";
    await wrapper.find("button").trigger("click");
    await flushPromises();
    expect(getUserEditEventsQuery.queryParam.id).toBe(73);
    expect(graphStub).toHaveBeenCalledOnce();
    expect(wrapper.vm.edits).toEqual(edits);
    expect(wrapper.vm.loading).toBe(false);
  });

  it.each(["/accounts/profile", "/users/", "/users"])(
    "does not request edits without a user ID at %s",
    async (path) => {
      $router.currentRoute.value.path = path;
      $store.state.users.user = () => ({
        id: null,
        credentials: { token: "test-token" },
      });
      await wrapper.find("button").trigger("click");
      await flushPromises();
      expect(graphStub).not.toHaveBeenCalled();
      expect(wrapper.vm.edits).toEqual([]);
      expect(wrapper.vm.loading).toBe(false);
      expect(wrapper.find("button").attributes("disabled")).toBeUndefined();
    },
  );

  it("keeps Load available after a successful response with no edits", async () => {
    graphStub.mockResolvedValueOnce({ user: { editEvents: [] } });
    await wrapper.find("button").trigger("click");
    await flushPromises();
    expect(graphStub).toHaveBeenCalledOnce();
    expect(wrapper.vm.edits).toEqual([]);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.find("button").text()).toBe("Load");
    expect(wrapper.find("button").attributes("disabled")).toBeUndefined();
  });

  it("propagates a failed edits request without replacing existing edits", async () => {
    await wrapper.setData({ edits: structuredClone(edits) });
    graphStub.mockRejectedValueOnce(new Error("Edits service unavailable"));
    await expect(wrapper.vm.loadEditEvents()).rejects.toThrow(
      "Edits service unavailable",
    );
    expect(wrapper.vm.edits).toEqual(edits);
  });

  it("opens a record preview from its row and closes it when the record is ready", async () => {
    await wrapper.setData({ edits: structuredClone(edits) });
    const preview = wrapper
      .findAllComponents({ name: "VListItem" })
      .find((item) => item.text().includes("Preview record"));
    await preview.trigger("click");
    const record = wrapper.findComponent({ name: "Record" });
    expect(record.props("target")).toBe(1);
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

  it("updates preview visibility when the dialog is dismissed", async () => {
    wrapper.vm.previewRecord(12);
    await wrapper.vm.$nextTick();
    await wrapper
      .findComponent({ name: "VDialog" })
      .vm.$emit("update:modelValue", false);
    expect(wrapper.vm.showOverlay).toBe(false);
    expect(wrapper.find('[data-test="v-dialog"]').exists()).toBe(false);
  });

  it("opens the record page from the row menu", async () => {
    await wrapper.setData({ edits: structuredClone(edits) });
    const link = wrapper
      .findAllComponents({ name: "VListItem" })
      .find((item) => item.text().includes("Go to record"));
    await link.trigger("click");
    expect(window.open).toHaveBeenCalledExactlyOnceWith("/1", "_blank");
  });
});
