import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import EditTags from "@/components/Editor/GeneralInformation/EditTags.vue";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";

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

const $store = new Vuex.Store({
  modules: {
    record: recordStore,
    editor: editorStore,
  },
});

let wrapper;

describe("Editor -> EditTags.vue", () => {
  beforeEach(() => {
    wrapper = shallowMount(EditTags, {
      global: {
        plugins: [$store],
        mocks: {
          $scrollTo: scrollToMock,
        },
      },
    });
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
    vi.spyOn(console, "warn").mockImplementation(() => {});
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
    graphStub.returns({ searchTags: [newTag] });
    // wrapper.vm.searchString = "test";
    wrapper.vm.$options.watch.searchString.call(wrapper.vm, "test");
    expect(wrapper.vm.tags).toStrictEqual([]);
    await wrapper.vm.getTags("test");
    expect(wrapper.vm.tags).toStrictEqual([newTag]);
    graphStub.restore();
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
});
