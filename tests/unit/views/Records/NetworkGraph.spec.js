import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import VueRouter from "vue-router";
import GraphTest from "@/views/Records/NetworkGraph.vue";
import Vuetify from "vuetify"
import GraphClient from "@/lib/GraphClient/GraphClient";
const sinon = require("sinon");
import Networkgraph from 'highcharts/modules/networkgraph'
import Highcharts from 'highcharts'
Networkgraph(Highcharts);


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
                "record_id": 1412,
                "marker": {
                    "symbol": "square",
                    "radius": 10
                }
            },
            {
                "id": "Third",
                "record_id": 140,
                "marker": {
                    "symbol": "diamond",
                    "radius": 10
                }
            },
            {
                "id": "Fourth",
                "record_id": 160,
                "marker": {
                    "symbol": "??",
                    "radius": 10
                }
            }
        ],
        "edges": [
            [
                "Observation Data Model Core Components and its Implementation in the Table Access Protocol",
                "Virtual Observatory Data Modeling Languages",
                "Related To"
            ],
            [
                "Virtual Observatory Data Modeling Languages",
                "Observation Data Model Core Components and its Implementation in the Table Access Protocol",
                "test2"
            ],
            [
                "Observation Data Model Core Components and its Implementation in the Table Access Protocol",
                "Virtual Observatory Data Modeling Languages",
                "Related To"
            ],
            [
                "Observation Data Model Core Components and its Implementation in the Table Access Protocol",
                "Third",
                "Related To"
            ],
            [
                "Observation Data Model Core Components and its Implementation in the Table Access Protocol",
                "Fourth",
                "??"
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
    beforeEach(async () => {
        const div = document.createElement('div')
        div.setAttribute("id", "networkGraph");
        document.body.appendChild(div)
        graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
        graphStub.returns(graphMock);
        wrapper = await shallowMount(GraphTest, {
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

    it("is all present and correct", async () => {
        expect(wrapper.name()).toMatch("NetworkGraph");
        expect(wrapper.vm.options.plotOptions.networkgraph.layoutAlgorithm.linkLength).toEqual(80);
        expect(wrapper.vm.options.plotOptions.networkgraph.layoutAlgorithm.maxIterations).toEqual(300);
        expect(wrapper.vm.options.series[0].nodes.length).toBe(4)
        wrapper.vm.legend.types.square = false;
        await wrapper.vm.getData();
        expect(wrapper.vm.options.series[0].nodes.length).toBe(4)
        wrapper.vm.drawGraph()
    });

    it("reloads page when route changes", async () => {
        expect(getData).toHaveBeenCalledTimes(0);
        expect(wrapper.vm.currentRoute).toEqual(1234);
        $route.params.id = 10;
        expect(getData).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.currentRoute).toEqual(10);
    })
});
