import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import ReplacedByRecord from "@/components/Records/Record/GeneralInfo/ReplacedByRecord.vue"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

Record.state.currentRecord["fairsharingRecord"] = {
    recordAssociations:[],
    reverseRecordAssociations:[],
};
const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("ReplacedByRecord.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(ReplacedByRecord, {
            localVue,
            vuetify,
            mocks: {$store}
        })
    });

    it("can be initiated", () => {
        expect(wrapper.name()).toMatch("ReplacedByRecord");
    });

});
