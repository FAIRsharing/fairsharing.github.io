import { createLocalVue,shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import ContactsData from "@/components/Records/Record/GeneralInfo/ContactsData";
import Record from "@/store/recordData.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    doi: 'FAIRsharing.wibble',
    subjects:[],
    domains:[],
    taxonomies:[],
    userDefinedTags:[{label:'a'}],
    metadata:{contacts:{}}
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("ContactsData.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(ContactsData, {
            localVue,
            vuetify,
            mocks: {$store}
        })
    });

    it("can be initiated", () => {
        expect(wrapper.vm.$options.name).toMatch("ContactsData");
    });

});
