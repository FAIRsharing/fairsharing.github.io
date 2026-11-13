import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Collections from "@/components/Records/Record/Collections.vue";
import Record from "@/store/recordData.js";
import {
  VVirtualScrollStub,
  VSlotStub,
  VTabsStub,
  VTabStub,
  VTabsWindowStub,
  VTabsWindowItemStub,
  VAutocompleteStub,
  VTooltipStub,
  VRouterLinkStub,
} from "../../../../stubs/index.js";

const vuetify = createVuetify();

const this_record = {
  id: 999,
  name: "this record",
  abbreviation: "TR",
  registry: "Policy",
  type: "journal",
};
Record.state.currentRecord["fairsharingRecord"] = {
  name: "policy",
  registry: "Policy",
  recordAssociations: [
    {
      fairsharingRecord: this_record,
      linkedRecord: {
        id: 1,
        name: "a name",
        abbreviation: "an",
        registry: "Standard",
        type: "terminology_artifact",
      },
      recordAssocLabel: "recommends",
    },
    {
      fairsharingRecord: this_record,
      linkedRecord: {
        id: 2,
        name: "a name 2",
        abbreviation: "an2",
        registry: "Database",
        type: "knowledgebase",
      },
      recordAssocLabel: "recommends",
    },
    {
      fairsharingRecord: this_record,
      linkedRecord: {
        id: 3,
        name: "a name 3",
        abbreviation: "an3",
        registry: "Policy",
        type: "journal",
      },
      recordAssocLabel: "related_to",
    },
    {
      fairsharingRecord: this_record,
      linkedRecord: {
        id: 4,
        name: "a name 4",
        abbreviation: "an4",
        registry: "Policy",
        type: "journal",
      },
      recordAssocLabel: "extends",
    },
    {
      fairsharingRecord: this_record,
      linkedRecord: {
        id: 5,
        name: "a name 5",
        abbreviation: "an5",
        registry: "Policy",
        type: "journal",
      },
      recordAssocLabel: "deprecates",
    },
  ],
  reverseRecordAssociations: [
    {
      fairsharingRecord: {
        id: 20,
        name: "d name",
        registry: "Collection",
        type: "collection",
      },
      recordAssocLabel: "collects",
    },
    {
      fairsharingRecord: {
        id: 21,
        name: "e name",
        registry: "Policy",
        type: "journal",
      },
      recordAssocLabel: "recommends",
    },
  ],
  savedSearches: [
    {
      id: 203,
      name: "June17_4",
      comments: "",
      url: "http://www.test.com",
      fairsharingRecords: [
        {
          name: "Test name",
          id: 5239,
          status: "ready",
          registry: "Policy",
          type: "journal",
        },
      ],
    },
  ],
};

const $store = new Vuex.Store({
  modules: {
    record: Record,
  },
});
const initialRecord = structuredClone(
  Record.state.currentRecord.fairsharingRecord,
);

