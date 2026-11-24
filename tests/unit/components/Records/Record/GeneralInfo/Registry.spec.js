import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Registry from "@/components/Records/Record/GeneralInfo/Registry.vue";
import Record from "@/store/recordData.js";
import { VIconStub, VTooltipStub } from "../../../../../stubs/index.js";

const vuetify = createVuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      fairsharing_registry: "registry tooltip.",
    },
  },
};

Record.state.currentRecord["fairsharingRecord"] = {
  subjects: [],
  domains: [],
  taxonomies: [],
  userDefinedTags: [{ label: "a" }],
};
const initialRecord = structuredClone(Record.state.currentRecord);
const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor,
  },
});

describe("Registry.vue", function () {
  let wrapper;

  beforeEach(() => {
    $store.commit("record/setCurrentRecord", structuredClone(initialRecord));
    vi.stubGlobal("innerWidth", 1280);
    vuetify.display.update();
    wrapper = shallowMount(Registry, {
      vuetify,
      mocks: { $store },
      stubs: { VIcon: VIconStub, VTooltip: VTooltipStub },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.unstubAllGlobals();
    vuetify.display.update();
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Registry");
  });

  it.each([
    ["database", "Database"],
    ["standard", "Standard"],
    ["policy", "Policy"],
  ])(
    "capitalizes the %s registry and renders its tooltip",
    async (registry, expected) => {
      $store.state.record.currentRecord.fairsharingRecord.registry = registry;
      await wrapper.vm.$nextTick();
      expect(wrapper.get("p").text()).toBe(expected);
      expect(wrapper.text()).toContain("registry tooltip.");
      expect(wrapper.get('[data-test="v-icon"]').text()).toContain(
        "fas fa-question-circle",
      );
    },
  );

  it("reacts to registry changes and handles an absent registry", async () => {
    const record = $store.state.record.currentRecord.fairsharingRecord;
    record.registry = "collection";
    await wrapper.vm.$nextTick();
    expect(wrapper.get("p").text()).toBe("Collection");
    record.registry = null;
    await wrapper.vm.$nextTick();
    expect(wrapper.get("p").text()).toBe("");
  });

  it("right-aligns the registry on small screens", async () => {
    expect(wrapper.get("p").classes()).not.toContain("text-end");
    vi.stubGlobal("innerWidth", 400);
    vuetify.display.update();
    await wrapper.vm.$nextTick();
    expect(wrapper.get("p").classes()).toContain("text-end");
  });
});
