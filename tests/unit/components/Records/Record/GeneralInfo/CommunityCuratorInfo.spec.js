import { createLocalVue,shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import CommunityCuratorInfo from "@/components/Records/Record/GeneralInfo/CommunityCuratorInfo"
import Record from "@/store/recordData.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
  doi: 'FAIRsharing.wibble',
  subjects:[],
  domains:[],
  taxonomies:[],
  communityCurators: [],
  userDefinedTags:[{label:'a'}],
};
const $store = new Vuex.Store({
  modules: {
    record:Record
  }});

describe("CommunityCuratorInfo.vue", function(){
  let wrapper;

  // TODO: Mock properties in options {}.
  beforeEach(() => {
    wrapper = shallowMount(CommunityCuratorInfo, {
      localVue,
      vuetify,
      mocks: {$store}
    })
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("CommunityCuratorInfo");
  });

});
