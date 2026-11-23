import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import ReferenceURL from "@/components/Records/Record/GeneralInfo/ReferenceURL.vue";
import Record from "@/store/recordData.js";
import { VIconStub, VTooltipStub } from "../../../../../stubs/index.js";

const vuetify = createVuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      reference_url: { database: "Description tooltip." },
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
const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor,
  },
});

describe("ReferenceURL.vue", function () {
  let wrapper;

  beforeEach(() => {
    $store.state.record.currentRecord.fairsharingRecord = {
      homepage: "https://example.org",
      type: "database",
      metadata: {},
    };
    wrapper = shallowMount(ReferenceURL, {
      vuetify,
      mocks: { $store },
      stubs: { VTooltip: VTooltipStub, VIcon: VIconStub },
    });
  });

  afterEach(() => wrapper.unmount());

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ReferenceURL");
  });

  it("shows As above when the reference URL is the homepage", async () => {
    $store.state.record.currentRecord.fairsharingRecord.metadata.reference_url =
      "https://example.org";
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("As above");
    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.text()).toContain("Description tooltip.");
  });

  it("links to a distinct reference URL and updates when it changes", async () => {
    const metadata =
      $store.state.record.currentRecord.fairsharingRecord.metadata;
    metadata.reference_url = "https://example.org/reference";
    await wrapper.vm.$nextTick();
    expect(wrapper.get("a").attributes("href")).toBe(metadata.reference_url);
    expect(wrapper.get("a").text()).toBe(metadata.reference_url);
    expect(wrapper.get("a").attributes("target")).toBe("_blank");
    expect(wrapper.text()).toContain("Description tooltip.");
    metadata.reference_url = null;
    await wrapper.vm.$nextTick();
    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.text()).toContain("N/A");
  });

  it("shows N/A when no reference URL is provided", () => {
    expect(wrapper.text()).toContain("N/A");
    expect(wrapper.text()).toContain("Description tooltip.");
    expect(wrapper.findComponent({ name: "NoneFound" }).exists()).toBe(false);
  });
});
