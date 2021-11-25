import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import Countries from "@/components/Records/Record/GeneralInfo/Countries.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    doi: 'FAIRsharing.wibble',
    metadata: {
        year_creation: 1912,
    },
    subjects:[],
    domains:[],
    taxonomies:[],
    countries: [],
    userDefinedTags:[{label:'a'}],
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("Countries.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Countries, {
            localVue,
            vuetify,
            mocks: {$store},
            stubs: ['router-link']
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Countries");
    });

    it("can sort countries", () => {
        Record.state.currentRecord["fairsharingRecord"]["countries"] = [
            {name: 'Nantierre', id: 2, code: 'NT'},
            {name: 'Welfland', id: 1, code: 'WL'}
        ];
        expect(wrapper.vm.sortCountries()).toStrictEqual([
                {name: 'Welfland', id: 1, code: 'WL'},
                {name: 'Nantierre', id: 2, code: 'NT'}
            ]
        );

    });

});

