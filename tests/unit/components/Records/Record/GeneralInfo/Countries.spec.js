import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Countries from "@/components/Records/Record/GeneralInfo/Countries.vue";
import Record from "@/store/recordData.js";
import {
  VIconStub,
  VRouterLinkStub,
  VTooltipStub,
} from "../../../../../stubs/index.js";

const vuetify = createVuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      countries: "Country tooltip.",
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
  countries: [],
  userDefinedTags: [{ label: "a" }],
};
const initialRecord = structuredClone(Record.state.currentRecord);
const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor,
  },
});

describe("Countries.vue", function () {
  let wrapper;

  beforeEach(() => {
    $store.commit("record/setCurrentRecord", structuredClone(initialRecord));
    vi.stubGlobal("innerWidth", 1280);
    vuetify.display.update();
    wrapper = shallowMount(Countries, {
      vuetify,
      mocks: { $store },
      stubs: {
        VIcon: VIconStub,
        VTooltip: VTooltipStub,
        "router-link": VRouterLinkStub,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.unstubAllGlobals();
    vuetify.display.update();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Countries");
  });

  it("can sort countries", () => {
    $store.state.record.currentRecord.fairsharingRecord.countries = [
      { name: "Nantierre", id: 2, code: "NT" },
      { name: "Welfland", id: 1, code: "WL" },
    ];
    expect(wrapper.vm.sortCountries()).toStrictEqual([
      { name: "Welfland", id: 1, code: "WL" },
      { name: "Nantierre", id: 2, code: "NT" },
    ]);
  });

  it("shows the empty state and country tooltip", () => {
    expect(wrapper.text()).toContain("None found");
    expect(wrapper.text()).toContain("Country tooltip.");
    expect(wrapper.find('[data-test="v-icon"]').exists()).toBe(true);
    expect(wrapper.vm.sortCountries()).toEqual([]);
    expect(wrapper.find("a").exists()).toBe(false);
  });

  it("renders sorted search links without changing the record's country order", async () => {
    const countries = [
      { name: "France", id: 9, code: "FR" },
      { name: "Canada", id: 2, code: "CA" },
    ];
    $store.state.record.currentRecord.fairsharingRecord.countries = countries;
    await wrapper.vm.$nextTick();
    const links = wrapper.findAll("a");
    expect(links.map((link) => link.attributes("href"))).toEqual([
      "/search?countries=Canada",
      "/search?countries=France",
    ]);
    expect(links.map((link) => link.text())).toEqual(["Canada,", "France"]);
    expect(
      $store.state.record.currentRecord.fairsharingRecord.countries.map(
        (country) => country.id,
      ),
    ).toEqual([9, 2]);
    expect(wrapper.text()).not.toContain("None found");
  });

  it("renders a warning for a country with no name", async () => {
    $store.state.record.currentRecord.fairsharingRecord.countries = [
      { id: 1, code: "XX" },
    ];
    await wrapper.vm.$nextTick();
    expect(wrapper.get(".bg-warning").text()).toBe("country code undefined!");
    expect(wrapper.find("a p").exists()).toBe(false);
  });

  it("aligns country information to the right on small screens", async () => {
    const details = () => wrapper.get(".full-width");
    expect(details().classes()).not.toContain("justify-end");
    vi.stubGlobal("innerWidth", 400);
    vuetify.display.update();
    await wrapper.vm.$nextTick();
    expect(details().classes()).toContain("justify-end");
  });
});
