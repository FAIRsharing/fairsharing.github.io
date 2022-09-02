import {createLocalVue, shallowMount} from "@vue/test-utils";
import Vuex from "vuex";
import Record from "@/store/recordData.js";
import Vuetify from "vuetify"
import editorStore from "@/store/editor";
import record from "@/store/recordData";
import RESTClient from "@/lib/Client/RESTClient";
const sinon = require("sinon");
import OtherDataProcesses from "@/components/Records/Record/DataProcessesAndConditions/OtherDataProcesses"


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

describe("OtherDataProcesses.vue", function () {
    let wrapper;

    beforeEach(() => {
        wrapper = shallowMount(OtherDataProcesses, {
            localVue,
            vuetify,
            mocks: {$store}
        });
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
        expect(wrapper.name()).toMatch("OtherDataProcesses");
    });

    it("can check if data is available", async () => {
        await wrapper.vm.setAvailableData({a:''},'a')
        expect(wrapper.vm.otherDataConditions).toStrictEqual({
            "a": {
            "a": ""
            },
        });
        let selectedNode = [{'a': 1}, {'b': 2}]
        await wrapper.vm.setAvailableData(selectedNode,'a')
        selectedNode = [{a:[]}]
        await wrapper.vm.setAvailableData(selectedNode,'n')
        selectedNode = [{}]
        await wrapper.vm.setAvailableData(selectedNode,'a')
        expect(wrapper.vm.otherDataConditions).toStrictEqual({
            "a": {
                "0": {
                    "a": 1
                },
                "1": {
                    "b": 2
                },
                "a": ""
            },
            "n": {
                "0": {
                    "a": []
                }
            }
        });
    });

});