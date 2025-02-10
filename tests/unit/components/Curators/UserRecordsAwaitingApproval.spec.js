import { createLocalVue, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import VueRouter from "vue-router";
import Vuex from "vuex";

import UserRecordsAwaitingApproval from "@/components/Curators/UserRecordsAwaitingApproval.vue";
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
        "text": "Date last edit",
        "value": "updatedAt",
        "width": 90
      },
      {
        "text": "",
        "value": "priority",
        "width": 40
      },
      {
        "text": "Curator",
        "value": "curator",
        "width": 50
      },
      {
        "text": "Record name (id)",
        "value": "recordName",
        "width": 400
      },
      {
        "text": "Last editor",
        "value": "lastEditor",
        "width": 120
      },
      {
        "text": "Processing Notes",
        "value": "processingNotes",
        "sortable": false
      },
      { "text": "Accept record/edit?",
        "value": "actions",
        "sortable": false,
        "width": 130
      },
      {
        "text": "Creation date & user",
        "value": "createdAt",
        "width": 90
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

describe("Curator -> UserRecordsAwaitingApproval.vue", () => {
  let restStub;
  let wrapper;
  let graphStub;

  beforeAll(async () => {
    graphStub = sinon.stub(GraphClient.prototype, "executeQuery")
        .returns(curationDataSummary)
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: false } });


    wrapper = await shallowMount(UserRecordsAwaitingApproval, {
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
    expect(wrapper.vm.$options.name).toMatch("UserRecordsAwaitingApproval");
    expect(wrapper.vm.prepareApprovalRequired).toHaveBeenCalled;
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(3);
    expect(wrapper.vm.approvalRequiredProcessed[0].recordName).toMatch(
      "Radi (11)"
    );
    expect(wrapper.vm.approvalRequired.length).toBe(3);
    expect(wrapper.vm.approvalRequired[0].curator).toBe("Terazu");
    expect(wrapper.vm.approvalRequired[1].creator).toBe("unknown");
    expect(wrapper.vm.curatorList.length).toBe(3);
    //It is the super_curator
    expect(wrapper.vm.curatorList[0].userName).toBe("Luther");
    //It is the curator
    expect(wrapper.vm.curatorList[1].userName).toBe("H. Pepa");
    expect(wrapper.vm.curatorList[2].userName).toBe("none");
  });

  it("can use methods that only change properties", () => {
    wrapper.vm.approveChangesMenu("Record3 (99)", 99, true);
    expect(wrapper.vm.dialogs.recordName).toMatch("Record3 (99)");
    expect(wrapper.vm.dialogs.recordID).toBe(99);
    expect(wrapper.vm.dialogs.recordHidden).toBe(true);
    expect(wrapper.vm.dialogs.approveChanges).toBe(true);
    wrapper.vm.closeApproveChangesMenu();
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);
    jest.useFakeTimers();
    wrapper.vm.deleteRecordMenu("Record4 (100)", 100);
    jest.advanceTimersByTime(5000);
    expect(wrapper.vm.dialogs.disableDelButton).toBe(false);
    expect(wrapper.vm.dialogs.recordName).toMatch("Record4 (100)");
    expect(wrapper.vm.dialogs.recordID).toBe(100);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(true);
    wrapper.vm.closeDeleteMenu();
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
  });

  it("can update a record", async () => {
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: false } });
    await wrapper.vm.saveProcessingNotes(99, "notes of text");
    // TODO: Check that the ProcessingNotes are updated
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: { response: "Im an error" } } });
    await wrapper.vm.saveProcessingNotes(99, "notes of text");
    expect(wrapper.vm.error.recordID).toBe(99);
  });

  it("can assign a curator to a record", async () => {
    expect(wrapper.vm.approvalRequiredProcessed[1].curator).toMatch(
      "Terazu"
    );

    await wrapper.vm.assignCurator(11, 1, "Michael Smith");
    expect(wrapper.vm.approvalRequiredProcessed[0].curator).toMatch("Michae");

    // TODO: Check that the curator are updated in the record
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: { response: "Im an error" } } });
    await wrapper.vm.assignCurator(11, 1, "Michael Smith");
    expect(wrapper.vm.error.recordID).toBe(11);
  });

  it("can approve a record", async () => {
    //Correct approval
    wrapper.vm.dialogs.recordID = 100;
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: false } });
    await wrapper.vm.confirmApproval();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(2);
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);
    expect(wrapper.vm.approvalRequiredProcessed[1].id).toBe(12345);

    //The element to approvalRequiredProcessed is also in maintenanceRequests
    wrapper.vm.dialogs.recordID = 99;
    await wrapper.vm.confirmApproval();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(1);
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);
    expect(wrapper.vm.approvalRequiredProcessed[0].id).toBe(11);
    //There is an error in the Client query
    restStub.restore();
    wrapper.vm.dialogs.recordID = 101;
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: { response: { data: "error" } } } });
    await wrapper.vm.confirmApproval();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(1);
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);
    expect(wrapper.vm.approvalRequiredProcessed[0].id).toBe(11);
    expect(wrapper.vm.error.recordID).toBe(101);

    wrapper.vm.dialogs.recordID = 101;
    await wrapper.vm.confirmApproval();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(1);
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);

    restStub.restore();
    wrapper.vm.dialogs.recordID = 102;
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: { response: { data: "error" } } } });
    await wrapper.vm.confirmApproval();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(1);
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);

    // TODO: Check that the DB is correctly updated
  });

  it("can delete a record", async () => {
    //There is an error in the Client query
    wrapper.vm.dialogs.recordID = 102;
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: { response: { data: "error" } } } });
    await wrapper.vm.confirmDelete();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(1);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
    expect(wrapper.vm.approvalRequiredProcessed[0].id).toBe(11);
    expect(wrapper.vm.error.recordID).toBe(102);

    //Correct deleted
    wrapper.vm.dialogs.recordID = 102;
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: false } });
    await wrapper.vm.confirmDelete();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(0);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);

    // TODO: Check that the DB is correctly updated
  });

  it("can watch props data", () => {
    wrapper.vm.$options.watch.approvalRequired.call(wrapper.vm);
    expect(wrapper.vm.approvalRequiredProcessed[0].recordName).toMatch(
      "Radi (11)"
    );
  });
});
