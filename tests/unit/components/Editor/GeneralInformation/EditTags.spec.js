import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import EditTags from "@/components/Editor/GeneralInformation/EditTags.vue";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";

import {
  VDataTableStub,
  VFormStub,
  VMenuStub,
  VSwitchStub,
  VTextFieldStub,
  VTooltipStub,
} from "../../../../stubs/index.js";
import { VIconStub } from "../../../../stubs/VIconStub.js";

const sinon = require("sinon");

const scrollToMock = vi.fn();

recordStore.state.sections = {
  generalInformation: {
    data: {
      domains: [{ id: 1, label: "test" }],
      subjects: [{ id: 1, label: "test" }],
      taxonomies: [{ id: 1, label: "test" }],
      userDefinedTags: [{ id: 1, label: "test" }],
      objectTypes: [{ id: 1, label: "test" }],
    },
    initialData: {
      taxonomies: [{ id: 1, label: "test" }],
      domains: [],
      userDefinedTags: [],
      subjects: [],
      objectTypes: [],
    },
  },
};

editorStore.state.tags = [
  { id: 1, label: "test", model: "domain" },
  { id: 2, label: "test2", model: "domain" },
  { id: 1, label: "test", model: "subject" },
  { id: 1, label: "test", model: "taxonomy" },
  { id: 1, label: "test", model: "user_defined_tag" },
  { id: 1, label: "test", model: "object_type" },
];
const initialSections = structuredClone(recordStore.state.sections);
const initialTags = structuredClone(editorStore.state.tags);

const $store = new Vuex.Store({
  modules: {
    record: recordStore,
    editor: editorStore,
  },
});

let wrapper;

