import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import relationDefinitions from "@/data/RecordRelationShipsDefinitions.json";
import { nextTick } from "vue";
import Vuex from "vuex";
import RelatedContent from "@/components/Records/Record/RelatedContent.vue";
import Record from "@/store/recordData.js";
import {
  VAutocompleteStub,
  VRouterLinkStub,
  VTabsStub,
  VTabsWindowItemStub,
  VTabsWindowStub,
  VTooltipStub,
} from "../../../../stubs/index.js";

const vuetify = createVuetify();
const $scrollTo = vi.fn();

const RenderedRelatedContent = {
  ...RelatedContent,

  computed: {
    ...RelatedContent.computed,

    tabsDataExist() {
      return false;
    },
  },
};

const ClickableTabStub = {
  name: "VTab",
  inheritAttrs: false,
  props: {
    value: {
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  template: `
    <button
      type="button"
      :disabled="disabled"
      v-bind="$attrs"
    >
      <slot />
    </button>
  `,
};

const ScopedVirtualScrollStub = {
  name: "VVirtualScroll",
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  template: `
    <div data-test="v-virtual-scroll">
      <template
        v-for="(item, index) in items"
        :key="item.id ?? index"
      >
        <slot :item="item" :index="index" />
      </template>
    </div>
  `,
};

const makeRecord = (registry = "Standard") => ({
  name: "standard",
  registry,
  recordAssociations: [
    {
      linkedRecord: {
        id: 1,
        name: "a name",
        registry: "Standard",
        type: "terminology_artifact",
      },
      recordAssocLabel: "implements",
    },
    {
      linkedRecord: {
        id: 3,
        name: "a name 3",
        registry: "Database",
        type: "journal",
      },
      recordAssocLabel: "related to",
    },
    {
      linkedRecord: {
        id: 3,
        name: "a name 3",
        registry: "Database",
        type: "journal",
      },
      recordAssocLabel: "related to",
    },
    {
      linkedRecord: {
        id: 4,
        name: "a name 4",
        registry: "Collection",
        type: "collection",
      },
      recordAssocLabel: "collects",
    },
  ],
  reverseRecordAssociations: [
    {
      fairsharingRecord: {
        id: 2,
        name: "b name",
        registry: "Policy",
        type: "repository",
      },
      recordAssocLabel: "related to",
    },
  ],
});

const $store = new Vuex.Store({
  modules: {
    record: Record,
  },
});

describe("RelatedContent.vue", () => {
  let wrapper;

  const mountComponent = () =>
    shallowMount(RenderedRelatedContent, {
      global: {
        plugins: [vuetify, $store],
        mocks: {
          $scrollTo,
          $vuetify: {
            display: {
              mdAndDown: false,
            },
          },
        },
        stubs: {
          VRouterLink: VRouterLinkStub,
          VAutocomplete: VAutocompleteStub,
          VTabs: VTabsStub,
          VTab: ClickableTabStub,
          VTabsWindow: VTabsWindowStub,
          VTabsWindowItem: VTabsWindowItemStub,
          VVirtualScroll: ScopedVirtualScrollStub,
          VTooltip: VTooltipStub,
        },
      },
    });

  beforeEach(() => {
    vi.clearAllMocks();

    $store.state.record.currentRecord.fairsharingRecord = makeRecord();

    wrapper = mountComponent();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toBe("RelatedContent");
  });

  it("reacts to selected values and selects the first populated tab", () => {
    wrapper.vm.selectedValues = "a name 3";

    wrapper.vm.tabsData.tabs.related_standards.data = [];
    wrapper.vm.tabsData.selectedTab = 1;

    wrapper.vm.selectedValues = "a name 3";
    wrapper.vm.tabsData.selectedTab = 0;

    wrapper.vm.getFirstActiveTab();

    expect(wrapper.vm.tabsData.selectedTab).toBe(1);
  });

  it("returns false when neither association property exists", () => {
    delete $store.state.record.currentRecord.fairsharingRecord
      .recordAssociations;

    delete $store.state.record.currentRecord.fairsharingRecord
      .reverseRecordAssociations;

    expect(wrapper.vm.prepareTabsData()).toBe(false);
  });

  it("filters by name and abbreviation", () => {
    let item = {
      raw: {
        name: "one",
        abbreviation: null,
      },
    };

    expect(wrapper.vm.nameAbbrFilter("", "one", item)).toBe(true);
    expect(wrapper.vm.nameAbbrFilter("", "two", item)).toBe(false);

    item = {
      raw: {
        name: "a_very_long_string",
        abbreviation: "small",
      },
    };

    expect(wrapper.vm.nameAbbrFilter("", "very", item)).toBe(true);
    expect(wrapper.vm.nameAbbrFilter("", "small", item)).toBe(true);
    expect(wrapper.vm.nameAbbrFilter("", "item", item)).toBe(false);
  });

  it("prepares and deduplicates related standards and databases", () => {
    wrapper.vm.prepareTabsData();

    expect(wrapper.vm.tabsData.tabs.related_standards.data).toHaveLength(1);

    expect(wrapper.vm.tabsData.tabs.related_databases.data).toHaveLength(1);

    expect(wrapper.vm.tabsData.tabs.related_databases.count).toBe(1);

    expect(
      wrapper.vm.tabsData.tabs.related_databases.data[0].recordAssocLabel,
    ).toEqual(["related to"]);

    expect(
      wrapper.vm.tabsData.tabs.related_fairassist_components,
    ).toBeDefined();
  });

  it("adds collections for policies and filters recommended relations", () => {
    $store.state.record.currentRecord.fairsharingRecord = makeRecord("Policy");

    const associations = [
      {
        id: 10,
        registry: "Collection",
        recordAssociationLabel: "recommends",
        name: "Recommended",
        recordAssocLabel: [],
      },
      {
        id: 11,
        registry: "Collection",
        recordAssociationLabel: "collects",
        name: "Collected",
        recordAssocLabel: [],
      },
    ];

    const prepareSpy = vi
      .spyOn(wrapper.vm, "prepareAssociations")
      .mockReturnValue(associations);

    wrapper.vm.prepareTabsData();

    expect(
      wrapper.vm.tabsData.tabs.related_collections.data.map((item) => item.id),
    ).toEqual([10]);

    expect(wrapper.vm.tabsData.tabs.related_collections.count).toBe(1);

    prepareSpy.mockRestore();
  });

  it("aggregates distinct labels for repeated relations", async () => {
    const labels = Object.keys(relationDefinitions).filter(
      (key) => typeof relationDefinitions[key] === "string",
    );

    expect(labels.length).toBeGreaterThanOrEqual(2);

    const [firstLabel, secondLabel] = labels;

    const prepareSpy = vi
      .spyOn(wrapper.vm, "prepareAssociations")
      .mockReturnValue([
        {
          id: 3,
          name: "Database",
          registry: "Database",
          recordAssociationLabel: firstLabel,
        },
        {
          id: 3,
          name: "Database",
          registry: "Database",
          recordAssociationLabel: firstLabel,
        },
        {
          id: 3,
          name: "Database",
          registry: "Database",
          recordAssociationLabel: secondLabel,
        },
      ]);

    wrapper.vm.prepareTabsData();

    await nextTick();

    const data = wrapper.vm.tabsData.tabs.related_databases.data;

    expect(data).toHaveLength(1);

    expect(data[0].recordAssocLabel).toEqual([firstLabel, secondLabel]);

    prepareSpy.mockRestore();
  });

  it("updates selectedValues through autocomplete v-model", async () => {
    const autocomplete = wrapper.findComponent({
      name: "VAutocomplete",
    });
    expect(autocomplete.exists()).toBe(true);
    autocomplete.vm.$emit("update:modelValue", "a name 3");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedValues).toBe("a name 3");
  });

  it("updates selectedTab through tabs and tabs-window v-model", async () => {
    const tabs = wrapper.findComponent({
      name: "VTabs",
    });
    expect(tabs.exists()).toBe(true);
    tabs.vm.$emit("update:modelValue", 1);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.tabsData.selectedTab).toBe(1);
    const tabsWindow = wrapper.findComponent({
      name: "VTabsWindow",
    });
    expect(tabsWindow.exists()).toBe(true);
    tabsWindow.vm.$emit("update:modelValue", 0);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.tabsData.selectedTab).toBe(0);
  });

  it("clears autocomplete selection when a tab is clicked", async () => {
    await wrapper.setData({
      selectedValues: "a name 3",
    });
    const tab = wrapper
      .findAllComponents({ name: "VTab" })
      .find((component) => component.props("disabled") !== true);
    expect(tab).toBeDefined();
    await tab.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedValues).toBeNull();
  });

  it("renders related record links and scrolls to top on click", async () => {
    const record = {
      id: 3,
      name: "Database record",
      registry: "Database",
      object: "related",
      subject: "to standard",
      recordAssocLabel: [
        Object.keys(relationDefinitions).find(
          (key) => typeof relationDefinitions[key] === "string",
        ),
      ],
    };
    await wrapper.setData({
      tabsData: {
        selectedTab: 1,
        tabs: {
          related_standards: {
            registry: ["Standard"],
            data: [],
            count: 0,
          },
          related_databases: {
            registry: ["Database"],
            data: [record],
            count: 1,
          },
        },
      },
    });
    await wrapper.vm.$nextTick();
    const link = wrapper.find('router-link-stub[to="/3"]');
    expect(link.exists(), wrapper.html()).toBe(true);
    await link.trigger("click");
    expect($scrollTo).toHaveBeenCalledWith("body", 0, {});
  });
});
