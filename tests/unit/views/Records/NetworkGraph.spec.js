import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import GraphClient from "@/lib/GraphClient/GraphClient";
import users from "@/store/users.js";
import GraphTest from "@/views/Records/NetworkGraph.vue";

const sinon = require("sinon");

const vuetify = createVuetify();

const $router = { push: vi.fn() };
let $route = {
  path: "/graph/1234",
  params: { id: 1234 },
};

users.state.user = function () {
  return { is_curator: true };
};
const $store = new Vuex.Store({
  modules: {
    users: users,
  },
});

let graphStub;
let originalPlotGraph;
let graphMock = {
  fairsharingGraph: {
    data: {
      nodes: [
        {
          key: "1410",
          attributes: {
            label:
              "Observation Data Model Core Components and its Implementation in the Table Access Protocol",
            record_id: 1410,
            status: "ready",
            registry: "standard",
            length: 1,
            marker: {
              symbol: "circle",
              radius: 20,
              fillColor: "red",
            },
          },
        },
        {
          key: "1412",
          attributes: {
            label: "Virtual Observatory Data Modeling Languages",
            record_id: 1412,
            status: "in_development",
            registry: "database",
            length: 1,
            marker: {
              symbol: "square",
              radius: 10,
            },
          },
        },
        {
          key: "140",
          attributes: {
            label: "Third",
            status: "uncertain",
            record_id: 140,
            registry: "policy",
            length: 2,
            marker: {
              symbol: "diamond",
              radius: 10,
            },
          },
        },
        {
          key: "160",
          attributes: {
            label: "Fourth",
            status: "deprecated",
            record_id: 160,
            registry: "collection",
            length: 3,
            marker: {
              symbol: "triangle",
              radius: 10,
            },
          },
        },
      ],
      edges: [
        {
          key: "e1",
          source: "1410",
          target: "1412",
          attributes: { label: "Related To" },
        },
        {
          key: "e2",
          source: "1412",
          target: "1410",
          attributes: { label: "test2" },
        },
        {
          key: "e3",
          source: "1410",
          target: "140",
          attributes: { label: "Related To" },
        },
        {
          key: "e4",
          source: "1410",
          target: "160",
          attributes: { label: "??" },
        },
      ],
      linkLength: 80,
      maxIterations: 300,
    },
  },
};

describe("NetworkGraph.vue", function () {
  let wrapper;
  let getData;

  beforeAll(() => {
    originalPlotGraph = GraphTest.methods.plotGraph;
    GraphTest.methods.plotGraph = vi.fn().mockResolvedValue(undefined);
  });

  // TODO: Mock properties in options {}.
  beforeEach(async () => {
    const div = document.createElement("div");
    div.setAttribute("id", "sigma-container");
    document.body.appendChild(div);
    graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
    graphStub.returns([{ message: "record not found" }]);
    wrapper = await shallowMount(GraphTest, {
      vuetify,
      mocks: { $router, $route, $store },
    });
    getData = vi.spyOn(wrapper.vm, "getData");
  });

  afterEach(() => {
    graphStub.restore();
    document.getElementById("sigma-container")?.remove();
  });

  afterAll(() => {
    GraphTest.methods.plotGraph = originalPlotGraph;
  });

  it("is all present and correct", async () => {
    graphStub.returns(graphMock);
    await wrapper.vm.getData();
    expect(wrapper.vm.$options.name).toMatch("NetworkGraph");
    expect(wrapper.vm.graphData.nodes.length).toBe(4);
    wrapper.vm.legend.types.square = false;
    await wrapper.vm.getData();
    expect(wrapper.vm.noData).toBe(false);
    expect(wrapper.vm.graphData.nodes.length).toBe(4);
  });

  it("reloads page when route changes", async () => {
    expect(getData).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.currentRoute).toEqual(1234);
    // $route.params.id = 10;
    // expect(getData).toHaveBeenCalledTimes(1);
    // expect(wrapper.vm.currentRoute).toEqual(10);
  });

  it("reloads page when route changes and id is 10", async () => {
    $route.params.id = 10;
    wrapper = await shallowMount(GraphTest, {
      vuetify,
      mocks: { $router, $route, $store },
    });

    expect(getData).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.currentRoute).toEqual(10);
  });

  it("sets noData when there's no data", async () => {
    graphMock = {};
    graphStub.returns(graphMock);
    wrapper = await shallowMount(GraphTest, {
      vuetify,
      mocks: { $router, $route, $store },
    });
    await wrapper.vm.getData();
    expect(wrapper.vm.noData).toBe(true);
  });
});
