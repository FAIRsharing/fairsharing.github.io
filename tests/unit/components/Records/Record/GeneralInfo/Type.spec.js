import { createLocalVue,shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import Type from "@/components/Records/Record/GeneralInfo/Type.vue"
import Record from "@/store/recordData.js"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let editor = {
    namespaced: true,
    state: {
        recordTooltips: {
            record_type: "type tooltip.",
        }
    }
}


Record.state.currentRecord["fairsharingRecord"] = {
    doi: 'FAIRsharing.wibble',
    subjects:[],
    domains:[],
    taxonomies:[],
    userDefinedTags:[{label:'a'}],
    metadata: {
      globally_unique: 'true',
      persistent: 'false',
      resolvable: 'false'
    }
};
const $store = new Vuex.Store({
    modules: {
        record: Record,
        editor: editor
    }});

describe("DOITitle.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Type, {
            localVue,
            vuetify,
            mocks: {$store}
        })
    });

    it("can be initiated", () => {
        expect(wrapper.vm.$options.name).toMatch("Type");
    });

});
