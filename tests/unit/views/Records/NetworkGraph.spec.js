import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuetify from "vuetify"
import Vuex from "vuex";

import GraphClient from "@/lib/GraphClient/GraphClient";
import users from "@/store/users.js";
import GraphTest from "@/views/Records/NetworkGraph.vue";
const sinon = require("sinon");
import Highcharts from 'highcharts'
import Networkgraph from 'highcharts/modules/networkgraph'
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

users.state.user = function(){
    return { is_curator: true }
};
const $store = new Vuex.Store({
    modules: {
        users: users
    }
})


let graphStub;
let graphMock = {
    "fairsharingGraph": {
        data: {
            "nodes": [
                {
                    "id": "Observation Data Model Core Components and its Implementation in the Table Access Protocol",
                    "record_id": 1410,
                    "status": "ready",
                    "marker": {
                        "symbol": "circle",
                        "radius": 20,
                        "fillColor": "red"
                    }
                },
                {
                    "id": "Virtual Observatory Data Modeling Languages",
                    "record_id": 1412,
                    "status": "in_development",
                    "marker": {
                        "symbol": "square",
                        "radius": 10
                    }
                },
                {
                    "id": "Third",
                    "status": "uncertain",
                    "record_id": 140,
                    "marker": {
                        "symbol": "diamond",
                        "radius": 10
                    }
                },
                {
                    "id": "Fourth",
                    "status": "deprecated",
                    "record_id": 160,
                    "marker": {
                        "symbol": "triangle",
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
            mocks: { $router, $route, $store }
        });
        getData = jest.spyOn(wrapper.vm, "getData");
    });

    afterEach(() => {
        graphStub.restore();
    });

    it("is all present and correct", async () => {
        expect(wrapper.vm.$options.name).toMatch("NetworkGraph");
        expect(wrapper.vm.graphData.nodes.length).toBe(4)
        wrapper.vm.legend.types.square = false;
        await wrapper.vm.getData();
        expect(wrapper.vm.noData).toBe(false);
        expect(wrapper.vm.graphData.nodes.length).toBe(4)
        wrapper.vm.plotGraph()
    });

    it("reloads page when route changes", async () => {
        expect(getData).toHaveBeenCalledTimes(0);
        expect(wrapper.vm.currentRoute).toEqual(1234);
        // $route.params.id = 10;
        // expect(getData).toHaveBeenCalledTimes(1);
        // expect(wrapper.vm.currentRoute).toEqual(10);
    })

    it("reloads page when route changes and id is 10", async () => {
        $route.params.id = 10;
        wrapper = await shallowMount(GraphTest, {
            localVue,
            vuetify,
            router,
            mocks: { $router, $route, $store }
        });

        expect(getData).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.currentRoute).toEqual(10);
    })

    it("sets noData when there's no data", async () => {
        graphMock = {};
        graphStub.returns(graphMock);
        wrapper = await shallowMount(GraphTest, {
            localVue,
            vuetify,
            router,
            mocks: { $router, $route, $store }
        });
        await wrapper.vm.getData();
        expect(wrapper.vm.noData).toBe(true);
    });
});
