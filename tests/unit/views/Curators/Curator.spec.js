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

  beforeAll( () => {
     restStub = sinon.stub(Client.prototype, "executeQuery").returns({
         data: {id: "12345", name: "Terazus", role: "1"}
     });
     graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
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
                     username: "Terazus",
                     fairsharingRecords: [
                         {
                             id: "11",
                             name: "Amphibian Anatomy Ontology",
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
     })
  });

  afterAll(() => {
      restStub.restore();
      graphStub.restore();
  });

  it("can be instantiated", () => {
      wrapper = shallowMount(Curator, {
          localVue,
          router,
          mocks: {$store,$router}
      });
      const title = "Curator";
      expect(wrapper.name()).toMatch(title);
  });

  it("can process errors", () => {
      restStub.restore();
      restStub = sinon.stub(Client.prototype, "executeQuery").returns({
          curationSummary: {error: "error"}
      });
      wrapper = shallowMount(Curator, {
          localVue,
          router,
          mocks: {$store, $router}
      });
  });

  it("can check prepareApprovalRequired returns for specific fields",()=>{
      wrapper = shallowMount(Curator, {
          localVue,
          router,
          mocks: {$store,$router}
      });
      expect(wrapper.vm.approvalRequired.length).toBe(1);
      expect(wrapper.vm.approvalRequired[0].curator).toBe("Terazus");
  });

});
