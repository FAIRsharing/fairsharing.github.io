import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import NewTags from "@/components/Editor/GeneralInformation/NewTags.vue";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";

const scrollToMock = vi.fn();

editorStore.state.allTags = [{ label: "not abc", model: "subject" }];
recordStore.state.sections = {
  generalInformation: { data: { userDefinedTags: [] } },
};
const $store = new Vuex.Store({
  modules: {
    editor: editorStore,
    record: recordStore,
  },
});

let $route = { path: "/123/edit", params: { id: 123 } };

let wrapper;

describe("Editor -> NewTags.vue", () => {
  beforeEach(() => {
    wrapper = shallowMount(NewTags, {
      global: {
        plugins: [$store],
        mocks: {
          $route,
          $scrollTo: scrollToMock,
        },
      },
    });
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("NewTags");
  });

  it("can add a term to the add list", () => {
    wrapper.vm.addTerm();
    expect(wrapper.vm.error).toBe(false);
    wrapper.vm.newTerm = " abc ";
    wrapper.vm.addTerm();
    expect(wrapper.vm.newTags).toStrictEqual(["abc"]);
    expect(wrapper.vm.newTerm).toBe(null);
    wrapper.vm.newTerm = "not abc";
    wrapper.vm.addTerm();
    expect(wrapper.vm.error).toBe("Term not abc already declared as a subject");
    wrapper.vm.newTerm = "abc";
    wrapper.vm.addTerm();
    expect(wrapper.vm.error).toBe("Term abc is already in creation list");
  });

  it("can remove a term from add list", () => {
    wrapper.vm.newTags = ["def", "ijk"];
    wrapper.vm.removeItem("def");
    expect(wrapper.vm.newTags).toStrictEqual(["ijk"]);
    wrapper.vm.removeItem("test");
    expect(wrapper.vm.newTags).toStrictEqual(["ijk"]);
  });

  it("can add the add list to the record", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    wrapper.vm.newTags = ["def", "ijk"];
    wrapper.vm.createTerms();
    expect(wrapper.vm.newTags).toStrictEqual([]);
    expect(wrapper.vm.loading).toStrictEqual(false);
    expect(wrapper.vm.showOverlay).toStrictEqual(false);
    vi.clearAllMocks();
  });

  it("can check email computed property", () => {
    let output = "test";
    expect(wrapper.vm.email).toBe(output);
  });

  it("handles formValid form v-model updates", async () => {
    await wrapper.setData({ formValid: false });
    const form = wrapper.findComponent({ name: "v-form" });
    expect(form.props("modelValue")).toBe(false);
    await form.vm.$emit("update:modelValue", true);
    expect(wrapper.vm.formValid).toBe(true);
  });
});
