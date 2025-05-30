import { createLocalVue, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import VueRouter from "vue-router";
import Vuex from "vuex";

import MaintenanceRequest from "@/components/Curators/MaintenanceRequests.vue";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js"
import recordStore from "@/store/recordData.js";
import usersStore from "@/store/users";

import dataDashboard from "../../../fixtures/curationDashboardData.json"

let curationDataSummary =  dataDashboard.curationSummary;
const localVue = createLocalVue();
localVue.use(Vuex);
let header = [
      {
        "text": "Date",
        "value": "createdAt"
      },
      {
        "text": "Record name (id)",
        "value": "recordName"
      },
      {
        "text": "User login",
        "value": "userNameID"
      },
      {
        "text": "Processing Notes",
        "value": "processingNotes",
        "sortable": false,
        "width": 250
      },
      { "text": "Accept request?",
        "value": "actions",
        "sortable": false
      }
    ];
usersStore.state.user = function () {
  return {
    isLoggedIn: true,
    credentials: { token: 123, username: 123 },
  };
};
recordStore.state.sections = {
  generalInformation: {
    data: {
      countries: [
        { label: "France", id: 1 },
        { label: "UK", id: 2 },
      ],
      metadata: {},
      type: { name: "test" },
    },
  },
};
const $store = new Vuex.Store({
  modules: {
    record: recordStore,
    users: usersStore,
  },
});

const router = new VueRouter();
const $router = { push: jest.fn() };

describe("Curator -> MaintenanceRequest.vue", () => {
  let restStub;
  let wrapper;
  let graphStub;
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
    wrapper = shallowMount(MaintenanceRequest, {
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
    expect(wrapper.vm.$options.name).toMatch("MaintenanceRequest");
    expect(wrapper.vm.prepareMaintenanceRequests).toHaveBeenCalled;
    expect(wrapper.vm.maintenanceRequestsProcessed.length).toBe(4);
    expect(wrapper.vm.maintenanceRequestsProcessed[0].recordName).toMatch(
      "Other thing (22)"
    );
    expect(wrapper.vm.maintenanceRequests.length).toBe(4);
    expect(wrapper.vm.maintenanceRequests[0].userName).toBe("Mariano");
    let date = new Date("2020,8,27");
    let auxString = date.toLocaleString('default', { month: 'short' }) + ' ' +
        date.getDate() + ', ' + date.getFullYear();

    expect(wrapper.vm.maintenanceRequests[1].createdAt).toBe(auxString);
  });

  it("can used methods that only change properties", () => {
    wrapper.vm.assignMaintenanceOwner("my record", 3232, "M (32)", 2);
    expect(wrapper.vm.dialogs.recordName).toMatch("my record");
    expect(wrapper.vm.dialogs.requestId).toBe(2);
    expect(wrapper.vm.dialogs.confirmAssignment).toBe(true);
    wrapper.vm.closeMaintenanceAssign();
    expect(wrapper.vm.dialogs.confirmAssignment).toBe(false);
    wrapper.vm.rejectMaintenanceOwner("my record2", 322, "V (3)", 1);
    expect(wrapper.vm.dialogs.recordName).toMatch("my record2");
    expect(wrapper.vm.dialogs.recordID).toBe(322);
    expect(wrapper.vm.dialogs.rejectAssignment).toBe(true);
    wrapper.vm.closeMaintenanceReject();
    expect(wrapper.vm.dialogs.rejectAssignment).toBe(false);
  });

  it("can approved/reject Maintenance", async () => {
    wrapper.vm.assignMaintenanceOwner("Record1 (23)", 23, "M (32)", 0);
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: false } });
    await wrapper.vm.assignMaintenanceOwnConfirm("approved");
    expect(wrapper.vm.maintenanceRequestsProcessed.length).toBe(3);
    expect(wrapper.vm.maintenanceRequestsProcessed[0].recordName).toMatch(
      "Other thing (22)"
    );
    //There is an error in the Client query
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: { response: { data: "error" } } } });
    await wrapper.vm.assignMaintenanceOwnConfirm("rejected");
    expect(wrapper.vm.maintenanceRequestsProcessed.length).toBe(3);
    expect(wrapper.vm.error.recordID).toBe(23);
    //The element to maintain is repeteated in the table approvalRequired
    wrapper.vm.assignMaintenanceOwner("Record3 (29)", 99, "M (32)", 3);
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: false } });
    await wrapper.vm.assignMaintenanceOwnConfirm("approved");
    expect(wrapper.vm.maintenanceRequestsProcessed.length).toBe(2);
    // TODO: Check that the ProcessingNotes are not updated to "" in the DB
    //The element to maintain is repeteated in the table maintenanceRequestsProcessed
    wrapper.vm.assignMaintenanceOwner("Record2 (23)", 24, "M (32)", 1);
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: false } });
    await wrapper.vm.assignMaintenanceOwnConfirm();
    expect(wrapper.vm.maintenanceRequestsProcessed.length).toBe(1);
    restStub.restore();
    // TODO: Check that the ProcessingNotes are not updated to "" in the DB
  });

  it("can update a record", async () => {
    // TODO: Check that the ProcessingNotes are updated
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: { response: "Im an error" } } });
    await wrapper.vm.saveProcessingNotes(24, "notes of text");
    expect(wrapper.vm.error.recordID).toBe(24);
  });

  it("can watch props data", () => {
    wrapper.vm.$options.watch.maintenanceRequests.call(wrapper.vm);
    expect(wrapper.vm.maintenanceRequestsProcessed[0].recordName).toMatch(
      "Other thing (22)"
    );
  });
});
