import { createLocalVue, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import VueRouter from "vue-router";
import Vuex from "vuex";

import RecentCuratorCreation from "@/components/Curators/RecentCuratorCreation.vue";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import usersStore from "@/store/users";

import dataDashboard from "../../../fixtures/curationDashboardData.json"

let curationDataSummary =  dataDashboard.curationSummary;
const localVue = createLocalVue();
localVue.use(Vuex);
let header = [
    {
        "text": "Record name (id)",
        "value": "recordNameID"
    },
    {
        "text": "Date created",
        "value": "createdAt"
    },
    {
        "text": "Creator",
        "value": "creator"
    }
    ];
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
});

const router = new VueRouter();
const $router = { push: jest.fn() };

describe("Curator -> RecentCuratorCreation.vue", () => {
  let restStub, wrapper, graphStub;
  beforeAll(() => {
      graphStub = sinon.stub(GraphClient.prototype, "executeQuery")
          .returns(curationDataSummary)
    restStub = sinon.stub(Client.prototype, "executeQuery").returns(
        {
          data: {
            error: false
          }
        }
    );
    wrapper = shallowMount(RecentCuratorCreation, {
      localVue,
      router,
      mocks: { $store, $router },
      propsData: {
        headerItems: header
      }
    });
  });
  afterEach( () => {
      graphStub.restore();
    restStub.restore();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("RecentCuratorCreation");
    expect(wrapper.vm.prepareRecordsCuratorCreationsLastWeek).toHaveBeenCalled;
  });



  it("can check for hiddenRecords", () => {
      let output = {"createdAt": "Oct 27, 2020", "creator": "Lara Aral", "id": "32", "idCreator": "44", "recordNameID": "ewewrr (32)", "type": "database"}
    expect(wrapper.vm.recordsCreatedCuratorsLastWeek[0]).toStrictEqual(output);
  });
});
