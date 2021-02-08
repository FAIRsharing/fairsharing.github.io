import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import DOITitle from "@/components/Records/Record/GeneralInfo/DOITitle.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    doi: 'FAIRsharing.wibble',
    subjects:[],
    domains:[],
    taxonomies:[],
    userDefinedTags:[{label:'a'}],
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("DOITitle.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(DOITitle, {
            localVue,
            vuetify,
            mocks: {$store}
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("DOITitle");
    });

    it("generates correct doi link", () => {
        let doiLink = `https://doi.org/${wrapper.vm.currentRecord['fairsharingRecord'].doi}`;
        expect(wrapper.vm.generateDoiLink(wrapper.vm.currentRecord['fairsharingRecord'].doi)).toEqual(doiLink);
    });

    it("can copy url correctly", () => {
        wrapper.vm.copyURL()
        expect(wrapper.vm.copyButtonStatus).toBe(true);
    });

});

