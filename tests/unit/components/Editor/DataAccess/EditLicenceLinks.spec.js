import { beforeEach, describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import EditLicenceLinks from "@/components/Editor/DataAccess/EditLicenceLinks.vue";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";

let $route = { path: "/123/edit", params: { id: 123 } };

const mockDataAccessData = {
  exhaustiveLicences: true,
  licences: [{ id: 1, name: "MIT" }],
};

recordStore.state.sections = {
  dataAccess: {
    data: {
      licences: [
        { id: 222, name: "test", licence: { id: 123, name: "myLicence" } },
      ],
    },
    initialData: {
      licences: [
        { id: 222, name: "test", licence: { id: 123, name: "myLicence" } },
      ],
    },
  },
};
recordStore.getters = {
  getSection: () => (sectionName) => {
    if (sectionName === "dataAccess") {
      return { data: mockDataAccessData };
    }
    return { data: {} };
  },
};
editorStore.state.availableLicences = [
  { id: 222, name: "test", licence: { id: 123 } },
];
const $store = new Vuex.Store({
  modules: {
    editor: editorStore,
    record: recordStore,
  },
});
let wrapper;

describe("Edit -> EditLicenceLinks.vue", function () {
  beforeEach(async () => {
    const editLink = {
      render: () => {},
      methods: {
        validate: () => true,
      },
      data() {
        return {};
      },
    };
    wrapper = await shallowMount(EditLicenceLinks, {
      global: {
        plugins: [$store],
        mocks: { $route },
      },
      stubs: { "v-form": editLink },
    });
  });

  it("can be mounted", () => {
    wrapper.vm.rules.isRequired();
    wrapper.vm.rules.isUrl();
    expect(wrapper.vm.$options.name).toMatch("EditLicences");
    expect(wrapper.vm.isNew({ field: "test" })).toBe(true);
    expect(wrapper.vm.cleanTextList).toHaveBeenCalled;
  });

  it("can display the overlay", () => {
    wrapper.vm.showCreator = true;
    wrapper.vm.showEditItem(0);
    expect(wrapper.vm.edit).toStrictEqual({
      show: true,
      template: {
        licence: { name: "myLicence", id: 123 },
        target: 222,
        relation: undefined,
      },
      id: 0,
    });
    wrapper.vm.showEditItem();
    expect(wrapper.vm.edit).toStrictEqual({
      show: true,
      id: null,
      template: { relation: null, target: null },
    });
  });

  it("can hide the overlay", () => {
    wrapper.vm.hideEdit();
    expect(wrapper.vm.edit).toStrictEqual({
      show: false,
      id: null,
      template: null,
    });
    expect(wrapper.vm.showCreator).toBe(false);
  });

  it("can create a new licence", () => {
    wrapper.vm.newLicence = { name: "why not?" };
    wrapper.vm.edit.template = {};
    wrapper.vm.createNewLicence();
    expect(wrapper.vm.edit.template).toStrictEqual({
      licence: { name: "why not?" },
    });
    expect(wrapper.vm.showCreator).toBe(false);
    expect(wrapper.vm.newLicence).toStrictEqual({
      name: null,
      url: null,
    });
  });

  it("can remove a licence link", () => {
    wrapper.vm.removeLicenceLink(1);
    expect(recordStore.state.sections.dataAccess.data.licences.length).toBe(1);
    wrapper.vm.removeLicenceLink(0);
    expect(recordStore.state.sections.dataAccess.data.licences.length).toBe(0);
  });

  it("can check fields computed property", () => {
    expect(wrapper.vm.fields).toEqual(mockDataAccessData);
  });
});
