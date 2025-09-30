import { createLocalVue,shallowMount } from "@vue/test-utils";
import linkify from 'vue-linkify'
import Vuetify from "vuetify"
import Vuex from "vuex";

import DeprecationReason from "@/components/Records/Record/GeneralInfo/DeprecationReason.vue"
import Record from "@/store/recordData.js"

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.directive('linkified', linkify)
const vuetify = new Vuetify();


Record.state.currentRecord.fairsharingRecord.metadata = {
  deprecationReason:"some deprecation reason...",
  deprecationDate: "1912-04-15"
};
const $store = new Vuex.Store({
  modules: {
    record:Record
  }});

describe("Citations.vue", function(){
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(DeprecationReason, {
      localVue,
      vuetify,
      mocks: {$store}
    })
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("DeprecationReason");
  });

  it("shows deprecation reason", () => {
    let reason = wrapper.vm.currentRecord.fairsharingRecord.metadata['deprecation_reason'];
    let date = wrapper.vm.currentRecord.fairsharingRecord.metadata['deprecation_date'];
    expect(wrapper.vm.getReason()).toEqual("This record was deprecated on " + date + " for the following reason(s): " + reason)
  });

});
