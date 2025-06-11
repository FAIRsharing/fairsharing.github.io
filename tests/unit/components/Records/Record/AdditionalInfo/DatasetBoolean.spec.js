import { createLocalVue,shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import DatasetBoolean from "@/components/Records/Record/AdditionalInfo/DatasetBoolean"
import Editor from "@/store/editor"
import Record from "@/store/recordData.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
  modules: {
    record:Record,
    editor:Editor
  }});

describe("Citations.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DatasetBoolean, {
      localVue,
      vuetify,
      mocks: {$store}
    })
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("DatasetBoolean");
  });

});
