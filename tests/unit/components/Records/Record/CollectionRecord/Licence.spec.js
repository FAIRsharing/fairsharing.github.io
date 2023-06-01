import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import Licence from "@/components/Records/Record/CollectionRecord/Licence.vue"
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
    licences: [
        {
            "id": 167,
            "name": "Creative Commons Attribution 4.0 International (CC BY 4.0)",
            "url": "https://creativecommons.org/licenses/by/4.0/"
        }
    ]
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("Licence.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(Licence, {
            localVue,
            vuetify,
            mocks: {$store},
            stubs: ['router-link']
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("Licence");
    });

});

