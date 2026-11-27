import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import DataProcessAndCondition from "@/components/Records/Record/DataProcessesAndConditions/DataProcessAndCondition";
import Record from "@/store/recordData.js";
import { VIconStub } from "../../../../../stubs/index.js";

const vuetify = createVuetify();

Record.state.currentRecord["fairsharingRecord"] = {
  metadata: {
    associated_tools: [{}],
    data_processes_and_conditions: [
      {
        name: "name1",
        type: "data access",
        url: "www.somewhere.com",
        access_method: "access method",
      },
    ],
  },
  taxonomies: [{ label: "Turdus turdus" }],
  subjects: [{ label: "Javascript Fun" }],
  domains: [{ label: "Deneb" }],
  userDefinedTags: [{ label: "a" }],
  objectTypes: [{ label: "b" }],
};

const initialRecord = structuredClone(Record.state.currentRecord);

const $store = new Vuex.Store({
  modules: {
    record: Record,
  },
});

describe("DataProcessAndCondition.vue", function () {
  let wrapper;

  beforeEach(() => {
    $store.commit("record/setCurrentRecord", structuredClone(initialRecord));
    vi.stubGlobal("innerWidth", 1280);
    vuetify.display.update();
    wrapper = shallowMount(DataProcessAndCondition, {
      vuetify,
      mocks: { $store },
      stubs: { VIcon: VIconStub },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.unstubAllGlobals();
    vuetify.display.update();
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("DataProcessAndCondition");
  });

  it("can be check the reaction of page if appropriate data not provided", () => {
    let mockData;
    expect(wrapper.vm.generateProcessesData()).toStrictEqual({
      "data access": {
        data: [
          {
            name: "name1",
            type: "data access",
            url: "www.somewhere.com",
            access_method: "access method",
          },
        ],
        icon: "data_access",
      },
    });

    mockData = {
      fairsharingRecord: {
        licences: [],
        metadata: {},
        taxonomies: [{ label: "asasd turdus" }],
        subjects: [{ label: "asdasd Fun" }],
        domains: [{ label: "asasd" }],
        userDefinedTags: [{ label: "b" }],
        objectTypes: [{ label: "c" }],
      },
    };
    $store.commit("record/setCurrentRecord", mockData);
    expect(wrapper.vm.generateProcessesData()).toStrictEqual({});

    mockData = {
      fairsharingRecord: {
        metadata: {
          data_processes_and_conditions: [
            {
              name: "name1",
              type: "data access",
              url: "www.somewhere.com",
              access_method: "access method",
            },
            {
              name: "name2",
              type: "data access",
              url: "www.somewhere.com",
              access_method: "access method",
            },
            {
              name: "name3",
              type: "data curation",
              url: "www.somewhere3.com",
              access_method: "access method",
            },
          ],
        },
        taxonomies: [{ label: "asasd turdus" }],
        subjects: [{ label: "asdasd Fun" }],
        domains: [{ label: "asasd" }],
        userDefinedTags: [{ label: "b" }],
        objectTypes: [{ label: "c" }],
      },
    };
    $store.commit("record/setCurrentRecord", mockData);
    expect(wrapper.vm.generateProcessesData()).toStrictEqual({
      "data access": {
        data: [
          {
            name: "name1",
            type: "data access",
            url: "www.somewhere.com",
            access_method: "access method",
          },
          {
            name: "name2",
            type: "data access",
            url: "www.somewhere.com",
            access_method: "access method",
          },
        ],
        icon: "data_access",
      },
      "data curation": {
        data: [
          {
            name: "name3",
            type: "data curation",
            url: "www.somewhere3.com",
            access_method: "access method",
          },
        ],
        icon: "data_curation",
      },
    });
  });

  it.each([{}, { data_processes_and_conditions: [] }])(
    "hides the card when no processes are available: %j",
    async (metadata) => {
      $store.commit("record/setCurrentRecord", {
        fairsharingRecord: {
          ...structuredClone(initialRecord.fairsharingRecord),
          metadata,
        },
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("v-card-stub").exists()).toBe(false);
      expect(wrapper.vm.generateProcessesData()).toEqual({});
    },
  );

  it("renders process details, truncates long URLs and passes the card colour", async () => {
    const longUrl = "https://example.org/" + "documentation".repeat(12);
    const process = {
      name: "Download records",
      type: "read",
      url: "https://example.org/download",
      access_method: "REST API",
      example_url: "https://example.org/example",
      documentation_url: longUrl,
    };
    $store.state.record.currentRecord.fairsharingRecord.metadata.data_processes_and_conditions =
      [process];
    await wrapper.setProps({ backColor: "blue-lighten-5" });
    expect(wrapper.get("v-card-stub").attributes("color")).toBe(
      "blue-lighten-5",
    );
    expect(wrapper.text()).toContain("Processes");
    expect(wrapper.text()).toContain("REST API");
    expect(wrapper.get('a[href="https://example.org/download"]').text()).toBe(
      "Download records",
    );
    expect(wrapper.get('a[href="https://example.org/example"]').text()).toBe(
      "https://example.org/example",
    );
    const docs = wrapper
      .findAll("a")
      .find((link) => link.attributes("href") === longUrl);
    expect(docs.text()).toBe(longUrl.substr(0, 99) + "...");
    expect(
      wrapper
        .findAll("a")
        .every((link) => link.attributes("target") === "_blank"),
    ).toBe(true);
    expect(wrapper.vm.generateProcessesData()).toEqual({
      read: { data: [process], icon: "read" },
    });
  });

  it.each([
    ["read", [true, false]],
    ["write", [false, true]],
    ["read and write", [true, true]],
    ["data access", [false, false]],
    ["", []],
  ])(
    "renders the appropriate read and write indicators for %s",
    async (type, expected) => {
      $store.state.record.currentRecord.fairsharingRecord.metadata.data_processes_and_conditions =
        [{ type }];
      await wrapper.vm.$nextTick();
      const headings = wrapper.findAll("b");
      expect(headings.map((heading) => heading.text())).toEqual(
        type ? ["Read", "Write"] : [],
      );
      expect(
        headings.map((heading) =>
          heading.element.parentElement.textContent.includes("fas fa-check"),
        ),
      ).toEqual(expected);
      expect(wrapper.text()).not.toContain("Access Method");
      expect(wrapper.text()).not.toContain("Example URL");
      expect(wrapper.text()).not.toContain("Documentation URL");
      expect(wrapper.find("a").exists()).toBe(false);
    },
  );

  it("updates the layout when switching between desktop and mobile widths", async () => {
    const content = () => wrapper.get(".content-wrapper");
    const readHeading = () =>
      wrapper.findAll("b").find((heading) => heading.text() === "Read");
    expect(content().classes()).not.toContain("flex-column");
    expect(
      readHeading().element.parentElement.classList.contains("flex-column"),
    ).toBe(true);
    vi.stubGlobal("innerWidth", 400);
    vuetify.display.update();
    await wrapper.vm.$nextTick();
    expect(content().classes()).toContain("flex-column");
    expect(readHeading().classes()).toContain("mr-8");
    expect(
      readHeading().element.parentElement.classList.contains("flex-column"),
    ).toBe(false);
  });
});
