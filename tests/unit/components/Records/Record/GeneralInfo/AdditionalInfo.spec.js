import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import AdditionalInfo from "@/components/Records/Record/GeneralInfo/AdditionalInfo"
import Vuetify from "vuetify"

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        record:Record
    }});

describe("AdditionalInfo.vue", function(){
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(AdditionalInfo, {
            localVue,
            vuetify,
            mocks: {$store}
        })
    });

    it("can be initiated", () => {
        expect(wrapper.name()).toMatch("AdditionalInfo");
    });

});
