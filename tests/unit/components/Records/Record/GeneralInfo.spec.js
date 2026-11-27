import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import GeneralInfo from "@/components/Records/Record/GeneralInfo.vue";
import Record from "@/store/recordData";
import { VBtnStub, VIconStub, VTooltipStub } from "../../../../stubs/index.js";

const vuetify = createVuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      graph_button: "graph button tooltip.",
    },
  },
};

const $router = { push: vi.fn() };

Record.state.currentRecord.fairsharingRecord = {
  id: 12345,
};

const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor,
  },
});

describe("GeneralInfo.vue", function () {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    $store.state.record.currentRecord.fairsharingRecord = {
      id: 12345,
      registry: "Database",
      type: "repository",
      hasGraph: false,
    };
    wrapper = shallowMount(GeneralInfo, {
      vuetify,
      mocks: { $store, $router },
      stubs: { VBtn: VBtnStub, VIcon: VIconStub, VTooltip: VTooltipStub },
    });
  });

  afterEach(() => wrapper.unmount());

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("GeneralInfo");
  });

  it("can call callRequestOwnership method", () => {
    wrapper.vm.callRequestOwnership();
    expect(wrapper.emitted().requestOwnership).toBeTruthy();
  });

  it.each([
    ["Collection", "collection", true, true],
    ["Database", "repository", false, false],
    ["Standard", "principle", false, true],
  ])(
    "renders the appropriate fields for %s / %s",
    async (registry, type, collection, reference) => {
      Object.assign($store.state.record.currentRecord.fairsharingRecord, {
        registry,
        type,
      });
      await wrapper.vm.$nextTick();
      for (const name of ["Organisations", "ContactsData", "Licence"])
        expect(
          wrapper.findComponent(GeneralInfo.components[name]).exists(),
        ).toBe(collection);
      for (const name of ["YearOfCreation", "Countries"])
        expect(
          wrapper.findComponent(GeneralInfo.components[name]).exists(),
        ).toBe(!collection);
      expect(
        wrapper.findComponent(GeneralInfo.components.ReferenceURL).exists(),
      ).toBe(reference);
    },
  );

  it("forwards ownership requests and passes claim and background options", async () => {
    await wrapper.setProps({ canClaim: false, backColor: "blue-lighten-5" });
    const maintainers = wrapper.findComponent(
      GeneralInfo.components.Maintainers,
    );
    expect(maintainers.props("canClaim")).toBe(false);
    expect(wrapper.findComponent({ name: "VCard" }).props("color")).toBe(
      "blue-lighten-5",
    );
    maintainers.vm.$emit("requestOwnership");
    expect(wrapper.emitted("requestOwnership")).toEqual([[]]);
  });

  it("disables graph navigation when no graph is available", async () => {
    const button = wrapper.get("button");
    expect(button.attributes("disabled")).toBeDefined();
    expect(button.text()).toContain("No Graph Available");
    await button.trigger("click");
    wrapper.vm.loadGraph();
    expect($router.push).not.toHaveBeenCalled();
    expect(wrapper.vm.graphButtonDisabled()).toBe(true);
  });

  it("opens an available relation graph through the graph button", async () => {
    $store.state.record.currentRecord.fairsharingRecord.hasGraph = true;
    await wrapper.vm.$nextTick();
    const button = wrapper.get("button");
    expect(button.attributes("disabled")).toBeUndefined();
    expect(button.text()).toContain("View Relation Graph");
    expect(wrapper.text()).toContain("graph button tooltip.");
    await button.trigger("click");
    expect($router.push).toHaveBeenCalledExactlyOnceWith({
      path: "/graph/12345",
    });
    expect(wrapper.vm.graphButtonDisabled()).toBe(false);
  });
});
