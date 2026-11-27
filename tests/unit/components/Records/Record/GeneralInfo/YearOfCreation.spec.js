import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import YearOfCreation from "@/components/Records/Record/GeneralInfo/YearOfCreation.vue";
import Record from "@/store/recordData.js";
import { VIconStub, VTooltipStub } from "../../../../../stubs/index.js";

const vuetify = createVuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      year: "year tooltip.",
    },
  },
};

Record.state.currentRecord["fairsharingRecord"] = {
  doi: "FAIRsharing.wibble",
  metadata: {
    year_creation: 1912,
  },
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

describe("YearOfCreation.vue", function () {
  let wrapper;

  beforeEach(() => {
    $store.commit("record/setCurrentRecord", structuredClone(initialRecord));
    vi.stubGlobal("innerWidth", 1280);
    vuetify.display.update();
    wrapper = shallowMount(YearOfCreation, {
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
    expect(wrapper.vm.$options.name).toMatch("YearOfCreation");
  });

  it("renders the creation year and its tooltip", () => {
    expect(wrapper.get("p").text()).toBe("1912");
    expect(wrapper.text()).toContain("Year of Creation");
    expect(wrapper.text()).toContain("year tooltip.");
    expect(wrapper.find('[data-test="v-icon"]').exists()).toBe(true);
    expect(wrapper.findComponent({ name: "NoneFound" }).exists()).toBe(false);
  });

  it.each([[undefined], [null], [""]])(
    "renders the fallback when the creation year is %s",
    async (year) => {
      $store.state.record.currentRecord.fairsharingRecord.metadata.year_creation =
        year;
      await wrapper.vm.$nextTick();
      expect(wrapper.find("p").exists()).toBe(false);
      expect(
        wrapper.findComponent({ name: "NoneFound" }).props("stringField"),
      ).toBe(year ?? null);
    },
  );

  it("updates the displayed year when the record metadata changes", async () => {
    $store.state.record.currentRecord.fairsharingRecord.metadata.year_creation = 2020;
    await wrapper.vm.$nextTick();
    expect(wrapper.get("p").text()).toBe("2020");
  });

  it("right-aligns the year and its container on small screens", async () => {
    expect(wrapper.get(".full-width").classes()).not.toContain("justify-end");
    expect(wrapper.get("p").classes()).not.toContain("text-end");
    vi.stubGlobal("innerWidth", 400);
    vuetify.display.update();
    await wrapper.vm.$nextTick();
    expect(wrapper.get(".full-width").classes()).toContain("justify-end");
    expect(wrapper.get("p").classes()).toContain("text-end");
  });
});
