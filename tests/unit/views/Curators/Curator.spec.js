import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import Vuex from "vuex"
import sinon from "sinon"
import Client from "@/components/Client/RESTClient.js"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import usersStore from "@/store/users";
import Curator from "@/views/Curators/Curator.vue"

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

describe("Curator.vue", () => {
  let wrapper;
  let restStub;
  let graphStub;

  beforeAll( async (done) => {
     restStub = await sinon.stub(Client.prototype, "executeQuery").returns({
         data: {id: "12345", name: 123, token: 123}
     });
     graphStub = await sinon.stub(GraphClient.prototype, "executeQuery").returns({
         curationSummary: {
             approvalsRequired: [
                {
                     username: "Terazus",
                     id: "12345",
                     fairsharingRecords: [
                         {
                             id: "1451",
                             name: "Radiotherapy"
                         }
                     ]
                 }
             ],
             pendingMaintenanceRequests: [
                 {
                     id: "3",
                     fairsharingRecord:
                         {
                             id: "373",
                             name: "OrthoOntology Deontology"
                         },
                     user:
                         {
                             username: "Rotedia",
                             id: "2218"
                         }
                 }
             ],
             recentCuratorCreations: [
                 {
                     id: "32",
                     name: "ewewrr",
                     createdAt: "2020-10-27T09:34:54Z",
                     isApproved: "false"
                 },
                 {
                     id: "44",
                     name: "Second",
                     createdAt: "2020-10-27T09:34:54Z",
                     isApproved: "false"
                 }
             ],
             recentlyUpdatedContent: [
                {
                     modifiedAt: "2020-10-27T09:34:57Z",
                     modifiedBy: "david",
                     type: "Fairsharing record",
                     fairsharingRecord:
                     {
                         id: "3271",
                         name: "erewrfsd"
                     }
                }
             ],
             recordsInCuration: [
                {
                     username: "PRS",
                     fairsharingRecords: [
                         {
                             id: "11",
                             name: "Amphibian Anatomy Ontology",
                             status: "deprecated"
                         },
                         {
                             id: "12",
                             name: "Frog French databases",
                             status: "deprecated"
                         }
                     ]
                }
             ],
             recordsWithoutDois: [
                {
                     id: "266995",
                     name: "ShareShare",
                     createdAt: "2020-10-12T13:31:25Z",
                     status: "ready"
                }
             ]
         }
    });
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
  });


  it("can check prepareData returns data elements correctly", async () => {
      expect(wrapper.vm.approvalRequired.length).toBe(1);
      expect(wrapper.vm.approvalRequired[0].curator).toBe("Terazus");
      expect(wrapper.vm.maintenanceRequests.length).toBe(1);
      expect(wrapper.vm.maintenanceRequests[0].recordNameID).toBe("OrthoOntology Deontology (373)");
      expect(wrapper.vm.recordsCreatedCuratorsLastWeek.length).toBe(2);
      expect(wrapper.vm.recordsCreatedCuratorsLastWeek[1].recordNameID).toBe("Second (44)");
      expect(wrapper.vm.recentlyUpdatedContent.length).toBe(1);
      expect(wrapper.vm.recentlyUpdatedContent[0].modifiedAt).toBe("2020-10-27T09:34:57Z");
      expect(wrapper.vm.recordsInCuration.length).toBe(2);
      expect(wrapper.vm.recordsInCuration[1].recordNameID).toBe("Frog French databases (12)");
      expect(wrapper.vm.recordsWithoutDois.length).toBe(1);
      expect(wrapper.vm.recordsWithoutDois[0].createdAt).toBe("2020-10-12T13:31:25Z");
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
      //
  });
});