describe("Editor -> EditTags.vue", () => {
  beforeEach(async () => {
    $store.state.record.sections = structuredClone(initialSections);
    $store.state.editor.tags = structuredClone(initialTags);
    $store.state.editor.allTags = false;
    wrapper = shallowMount(EditTags, {
      global: {
        plugins: [$store],
        mocks: {
          $scrollTo: scrollToMock,
        },
        stubs: {
          VForm: VFormStub,
          VTooltip: VTooltipStub,
          VMenu: VMenuStub,
          VIcon: VIconStub,
          VSwitch: VSwitchStub,
          VChip: {
            name: "VChip",
            props: ["disabled", "color"],
            template:
              '<button type="button" :disabled="disabled" :data-color="color"><slot /></button>',
          },
          VTextField: {
            ...VTextFieldStub,
            inheritAttrs: false,
            template:
              '<div><slot name="prepend" /><input v-bind="$attrs" :aria-label="label" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
          },
          VDataTable: {
            ...VDataTableStub,
            name: "VDataTable",
            props: {
              ...VDataTableStub.props,
              modelValue: Array,
              searchInput: String,
            },
            emits: ["update:modelValue", "update:searchInput"],
            template: `
              <table data-test="v-data-table">
                <thead><tr><th v-for="header in headers" :key="header.value">{{ header.title }}</th></tr></thead>
                <tbody><tr v-for="(item, index) in items" :key="item.model + '_' + item.id + '_' + index">
                  <td v-for="header in headers" :key="header.value"><slot :name="'item.' + header.value" :item="item" /></td>
                </tr></tbody>
              </table>
            `,
          },
        },
      },
    });
    await flushPromises();
  });

  afterEach(async () => {
    await flushPromises();
    wrapper.unmount();
    vi.restoreAllMocks();
    scrollToMock.mockClear();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("EditTags");
    expect(wrapper.vm.recordTags.length).toBe(5);
    expect(wrapper.vm.buttonIcon).toBe("fas fa-plus-circle");
    expect(wrapper.vm.buttonLabel).toBe("Add/edit tags");
    wrapper.vm.menu.show = true;
    expect(wrapper.vm.buttonIcon).toBe("fas fa-minus-circle");
    expect(wrapper.vm.buttonLabel).toBe("Hide table");
  });

  it("can react to showTypes", () => {
    expect(wrapper.vm.tags.length).toBe(6);
    wrapper.vm.showTypes = {
      domain: false,
      taxonomy: true,
      subject: true,
      user_defined_tag: true,
    };
    wrapper.vm.partialTags();
    expect(wrapper.vm.tags.length).toBe(3);
  });

  it("can open/close the menu", () => {
    wrapper.vm.showMenu();
    expect(wrapper.vm.menu.show).toBe(true);
    expect(scrollToMock).toHaveBeenCalledTimes(1);
    expect(scrollToMock).toHaveBeenCalledWith("#editTags");
    vi.clearAllMocks();
    wrapper.vm.showMenu();
    expect(wrapper.vm.menu.show).toBe(false);
    expect(wrapper.vm.menu.show).toBe(false);
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it("can remove a specific tag", () => {
    let test = [1, 2, 3];
    wrapper.vm.removeTag(test, 1);
    expect(test).toStrictEqual([1, 3]);
  });

  it("can commit the record tags to the store", () => {
    const newTag = { id: 2, label: "test2", model: "domain" };
    wrapper.vm.recordTags = [newTag];
    expect(
      wrapper.vm.getSection("generalInformation").data.domains,
    ).toStrictEqual([newTag]);
    expect(
      wrapper.vm.getSection("generalInformation").data.subjects,
    ).toStrictEqual([]);
    wrapper.vm.initialized = false;
    wrapper.vm.recordTags = [
      { id: 3, label: "test3", model: "domain" },
      { id: 4, label: "test4", model: "object_type" },
    ];
    expect(
      wrapper.vm.getSection("generalInformation").data.domains,
    ).toStrictEqual([newTag]);
  });

  it("can search the endpoint based on user input", async () => {
    let graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
    const newTag = { id: 1, label: "test124", model: "subject" };
    let resolveSearch;
    graphStub.callsFake(
      () =>
        new Promise((resolve) => {
          resolveSearch = resolve;
        }),
    );
    try {
      wrapper.vm.searchString = "  test  ";
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.tags).toStrictEqual([]);
      expect(wrapper.vm.loading).toBe(true);
      expect(graphStub.calledOnce).toBe(true);
      expect(graphStub.firstCall.args[0].queryParam).toEqual({ q: "test" });
      resolveSearch({ searchTags: [newTag] });
      await flushPromises();
      expect(wrapper.vm.tags).toStrictEqual([newTag]);
      expect(wrapper.vm.loading).toBe(false);
      expect(scrollToMock).toHaveBeenLastCalledWith("#editTags");
    } finally {
      graphStub.restore();
    }
  });

  it("handles formValid form v-model updates", async () => {
    await wrapper.setData({ formValid: false });
    const form = wrapper.findComponent({ name: "v-form" });
    expect(form.props("modelValue")).toBe(false);
    await form.vm.$emit("update:modelValue", true);
    expect(wrapper.vm.formValid).toBe(true);
  });

  it("can check isNew method", () => {
    const termToCheck = { id: 1, label: "test" };
    const result = wrapper.vm.isNew(termToCheck, "taxonomic range");
    expect(result).toBe(false);
  });

  it("can check initialSections computed property", async () => {
    let output = {
      "taxonomic range":
        wrapper.vm.getSection("generalInformation").initialData.taxonomies,
      subjects:
        wrapper.vm.getSection("generalInformation").initialData.subjects,
      domains: wrapper.vm.getSection("generalInformation").initialData.domains,
      "user defined tags":
        wrapper.vm.getSection("generalInformation").initialData.userDefinedTags,
      "object types":
        wrapper.vm.getSection("generalInformation").initialData.objectTypes,
    };
    expect(wrapper.vm.initialSections).toStrictEqual(output);
  });

  it("can check sections computed property", async () => {
    let output = {
      "taxonomic range": {
        items: wrapper.vm.getSection("generalInformation").data.taxonomies,
        color: wrapper.vm.colors["taxonomy"],
        tooltip: wrapper.vm.tooltips.species,
      },
      subjects: {
        items: wrapper.vm.getSection("generalInformation").data.subjects,
        color: wrapper.vm.colors["subject"],
        tooltip: wrapper.vm.tooltips.subjects,
      },
      domains: {
        items: wrapper.vm.getSection("generalInformation").data.domains,
        color: wrapper.vm.colors["domain"],
        tooltip: wrapper.vm.tooltips.domains,
      },
      "user defined tags": {
        items: wrapper.vm.getSection("generalInformation").data.userDefinedTags,
        color: wrapper.vm.colors["user_defined_tag"],
        tooltip: wrapper.vm.tooltips.userDefinedTags,
      },
      "object types": {
        items: wrapper.vm.getSection("generalInformation").data.objectTypes,
        color: wrapper.vm.colors["object_type"],
        tooltip: wrapper.vm.tooltips.objectTypes,
      },
    };
    expect(wrapper.vm.sections).toStrictEqual(output);
  });

  it("renders saved and newly added terms using different chip styles", () => {
    const rows = wrapper.findAll("#tagsTable tr");
    expect(rows).toHaveLength(5);
    const saved = rows
      .find((row) => row.text().includes("TAXONOMIC RANGE"))
      .findComponent({ name: "VChip" });
    const added = rows
      .find((row) => row.text().includes("DOMAINS"))
      .findComponent({ name: "VChip" });
    expect(saved.classes()).toContain("bg-white");
    expect(saved.props("color")).toBe(wrapper.vm.colors.taxonomy);
    expect(added.props("color")).toBe("white");
    expect(added.classes()).toContain(`bg-${wrapper.vm.colors.domain}`);
    expect(wrapper.vm.initialized).toBe(true);
    expect(wrapper.vm.loading).toBe(false);
  });

  it("opens the selection table from a section row and closes it from the toggle", async () => {
    expect(wrapper.findComponent({ name: "VDataTable" }).exists()).toBe(false);
    await wrapper.find("#tagsTable tr").trigger("click");
    expect(wrapper.findComponent({ name: "VDataTable" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "NewTags" }).exists()).toBe(true);
    expect(wrapper.find(".shadowChip").text()).toContain("Hide table");
    expect(scrollToMock).toHaveBeenCalledExactlyOnceWith("#editTags");
    await wrapper.find(".shadowChip").trigger("click");
    expect(wrapper.findComponent({ name: "VDataTable" }).exists()).toBe(false);
    expect(wrapper.find(".shadowChip").text()).toContain("Add/edit tags");
    expect(scrollToMock).toHaveBeenCalledTimes(1);
  });

  it("removes a term through its icon without opening the selection menu", async () => {
    const row = wrapper
      .findAll("#tagsTable tr")
      .find((item) => item.text().includes("TAXONOMIC RANGE"));
    const chip = row.findComponent({ name: "VChip" });
    await chip.trigger("click");
    expect(wrapper.vm.menu.show).toBe(false);
    const remove = row
      .findAll('[data-test="v-icon"]')
      .find((item) => item.text().includes("fa-times-circle"));
    await remove.trigger("click");
    expect(
      $store.state.record.sections.generalInformation.data.taxonomies,
    ).toEqual([]);
    expect(wrapper.vm.initialSections["taxonomic range"]).toEqual([
      { id: 1, label: "test" },
    ]);
    expect(wrapper.vm.menu.show).toBe(false);
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it.each([
    ["taxonomy", 0],
    ["subject", 1],
    ["domain", 2],
    ["user_defined_tag", 3],
    ["object_type", 4],
  ])("filters %s terms through its settings switch", async (model, index) => {
    await wrapper.find(".shadowChip").trigger("click");
    const input = wrapper
      .findAllComponents({ name: "VSwitch" })
      .at(index)
      .find("input");
    await input.setValue(false);
    expect(wrapper.vm.showTypes[model]).toBe(false);
    expect(wrapper.vm.tags.some((item) => item.model === model)).toBe(false);
    expect(
      wrapper.findComponent({ name: "VDataTable" }).props("items"),
    ).toEqual(wrapper.vm.tags);
    await input.setValue(true);
    expect(wrapper.vm.showTypes[model]).toBe(true);
    expect(wrapper.vm.tags).toHaveLength(6);
  });

  it("groups selected terms into all five record sections through the table v-model", async () => {
    await wrapper.find(".shadowChip").trigger("click");
    const selected = [
      "domain",
      "taxonomy",
      "subject",
      "user_defined_tag",
      "object_type",
    ].map((model, index) => ({
      id: index + 20,
      label: `Term ${index}`,
      model,
    }));
    const table = wrapper.findComponent({ name: "VDataTable" });
    await table.vm.$emit("update:modelValue", selected);
    const data = $store.state.record.sections.generalInformation.data;
    expect(data.domains).toEqual([selected[0]]);
    expect(data.taxonomies).toEqual([selected[1]]);
    expect(data.subjects).toEqual([selected[2]]);
    expect(data.userDefinedTags).toEqual([selected[3]]);
    expect(data.objectTypes).toEqual([selected[4]]);
    expect(wrapper.vm.recordTags).toHaveLength(5);
    expect(wrapper.vm.isNew(selected[1], "taxonomic range")).toBe(true);
    wrapper.vm.initialized = false;
    await table.vm.$emit("update:modelValue", []);
    expect(data.domains).toEqual([selected[0]]);
    wrapper.vm.initialized = true;
    await table.vm.$emit("update:modelValue", []);
    expect(wrapper.vm.recordTags).toEqual([]);
    expect(wrapper.vm.initialSections["taxonomic range"]).toEqual([
      { id: 1, label: "test" },
    ]);
  });

  it("searches through the text field and renders tag metadata", async () => {
    const results = [
      {
        id: 10,
        model: "taxonomy",
        label: "HOMO SAPIENS",
        definitions: ["A taxonomic definition"],
        synonyms: ["human", "H. sapiens"],
      },
      { id: 11, model: "subject", label: "genome annotation" },
    ];
    const query = vi
      .spyOn(GraphClient.prototype, "executeQuery")
      .mockResolvedValue({ searchTags: results });
    await wrapper.find(".shadowChip").trigger("click");
    scrollToMock.mockClear();
    await wrapper
      .find('input[aria-label="Search names and synonyms"]')
      .setValue("  human  ");
    await flushPromises();
    expect(query.mock.calls[0][0].queryParam).toEqual({ q: "human" });
    const table = wrapper.findComponent({ name: "VDataTable" });
    expect(table.text()).toContain("Homo sapiens");
    expect(table.text()).toContain("Genome Annotation");
    expect(table.text()).toContain("A taxonomic definition");
    expect(table.text()).toContain("human, H. sapiens");
    expect(table.text()).toContain("TAXONOMY");
    expect(wrapper.vm.loading).toBe(false);
    expect(scrollToMock).toHaveBeenCalledExactlyOnceWith("#editTags");
  });

  it("updates the search string through the table's named v-model", async () => {
    const query = vi
      .spyOn(GraphClient.prototype, "executeQuery")
      .mockResolvedValue({ searchTags: [] });
    await wrapper.find(".shadowChip").trigger("click");
    await wrapper
      .findComponent({ name: "VDataTable" })
      .vm.$emit("update:searchInput", "taxonomy");
    await flushPromises();
    expect(wrapper.vm.searchString).toBe("taxonomy");
    expect(query.mock.calls[0][0].queryParam).toEqual({ q: "taxonomy" });
    expect(wrapper.vm.tags).toEqual([]);
  });

  it.each(["older-first", "newer-first"])(
    "keeps the latest search results when responses finish %s",
    async (order) => {
      const requests = new Map();
      vi.spyOn(GraphClient.prototype, "executeQuery").mockImplementation(
        (query) =>
          new Promise((resolve) => {
            requests.set(query.queryParam.q, resolve);
          }),
      );
      await wrapper.find(".shadowChip").trigger("click");
      scrollToMock.mockClear();
      const input = wrapper.find(
        'input[aria-label="Search names and synonyms"]',
      );
      await input.setValue("old");
      await input.setValue("new");
      const oldTag = { id: 30, model: "subject", label: "old result" };
      const newTag = { id: 31, model: "subject", label: "new result" };
      if (order === "older-first") {
        requests.get("old")({ searchTags: [oldTag] });
        await flushPromises();
        expect(wrapper.vm.tags).toEqual([]);
        expect(wrapper.vm.loading).toBe(true);
        requests.get("new")({ searchTags: [newTag] });
      } else {
        requests.get("new")({ searchTags: [newTag] });
        await flushPromises();
        requests.get("old")({ searchTags: [oldTag] });
      }
      await flushPromises();
      expect(wrapper.vm.tags).toEqual([newTag]);
      expect(wrapper.vm.lastQuery).toBe("new");
      expect(wrapper.vm.loading).toBe(false);
      expect(scrollToMock).toHaveBeenCalledTimes(1);
    },
  );

  it("finishes loading and clears results when the search API rejects", async () => {
    vi.spyOn(GraphClient.prototype, "executeQuery").mockRejectedValue(
      new Error("Tag search unavailable"),
    );
    await wrapper.find(".shadowChip").trigger("click");
    await wrapper
      .find('input[aria-label="Search names and synonyms"]')
      .setValue("unavailable");
    await flushPromises();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.tags).toEqual([]);
    expect(
      wrapper.findComponent({ name: "VDataTable" }).props("items"),
    ).toEqual([]);
    expect(wrapper.find(".shadowChip").attributes("disabled")).toBeUndefined();
  });
});
