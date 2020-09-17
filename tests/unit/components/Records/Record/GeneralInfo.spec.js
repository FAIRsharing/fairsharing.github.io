import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/record.js"
import GeneralInfo from "@/components/Records/Record/GeneralInfo.vue"

const localVue = createLocalVue();
localVue.use(Vuex);
Record.state.currentRecord["fairsharingRecord"] = {
    metadata: {
        year_creation: 1912,
    },
    abbreviation:  "MGY"
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("GeneralInfo.vue", function(){
    let wrapper;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        wrapper = shallowMount(GeneralInfo, {
            localVue,
            mocks: {$store}
        })
    });

    it("can be instantiated", () => {
        expect(wrapper.name()).toMatch("GeneralInfo");
        expect(wrapper.vm.currentRecord['fairsharingRecord'].metadata.year_creation).toEqual(1912);
        expect(wrapper.vm.currentRecord['fairsharingRecord'].abbreviation).toMatch("MGY");
    });

});
