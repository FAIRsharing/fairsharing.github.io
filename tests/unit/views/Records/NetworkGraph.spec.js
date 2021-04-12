import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import VueRouter from "vue-router";
import GraphTest from "@/views/Records/NetworkGraph.vue";
import Vuetify from "vuetify"
import GraphClient from "@/components/GraphClient/GraphClient";
const sinon = require("sinon");

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

const router = new VueRouter();
const $router = { push: jest.fn() };
let $route = {
    path: "/graph/1234",
    params: {id: 1234}
};

let graphStub;
let graphMock = {
    "fairsharingGraph": {
        "nodes": [
            {
                "id": "Observation Data Model Core Components and its Implementation in the Table Access Protocol",
                "record_id": 1410,
                "marker": {
                    "symbol": "circle",
                    "radius": 20,
                    "fillColor": "red"
                }
            },
            {
                "id": "Virtual Observatory Data Modeling Languages",
                "record_id": 1411,
                "marker": {
                    "symbol": "circle",
                    "radius": 10
                }
            }
        ],
        "edges": [
            [
                "Observation Data Model Core Components and its Implementation in the Table Access Protocol",
                "Virtual Observatory Data Modeling Language",
                "Related To"
            ]
        ],
        "linkLength": 80,
        "maxIterations": 300
    }
}

describe("NetworkGraph.vue", function() {
    let wrapper;
    let getData;

    // TODO: Mock properties in options {}.
    beforeEach(() => {
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns(graphMock);
        wrapper = shallowMount(GraphTest, {
            localVue,
            vuetify,
            router,
            mocks: { $router, $route }
        });
        getData = jest.spyOn(wrapper.vm, "getData");
    });

    afterEach(() => {
        graphStub.restore();
    });

    it("is all present and correct", () => {
        expect(wrapper.name()).toMatch("NetworkGraph");
        // Has correct options for the default number of nodes.
        expect(wrapper.vm.options.plotOptions.networkgraph.layoutAlgorithm.linkLength).toEqual(80);
        expect(wrapper.vm.options.plotOptions.networkgraph.layoutAlgorithm.maxIterations).toEqual(300);
    });

    it("reloads page when route or max_path_length change", () => {
        expect(getData).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.currentRoute).toEqual(1234);
        expect(wrapper.vm.max_path_length).toEqual(2);
        wrapper.vm.max_path_length = 3;
        expect(getData).toHaveBeenCalledTimes(2);
        $route.params.id = 10;
        expect(getData).toHaveBeenCalledTimes(3);
        expect(wrapper.vm.currentRoute).toEqual(10);
    });

});