describe("Collections.vue", function () {
  let wrapper;

  const scrollTo = vi.fn();
  const mountOptions = {
    global: {
      plugins: [vuetify, $store],
      mocks: { $scrollTo: scrollTo },
      stubs: {
        VCard: VSlotStub,
        VList: VSlotStub,
        VAutocomplete: VAutocompleteStub,
        VTabs: VTabsStub,
        VTab: VTabStub,
        VTabsWindow: VTabsWindowStub,
        VTabsWindowItem: VTabsWindowItemStub,
        VVirtualScroll: VVirtualScrollStub,
        VTooltip: VTooltipStub,
        "router-link": VRouterLinkStub,
      },
    },
  };
  beforeEach(() => {
    scrollTo.mockClear();
    Record.state.currentRecord.fairsharingRecord =
      structuredClone(initialRecord);
    wrapper = shallowMount(Collections, mountOptions);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Collections");
  });

  it("runs prepareAssociations correctly", () => {
    let result = wrapper.vm.prepareAssociations(
      Record.state.currentRecord["fairsharingRecord"].recordAssociations,
      Record.state.currentRecord["fairsharingRecord"].reverseRecordAssociations,
    );
    expect(result[0]).toStrictEqual({
      recordAssocLabel: ["recommends"],
      recordAssociationLabel: "recommends",
      id: 1,
      registry: "Standard",
      abbreviation: "an",
      type: "terminology_artifact",
      linkType: "linkedRecord",
      name: "a name",
      object: "policy",
      subject: "a name",
    });
    expect(result.length).toEqual(7);
  });

  it("search data is reactive when user changes text box value", async () => {
    wrapper.vm.tabsData.selectedTab = 1;
    wrapper.vm.selectedValues = "a name 3";
    await wrapper.vm.$nextTick();
    expect(
      wrapper.vm.filterList.related_policies.data.map((r) => r.name),
    ).toEqual(["a name 3"]);
    wrapper.vm.selectedValues = "not going to find me!";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.filterList.related_policies.data).toHaveLength(4);
    wrapper.vm.tabsData.tabs.in_collections.data = [];
    expect(wrapper.vm.filterList.in_collections.data).toEqual([]);
  });

  /*
   * Test to see if the current implementation complies with:
   * https://fairsharing.gitbook.io/fairsharing/associated-records/from-data-policy-records
   */
  it("shows the latest configuration correctly for policies", () => {
    wrapper.vm.prepareTabsData();
    expect(wrapper.vm.tabsData.tabs.in_collections.count).toEqual(1);
    expect(wrapper.vm.tabsData.tabs.related_policies.count).toEqual(4);
    expect(wrapper.vm.tabsData.tabs.in_policies).toBe(undefined);
    expect(wrapper.vm.tabsData.tabs.conforming_resources.count).toEqual(1);
    wrapper.vm.currentRecord.fairsharingRecord.registry = "Standard";
    wrapper.vm.prepareTabsData();
    expect(wrapper.vm.tabsData.tabs.in_collections.count).toEqual(1);
    expect(wrapper.vm.tabsData.tabs.in_policies.count).toEqual(1);
    expect(wrapper.vm.tabsData.tabs.related_policies.count).toBe(0); // still hanging around from last run
  });

  it("can check if there are no record recordAssociations or reverseRecordAssociations", () => {
    delete Record.state.currentRecord.fairsharingRecord.recordAssociations;
    delete Record.state.currentRecord.fairsharingRecord
      .reverseRecordAssociations;
    expect(wrapper.vm.prepareTabsData()).toBe(false);
  });

  it("renders incoming collections, policy relations, tooltips and saved searches", () => {
    expect(wrapper.findComponent({ name: "SectionTitle" }).props("title")).toBe(
      "Collections & Recommendations",
    );
    expect(wrapper.find('a[href="/20"]').text()).toContain("d name");
    expect(wrapper.find('a[href="/3"]').text()).toContain("a name 3");
    expect(wrapper.text()).toContain("related to");
    expect(wrapper.findComponent({ name: "SavedSearches" }).exists()).toBe(
      true,
    );
    expect(
      wrapper
        .findAllComponents({ name: "RecordStatus" })
        .every((c) => c.props("showStatus") === false),
    ).toBe(true);
  });

  it("scrolls to the page top when a related record is clicked", async () => {
    const link = wrapper.find('a[href="/20"]');
    link.element.addEventListener("click", (e) => e.preventDefault(), {
      once: true,
    });
    await link.trigger("click");
    expect(scrollTo).toHaveBeenCalledWith("body", 0, {});
  });

  it("synchronizes tab models and clears the selected search when a tab activates", async () => {
    wrapper.findComponent(VTabsStub).vm.$emit("update:modelValue", 1);
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(VTabsWindowStub).props("modelValue")).toBe(1);
    wrapper.findComponent(VTabsWindowStub).vm.$emit("update:modelValue", 0);
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(VTabsStub).props("modelValue")).toBe(0);
    await wrapper.setData({ selectedValues: "d name" });
    wrapper
      .findAllComponents({ name: "VTab" })
      .at(1)
      .vm.$emit("group:selected", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedValues).toBeNull();
  });

  it("allows autocomplete selection once the active tab contains at least five records", async () => {
    const data = Array.from({ length: 5 }, (_, i) => ({
      id: 100 + i,
      name: `Collection ${i}`,
      object: "policy",
      subject: `Collection ${i}`,
      recordAssociationLabel: "collects",
    }));
    wrapper.vm.tabsData.tabs.in_collections.data = data;
    wrapper.vm.tabsData.tabs.in_collections.count = data.length;
    await wrapper.vm.$nextTick();
    const autocomplete = wrapper.findComponent(VAutocompleteStub);
    expect(autocomplete.props("disabled")).toBe(false);
    await wrapper.find('[data-test="v-autocomplete"]').setValue("Collection 2");
    expect(wrapper.vm.selectedValues).toBe("Collection 2");
    expect(wrapper.vm.filterList.in_collections.data).toEqual([data[2]]);
    expect(wrapper.find('[data-test="v-autocomplete-items"]').text()).toContain(
      "Collection 2",
    );
    expect(wrapper.vm.tabsData.tabs.in_collections.data).toHaveLength(5);
  });

  it.each(["Policy", "Standard"])(
    "builds the appropriate tabs for a fresh %s record",
    async (registry) => {
      wrapper.unmount();
      Record.state.currentRecord.fairsharingRecord.registry = registry;
      wrapper = shallowMount(Collections, mountOptions);
      await wrapper.vm.$nextTick();
      expect(Object.keys(wrapper.vm.tabsData.tabs)).toEqual(
        registry === "Policy"
          ? ["in_collections", "related_policies", "conforming_resources"]
          : ["in_collections", "in_policies"],
      );
      if (registry === "Standard")
        expect(
          wrapper.vm.tabsData.tabs.in_policies.data.map((r) => r.id),
        ).toEqual([21]);
      expect(wrapper.vm.tabsData.selectedTab).toBe(0);
    },
  );

  it.each(["related", "collections", "empty"])(
    "updates tab focus and counts when saved searches are removed: %s",
    async (available) => {
      wrapper.vm.tabsData.selectedTab = 2;
      if (available !== "related")
        wrapper.vm.tabsData.tabs.related_policies.data = [];
      if (available === "empty")
        wrapper.vm.tabsData.tabs.in_collections.data = [];
      wrapper.vm.selectedValues = "old selection";
      $store.state.record.currentRecord = {
        fairsharingRecord: {
          ...structuredClone(initialRecord),
          savedSearches: [],
        },
      };
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.tabsData.tabs.conforming_resources.count).toBe(0);
      if (available === "related")
        expect(wrapper.vm.tabsData.selectedTab).toBe(1);
      if (available === "collections")
        expect(wrapper.vm.tabsData.selectedTab).toBe(0);
      expect(wrapper.vm.selectedValues).toBeNull();
    },
  );

  it("updates conforming-resource counts when saved searches remain", async () => {
    $store.state.record.currentRecord = {
      fairsharingRecord: {
        ...structuredClone(initialRecord),
        savedSearches: [
          ...structuredClone(initialRecord.savedSearches),
          { id: 204, name: "Another" },
        ],
      },
    };
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.tabsData.tabs.conforming_resources.count).toBe(2);
  });

  it("hides the whole section when associations and saved searches are empty", async () => {
    wrapper.unmount();
    Record.state.currentRecord.fairsharingRecord = {
      name: "Empty",
      registry: "Policy",
      recordAssociations: [],
      reverseRecordAssociations: [],
      savedSearches: [],
    };
    wrapper = shallowMount(Collections, mountOptions);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.tabsDataExist).toBe(true);
    expect(wrapper.findComponent(VTabsStub).exists()).toBe(false);
    expect(wrapper.findComponent({ name: "SectionTitle" }).exists()).toBe(
      false,
    );
  });
});
