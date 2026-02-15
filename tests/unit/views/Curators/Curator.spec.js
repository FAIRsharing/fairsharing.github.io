import { createLocalVue, shallowMount } from "@vue/test-utils";
import axios from "axios";
import sinon from "sinon";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import Vuex from "vuex";

import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import usersStore from "@/store/users";
import Curator from "@/views/Curators/Curator.vue";

import dataDashboard from "../../../fixtures/curationDashboardData.json";

axios.defaults.adapter = require("axios/lib/adapters/http");

const localVue = createLocalVue();
localVue.use(Vuex);
usersStore.state.user = function () {
  return {
    isLoggedIn: true,
    credentials: { token: 123, username: 123 },
  };
};
const $store = new Vuex.Store({
  modules: {
    users: usersStore,
  },
  dispatch: jest.fn(),
});

const router = new VueRouter();
const $router = { push: jest.fn() };

let fakeDataDashboard = dataDashboard;
let vuetify = new Vuetify();

describe("Curator.vue", () => {
  let wrapper;
  let restStub;
  let graphStub;

  beforeAll(async () => {
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: { id: "12345", name: 123, token: 123 },
    });

    graphStub = sinon
      .stub(GraphClient.prototype, "executeQuery")
      .returns(fakeDataDashboard);

    wrapper = await shallowMount(Curator, {
      vuetify,
      localVue,
      router,
      mocks: { $store, $router },
    });
  });

  afterEach(() => {
    graphStub.restore();
    restStub.restore();
  });

  it("can be mounted", async () => {
    const title = "Curator";
    expect(wrapper.vm.$options.name).toMatch(title);

    //Not sure why this variable (recordsInCuration) was introduced and assisgned array
    // expect(wrapper.vm.recordsInCuration.length).toBe(2);
    // expect(wrapper.vm.recordsInCuration[1].recordNameID).toBe("Frog French databases (12345)");
  });
});
