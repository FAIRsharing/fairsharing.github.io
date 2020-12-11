import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import sinon from "sinon"
import Client from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import usersStore from "@/store/users";
import Curator from "@/views/Curators/Curator.vue"
import dataDahboard from "../../../fixtures/curationDashboardData.json"

const localVue = createLocalVue();
localVue.use(Vuex);
usersStore.state.user = function(){ return {
    isLoggedIn: true,
    credentials: {token: 123, username: 123}
}};
const $store = new Vuex.Store({
    modules: {
        users: usersStore
    },
});

const router = new VueRouter();
const $router = { push: jest.fn() };

let fakeDataDashboard =  dataDahboard;

describe("Curator.vue", () => {
  let wrapper;
  let restStub;
  let graphStub;

  beforeAll( async (done) => {
     restStub = sinon.stub(Client.prototype, "executeQuery").returns({
         data: {id: "12345", name: 123, token: 123}
     });

     graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns(fakeDataDashboard);

    wrapper = await shallowMount(Curator, {
        localVue,
        router,
        mocks: {$store, $router}
    });
    done();
  });


  afterEach(() => {
      restStub.restore();
      graphStub.restore();
  });

  it("can be mounted", async () => {
      const title = "Curator";
      expect(wrapper.name()).toMatch(title);
      expect(wrapper.vm.approvalRequired.length).toBe(2);
      expect(wrapper.vm.approvalRequired[0].curator).toBe("Terazus");
      expect(wrapper.vm.maintenanceRequests.length).toBe(1);
      expect(wrapper.vm.maintenanceRequests[0].recordName).toBe("OrthoOntology Deontology");
      expect(wrapper.vm.recordsCreatedCuratorsLastWeek.length).toBe(2);
      expect(wrapper.vm.recordsCreatedCuratorsLastWeek[1].recordNameID).toBe("Second (44)");
      expect(wrapper.vm.recordsInCuration.length).toBe(2);
      expect(wrapper.vm.recordsInCuration[1].recordNameID).toBe("Frog French databases (12)");
      expect(wrapper.vm.recordsWithoutDois.length).toBe(2);
      expect(wrapper.vm.recordsWithoutDois[0].createdAt).toBe("2020-10-12T13:31:25Z");
      expect(wrapper.vm.hiddenRecords.length).toBe(2);
  });

  it("can process errors", async () => {
      restStub.restore();
      restStub = sinon.stub(Client.prototype, "executeQuery").returns({
          curationSummary: {error: "error"}
      });
      wrapper = await shallowMount(Curator, {
          localVue,
          router,
          mocks: {$store, $router}
      });
      expect(wrapper.vm.approvalRequired.length).toBe(0);
      expect(wrapper.vm.hiddenRecords.length).toBe(0);
  });
});
