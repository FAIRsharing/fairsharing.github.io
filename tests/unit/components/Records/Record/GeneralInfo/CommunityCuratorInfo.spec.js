import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import CommunityCuratorInfo from "@/components/Records/Record/GeneralInfo/CommunityCuratorInfo";
import Record from "@/store/recordData.js";
import { VRouterLinkStub } from "../../../../../stubs/index.js";

const vuetify = createVuetify();

Record.state.currentRecord["fairsharingRecord"] = {
  doi: "FAIRsharing.wibble",
  subjects: [],
  domains: [],
  taxonomies: [],
  communityCurators: [],
  userDefinedTags: [{ label: "a" }],
};
const initialRecord = structuredClone(Record.state.currentRecord);
const $store = new Vuex.Store({
  modules: {
    record: Record,
  },
});

describe("CommunityCuratorInfo.vue", function () {
  let wrapper;

  beforeEach(() => {
    $store.commit("record/setCurrentRecord", structuredClone(initialRecord));
    vi.stubGlobal("innerWidth", 1280);
    vuetify.display.update();
    wrapper = shallowMount(CommunityCuratorInfo, {
      vuetify,
      mocks: { $store },
      stubs: { "router-link": VRouterLinkStub },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.unstubAllGlobals();
    vuetify.display.update();
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("CommunityCuratorInfo");
  });

  it("hides the community champions section when none have contributed", () => {
    expect(wrapper.find("b").exists()).toBe(false);
    expect(wrapper.find("a").exists()).toBe(false);
  });

  it("renders profile links, optional ORCIDs and commas between champions", async () => {
    $store.state.record.currentRecord.fairsharingRecord.communityCurators = [
      { id: 12, username: "Alice", orcid: "0000-0001-2345-6789" },
      { id: 34, username: "Bob", orcid: null },
    ];
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("community champions have contributed");
    const profiles = wrapper.findAll('a[href^="/users/"]');
    expect(profiles.map((link) => link.attributes("href"))).toEqual([
      "/users/12",
      "/users/34",
    ]);
    expect(profiles.map((link) => link.text())).toEqual(["Alice", "Bob"]);
    expect(profiles[0].classes()).toContain("mr-1");
    expect(profiles[1].classes()).not.toContain("mr-1");
    const orcid = wrapper.get('a[href^="https://orcid.org/"]');
    expect(orcid.attributes("href")).toBe(
      "https://orcid.org/0000-0001-2345-6789",
    );
    expect(orcid.attributes("target")).toBe("_blank");
    expect(orcid.findComponent({ name: "Icon" }).props("item")).toBe("Orcid");
    expect(wrapper.findAll("span.mr-1").map((span) => span.text())).toEqual([
      ",",
      "",
    ]);
  });

  it("updates and hides the section when the record's champions change", async () => {
    const curators =
      $store.state.record.currentRecord.fairsharingRecord.communityCurators;
    curators.push({ id: 5, username: "Champion" });
    await wrapper.vm.$nextTick();
    expect(wrapper.get("a").text()).toBe("Champion");
    expect(wrapper.findAll("span.mr-1").map((span) => span.text())).toEqual([
      "",
    ]);
    curators.splice(0, 1);
    await wrapper.vm.$nextTick();
    expect(wrapper.find("b").exists()).toBe(false);
    expect(wrapper.find("a").exists()).toBe(false);
  });
});
