import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import AdditionalInfo from "@/components/Records/Record/GeneralInfo/AdditionalInfo"
import Vuetify from "vuetify"
import editorStore from "@/store/editor";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        record:Record,
        editor: editorStore
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

    it("can check if data is available", () => {
        let selectedNode = {item:[1,2]}
        let retVal = wrapper.vm.checkDataAvailable(selectedNode)
        expect(retVal).toEqual(true);
        selectedNode = {item:[]}
        wrapper.vm.checkDataAvailable(selectedNode)
        retVal = wrapper.vm.checkDataAvailable(selectedNode)
        expect(retVal).toEqual(false);
        selectedNode = undefined
        retVal = wrapper.vm.checkDataAvailable(selectedNode)
        expect(retVal).toEqual(false);
    });

});
