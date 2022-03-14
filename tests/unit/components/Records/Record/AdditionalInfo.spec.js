import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js"
import AdditionalInfo from "@/components/Records/Record/AdditionalInfo"
import Vuetify from "vuetify"
import editorStore from "@/store/editor";
import record from "@/store/recordData";
import RESTClient from "@/lib/Client/RESTClient";
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const $store = new Vuex.Store({
    modules: {
        record:Record,
        editor: editorStore
    }});


record.state.currentRecord.fairsharingRecord.metadata = {
    dataset_deposition: {},
};
$store.state.editor.allowedFields.properties = {dataset_deposition: {}}
let graphStub;
let restStub;


describe("AdditionalInfo.vue", function(){
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(AdditionalInfo, {
            localVue,
            vuetify,
            mocks: {$store}
        })
    });
    beforeAll(() => {
        restStub = sinon.stub(RESTClient.prototype, "executeQuery");
        restStub.withArgs(sinon.match.any).returns({
            data: {properties: {
                dataset_deposition: {item:[1.2]},
                emptyKey:{}
            }}
        });
    });
    afterAll(() => {
        graphStub.restore();
        restStub.restore();
    });


    it("can be initiated", () => {
        expect(wrapper.name()).toMatch("AdditionalInfo");
    });

    it("can check if data is available", async () => {
        await wrapper.vm.setAvailableData({a:''},'a')
        expect(wrapper.vm.tempData).toStrictEqual({
            "a": [
                {
                    "a": ""
                }
            ],
            "dataset_deposition": []
        });
        let selectedNode = [{'a': 1}, {'b': 2}]
        await wrapper.vm.setAvailableData(selectedNode,'a')
        selectedNode = [{a:[]}]
        await wrapper.vm.setAvailableData(selectedNode,'n')
        selectedNode = [{}]
        await wrapper.vm.setAvailableData(selectedNode,'a')
        expect(wrapper.vm.tempData).toStrictEqual({
            "a": [
                {
                    "a": ""
                },
                {
                    "a": 1
                },
                {
                    "b": 2
                }
            ],
            "dataset_deposition": [],
            "n": [
                {
                    "a": []
                }
            ]
        });
    });

});
