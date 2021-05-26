import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import AdditionalInfo from "@/components/Records/Record/GeneralInfo/AdditionalInfo"
import Vuetify from "vuetify"
import editorStore from "@/store/editor";
import record from "@/store/recordData";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        record:Record,
        editor: editorStore
    }});

record.state.currentRecord.fairsharingRecord.metadata = {
    dataset_preservation:{}
};

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

    it("can check if data is available", async () => {
        let selectedNode = {item:[1,2]}
        await wrapper.vm.checkDataAvailable(selectedNode)
        expect(wrapper.vm.anyDataAvailable).toContainEqual(true);

        selectedNode = {item:[]}
        await wrapper.vm.checkDataAvailable(selectedNode)
        expect(wrapper.vm.anyDataAvailable).toContainEqual(true);

        selectedNode = {item:[1,2]}
        let result = await wrapper.vm.checkDataAvailableCurrentRecord(selectedNode)
        expect(result).toBe(true);
        selectedNode = undefined
        result = await wrapper.vm.checkDataAvailableCurrentRecord(selectedNode)
        expect(result).toBe(false);
        selectedNode = {metrics: 'someData',hasMetrics:'yes'}
        result = await wrapper.vm.checkDataAvailableCurrentRecord(selectedNode)
        expect(result).toBe(true);
        selectedNode = {metrics: 'someData',hasMetrics:'no'}
        result = await wrapper.vm.checkDataAvailableCurrentRecord(selectedNode)
        expect(result).toBe(true);

    });

});
