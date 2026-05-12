import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";
import { defineComponent, h } from "vue";

import UserRecordsAwaitingApproval from "@/components/Curators/UserRecordsAwaitingApproval.vue";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import recordStore from "@/store/recordData.js";
import usersStore from "@/store/users";

import dataDashboard from "../../../fixtures/curationDashboardData.json";

let curationDataSummary = dataDashboard.curationSummary;

let header = [
  {
    title: "Date last edit",
    value: "updatedAt",
    width: 90,
  },
  {
    title: "",
    value: "priority",
    width: 40,
  },
  {
    title: "Curator",
    value: "curator",
    width: 50,
  },
  {
    title: "Record name (id)",
    value: "recordName",
    width: 400,
  },
  {
    title: "Last editor",
    value: "lastEditor",
    width: 120,
  },
  {
    title: "Processing Notes",
    value: "processingNotes",
    sortable: false,
  },
  {
    title: "Accept record/edit?",
    value: "actions",
    sortable: false,
    width: 130,
  },
  {
    title: "Creation date & user",
    value: "createdAt",
    width: 90,
  },
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

const $router = { push: vi.fn() };

const editDialogStub = defineComponent({
  name: "VEditDialog",
  setup(_, { slots }) {
    // Renders whatever is placed inside the <v-edit-dialog> tags
    return () => h("div", slots.default?.());
  },
});

describe("Curator -> UserRecordsAwaitingApproval.vue", () => {
  let restStub;
  let wrapper;
  let graphStub;

  beforeAll(async () => {
    graphStub = sinon
      .stub(GraphClient.prototype, "executeQuery")
      .returns(curationDataSummary);
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: false } });

    wrapper = await shallowMount(UserRecordsAwaitingApproval, {
      global: {
        plugins: [$store],
        mocks: { $router },
        stubs: {
          "v-edit-dialog": editDialogStub,
          VEditDialog: editDialogStub,
        },
      },
      props: {
        headerItems: header,
      },
    });
  });

  afterEach(() => {
    graphStub.restore();
    restStub.restore();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("UserRecordsAwaitingApproval");
    expect(wrapper.vm.prepareApprovalRequired).toHaveBeenCalled;
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(3);
    expect(wrapper.vm.approvalRequiredProcessed[0].recordName).toMatch(
      "Radi (11)",
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
    vi.useFakeTimers();
    wrapper.vm.deleteRecordMenu("Record4 (100)", 100);
    vi.advanceTimersByTime(5000);
    expect(wrapper.vm.dialogs.disableDelButton).toBe(false);
    expect(wrapper.vm.dialogs.recordName).toMatch("Record4 (100)");
    expect(wrapper.vm.dialogs.recordID).toBe(100);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(true);
    wrapper.vm.closeDeleteMenu();
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
  });

  it("can assign a curator to a record", async () => {
    expect(wrapper.vm.approvalRequiredProcessed[1].curator).toMatch("Terazu");

    await wrapper.vm.assignCurator(11, 1, "Michael Smith");
    expect(wrapper.vm.approvalRequiredProcessed[0].curator).toMatch("Michae");

    // TODO: Check that the curator are updated in the record
    restStub = sinon.stub(Client.prototype, "executeQuery");
    restStub.returns({ data: { error: { response: "Im an error" } } });
    await wrapper.vm.assignCurator(11, 1, "Michael Smith");
    expect(wrapper.vm.error.recordID).toBe(11);

    await wrapper.vm.assignCurator(11, 1, "none");
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
      "Radi (11)",
    );
  });

  it("calls closeApproveChangesMenu for dialogs.approveChanges watcher", async () => {
    const closeSpy = vi.spyOn(wrapper.vm, "closeApproveChangesMenu");
    await wrapper.setData({ dialogs: { approveChanges: true } });
    expect(closeSpy).not.toHaveBeenCalled();
    await wrapper.setData({ dialogs: { approveChanges: false } });
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it("calls closeDeleteMenu for dialogs.deleteRecord watcher", async () => {
    const closeSpy = vi.spyOn(wrapper.vm, "closeDeleteMenu");
    await wrapper.setData({ dialogs: { deleteRecord: true } });
    expect(closeSpy).not.toHaveBeenCalled();
    await wrapper.setData({ dialogs: { deleteRecord: false } });
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it("updates an existing processing note when processingNoteId is present", async () => {
    // 1. Setup
    const updateStub = sinon
      .stub(Client.prototype, "updateProcessingNotes")
      .resolves({ data: { success: true } });
    const item = { processingNoteId: 123 };
    const idRecord = 99;
    const notesText = "Updated note content";

    // 2. Execute
    await wrapper.vm.saveProcessingNotes(idRecord, notesText, item);

    // 3. Assertions
    expect(updateStub.calledOnce).toBe(true);
    // Check that it passed the correct ID and Text
    expect(updateStub.firstCall.args[0]).toBe(123);
    expect(updateStub.firstCall.args[1]).toBe(notesText);
    expect(wrapper.vm.loading).toBe(false);

    updateStub.restore();
  });

  it("creates a new processing note and updates the item ID when processingNoteId is absent", async () => {
    const newNoteId = 456;
    const createStub = sinon
      .stub(Client.prototype, "createProcessingNotes")
      .resolves({
        data: { id: newNoteId },
      });
    const item = {};
    const idRecord = 99;
    const notesText = "Brand new note";
    await wrapper.vm.saveProcessingNotes(idRecord, notesText, item);
    expect(createStub.calledOnce).toBe(true);
    expect(item.processingNoteId).toBe(newNoteId);
    expect(wrapper.vm.loading).toBe(false);
    createStub.restore();
  });

  it("sets error messages when the API call fails", async () => {
    const createStub = sinon
      .stub(Client.prototype, "createProcessingNotes")
      .rejects(new Error("Network Error"));
    const item = {};
    const idRecord = 777;
    wrapper.vm.error.general = "";
    wrapper.vm.error.recordID = null;
    await wrapper.vm.saveProcessingNotes(idRecord, "some text", item);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.error.general).toBe("Failed to save processing note.");
    expect(wrapper.vm.error.recordID).toBe(idRecord);
    createStub.restore();
  });

  it("clears local text and returns early if no processingNoteId exists", async () => {
    const item = {
      processingNotes: "some unsaved text",
      processingNoteId: null,
    };

    await wrapper.vm.deleteProcessingNote(item);

    expect(item.processingNotes).toBe("");
    expect(wrapper.vm.loading).toBe(false);
  });

  it("successfully deletes a note from the database", async () => {
    const deleteStub = sinon
      .stub(Client.prototype, "deleteProcessingNote")
      .resolves({ data: { success: true } });
    const item = {
      id: 101,
      processingNotes: "Existing note text",
      processingNoteId: 55,
    };
    wrapper.vm.loading = false;
    await wrapper.vm.deleteProcessingNote(item);
    expect(deleteStub.calledOnce).toBe(true);
    expect(deleteStub.firstCall.args[0]).toBe(55); // The note ID
    expect(item.processingNotes).toBe("");
    expect(item.processingNoteId).toBe(null);
    expect(wrapper.vm.loading).toBe(false);

    deleteStub.restore();
  });

  it("handles errors when the delete API call fails", async () => {
    const deleteStub = sinon
      .stub(Client.prototype, "deleteProcessingNote")
      .rejects(new Error("Delete failed"));
    const item = {
      id: 202,
      processingNoteId: 99,
    };
    wrapper.vm.error.general = "";
    wrapper.vm.error.recordID = null;
    await wrapper.vm.deleteProcessingNote(item);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.error.general).toBe("Failed to delete processing note.");
    expect(wrapper.vm.error.recordID).toBe(202);
    deleteStub.restore();
  });
});
