import { createLocalVue,shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import YearOfCreation from "@/components/Records/Record/GeneralInfo/YearOfCreation.vue"
import Record from "@/store/recordData.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      year: "year tooltip.",
    }
  }
}


Record.state.currentRecord["fairsharingRecord"] = {
  doi: 'FAIRsharing.wibble',
  metadata: {
    year_creation: 1912,
  },
  subjects:[],
  domains:[],
  taxonomies:[],
  userDefinedTags:[{label:'a'}],
};
const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor
  }});

describe("YearOfCreation.vue", function(){
  let wrapper;

  // TODO: Mock properties in options {}.
  beforeEach(() => {
    wrapper = shallowMount(YearOfCreation, {
      localVue,
      vuetify,
      mocks: {$store}
    })
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("YearOfCreation");
  });

});
