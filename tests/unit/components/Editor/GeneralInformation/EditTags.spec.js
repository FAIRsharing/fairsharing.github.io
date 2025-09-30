import { createLocalVue, shallowMount } from "@vue/test-utils"
import Vuetify from "vuetify"
import Vuex from "vuex"

import EditTags from "@/components/Editor/GeneralInformation/EditTags.vue"
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
const sinon = require("sinon");
const VueScrollTo = require('vue-scrollto');

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueScrollTo);
const vuetify = new Vuetify();

recordStore.state.sections = {
  generalInformation: {
    data: {
      domains: [
        {id: 1, label: "test"}
      ],
      subjects: [
        {id: 1, label: "test"}
      ],
      taxonomies: [
        {id: 1, label: "test"}
      ],
      userDefinedTags: [
        {id: 1, label: "test"}
      ],
      objectTypes: [
        {id: 1, label: "test"}
      ]
    },
    initialData: {
      taxonomies: [
        {id: 1, label: "test"}
      ],
      domains: [],
      userDefinedTags: [],
      subjects: [],
      objectTypes: []
    }
  }
};

editorStore.state.tags = [
  {id: 1, label: "test", model: "domain"},
  {id: 2, label: "test2", model: 'domain'},
  {id: 1, label: "test", model: "subject"},
  {id: 1, label: "test", model: "taxonomy"},
  {id: 1, label: "test", model: "user_defined_tag"},
  {id: 1, label: "test", model: "object_type"}
];

const $store = new Vuex.Store({
  modules: {
    record: recordStore,
    editor: editorStore
  }
});

let wrapper;

describe('Editor -> EditTags.vue', () => {

  beforeEach(() => {
    wrapper = shallowMount(EditTags, {
      localVue,
      vuetify,
      mocks: {$store}
    });
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("EditTags");
    expect(wrapper.vm.recordTags.length).toBe(5);
    expect(wrapper.vm.buttonIcon).toBe("fa-plus-circle");
    expect(wrapper.vm.buttonLabel).toBe("Add/edit tags");
    wrapper.vm.menu.show = true;
    expect(wrapper.vm.buttonIcon).toBe("fa-minus-circle");
    expect(wrapper.vm.buttonLabel).toBe("Hide table")
  });

  it('can react to showTypes', () => {
    expect(wrapper.vm.tags.length).toBe(6);
    wrapper.vm.showTypes = {
      domain: false,
      taxonomy: true,
      subject: true,
      user_defined_tag: true
    };
    wrapper.vm.partialTags();
    expect(wrapper.vm.tags.length).toBe(3);
  });

  it("can open/close the menu", () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    wrapper.vm.showMenu();
    expect(wrapper.vm.menu.show).toBe(true);
    jest.clearAllMocks();
    wrapper.vm.showMenu();
    expect(wrapper.vm.menu.show).toBe(false);
  });

  it("can remove a specific tag", () => {
    let test = [1, 2, 3];
    wrapper.vm.removeTag(test, 1);
    expect(test).toStrictEqual([1, 3]);
  });

  it("can commit the record tags to the store", () => {
    const newTag = {id: 2, label: "test2", model: 'domain'};
    wrapper.vm.recordTags = [newTag];
    expect(wrapper.vm.getSection("generalInformation").data.domains).toStrictEqual([newTag]);
    expect(wrapper.vm.getSection("generalInformation").data.subjects).toStrictEqual([]);
    wrapper.vm.initialized = false;
    wrapper.vm.recordTags = [
      {id: 3, label: "test3", model: 'domain'},
      {id: 4, label: "test4", model: 'object_type'},
    ];
    expect(wrapper.vm.getSection("generalInformation").data.domains).toStrictEqual([newTag]);
  });

  it("can search the endpoint based on user input", async () => {
    let graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
    const newTag = {id: 1, label: 'test124', model: "subject"};
    graphStub.returns({searchTags: [newTag]});
    // wrapper.vm.searchString = "test";
    wrapper.vm.$options.watch.searchString.call(wrapper.vm, "test")
    expect(wrapper.vm.tags).toStrictEqual([]);
    await wrapper.vm.getTags('test');
    expect(wrapper.vm.tags).toStrictEqual([newTag]);
    graphStub.restore();
  })

});
