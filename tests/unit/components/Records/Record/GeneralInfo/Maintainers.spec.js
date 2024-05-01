import { createLocalVue,shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify"
import Vuex from "vuex";

import Maintainers from "@/components/Records/Record/GeneralInfo/Maintainers.vue"
import Record from "@/store/recordData.js"
import users from "@/store/users"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let editor = {
    namespaced: true,
    state: {
        recordTooltips: {
            maintainers: "maintainer tooltip.",
        }
    }
}

Record.state.currentRecord["fairsharingRecord"] = {
    doi: 'FAIRsharing.wibble',
    subjects:[],
    domains:[],
    taxonomies:[],
    userDefinedTags:[{label:'a'}],
    maintainers:[]
};
const $store = new Vuex.Store({
    modules: {
        record: Record,
        users,
        editor: editor
    }});

describe("Maintainers.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Maintainers, {
            localVue,
            vuetify,
            mocks: {$store}
        })
    });

    it("can be initiated", () => {
        expect(wrapper.vm.$options.name).toMatch("Maintainers");
    });

});
