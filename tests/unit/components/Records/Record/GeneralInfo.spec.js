import { createLocalVue,shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuetify from "vuetify"
import Vuex from "vuex";

import GeneralInfo from "@/components/Records/Record/GeneralInfo.vue"
import Record from "@/store/recordData";
import record from "@/store/recordData";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

let editor = {
    namespaced: true,
    state: {
        recordTooltips: {
            graph_button: "graph button tooltip.",
        }
    }
}


const router = new VueRouter(),
    $router = { push: jest.fn() };

record.state.currentRecord.fairsharingRecord = {
    id: 12345
};

const $store = new Vuex.Store({
    modules: {
        record: Record,
        editor: editor
    }});

describe("GeneralInfo.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(GeneralInfo, {
            localVue,
            vuetify,
            router,
            mocks: {$store, $router},
            stubs: ['router-link']
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.vm.$options.name).toMatch("GeneralInfo");
    });

    it("can call callRequestOwnership method", () => {
        wrapper.vm.callRequestOwnership();
        expect(wrapper.emitted().requestOwnership).toBeTruthy()
    });

});
