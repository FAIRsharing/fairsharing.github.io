import { createLocalVue,shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import ReplacedByRecord from "@/components/Records/Record/GeneralInfo/ReplacedByRecord.vue"
import Record from "@/store/recordData.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
  reverseRecordAssociations:[{id:3,recordAssocLabel:'deprecates',fairsharingRecord:{name:'na',id:1254}}],
  recordAssociations:[{id:4,recordAssocLabel:'deprecates',linkedRecord:{name:'asd',id:1255}}]
};
const $store = new Vuex.Store({
  modules: {
    record:Record
  }});

describe("ReplacedByRecord.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ReplacedByRecord, {
      localVue,
      vuetify,
      mocks: {$store},
      stubs: ['router-link']
    })
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ReplacedByRecord");
    Record.state.currentRecord["fairsharingRecord"] = {
      reverseRecordAssociations:[{id:3,recordAssocLabel:'re',fairsharingRecord:{name:'na',id:1254}}],
      recordAssociations:[{id:4,recordAssocLabel:'deprecates',linkedRecord:{name:'asd',id:1255}}]
    };
    expect(wrapper.vm.anyAssociationExist).toBe(true);
  });

});
