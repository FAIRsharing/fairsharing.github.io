import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import HomePage from "@/components/Records/Record/GeneralInfo/HomePage.vue";
import Record from "@/store/recordData.js";
import { VIconStub, VTooltipStub } from "../../../../../stubs/index.js";

const vuetify = createVuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      homepage: "homepage tooltip.",
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
    editor,
  },
});

describe("HomePage.vue", function () {
  let wrapper;

  beforeEach(() => {
    $store.commit("record/setCurrentRecord", structuredClone(initialRecord));
    vi.stubGlobal("innerWidth", 1280);
    vuetify.display.update();
    wrapper = shallowMount(HomePage, {
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
    expect(wrapper.vm.$options.name).toMatch("HomePage");
  });

  it.each([[undefined], [null], [""]])(
    "hides the homepage row when its URL is %s",
    async (homepage) => {
      $store.state.record.currentRecord.fairsharingRecord.homepage = homepage;
      await wrapper.vm.$nextTick();
      expect(wrapper.find("a").exists()).toBe(false);
      expect(wrapper.find("b").exists()).toBe(false);
    },
  );

  it("renders the homepage link and tooltip and reacts to URL changes", async () => {
    const record = $store.state.record.currentRecord.fairsharingRecord;
    record.homepage = "https://example.org";
    await wrapper.vm.$nextTick();
    expect(wrapper.get("a").attributes("href")).toBe("https://example.org");
    expect(wrapper.get("a").attributes("target")).toBe("_blank");
    expect(wrapper.get("a").text()).toBe("https://example.org");
    expect(wrapper.text()).toContain("homepage tooltip.");
    expect(wrapper.find('[data-test="v-icon"]').exists()).toBe(true);
    record.homepage = "https://example.org/updated";
    await wrapper.vm.$nextTick();
    expect(wrapper.get("a").text()).toBe("https://example.org/updated");
    expect(wrapper.get("a").attributes("href")).toBe(
      "https://example.org/updated",
    );
    record.homepage = null;
    await wrapper.vm.$nextTick();
    expect(wrapper.find("a").exists()).toBe(false);
  });

  it("right-aligns the homepage on smaller screens", async () => {
    $store.state.record.currentRecord.fairsharingRecord.homepage =
      "https://example.org";
    await wrapper.vm.$nextTick();
    expect(wrapper.get(".full-width").classes()).not.toContain("justify-end");
    vi.stubGlobal("innerWidth", 400);
    vuetify.display.update();
    await wrapper.vm.$nextTick();
    expect(wrapper.get(".full-width").classes()).toContain("justify-end");
  });
});
