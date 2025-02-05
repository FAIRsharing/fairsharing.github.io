import { createLocalVue, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import VueRouter from "vue-router";
import Vuex from "vuex";

import HiddenRecords from "@/components/Curators/HiddenRecords.vue";
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
        "text": "Under curation by",
        "value": "curator"
      },
      {
        "text": "Created by",
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

describe("Curator -> HiddenRecords.vue", () => {
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
    wrapper = shallowMount(HiddenRecords, {
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
    expect(wrapper.vm.$options.name).toMatch("HiddenRecords");
    expect(wrapper.vm.prepareHiddenRecords).toHaveBeenCalled;
      expect(wrapper.vm.hiddenRecords.length).toBe(2);
      let date = new Date("1425,01,01");
      let auxString = date.toLocaleString('default', { month: 'short' })+' '+date.getDate()+ ', '+date.getFullYear();
      expect(wrapper.vm.hiddenRecords[1].createdAt).toBe(auxString);
  });



  it("can check for hiddenRecords", () => {
      let output = {"createdAt": "Oct 12, 2020", "creator": "Juancho", "curator": "Manolo", "id": "2669f95", "idCreator": "234", "recordNameID": "ShareSfhare (2669f95)", "type": undefined}
    expect(wrapper.vm.hiddenRecords[0]).toStrictEqual(output);
  });
});
