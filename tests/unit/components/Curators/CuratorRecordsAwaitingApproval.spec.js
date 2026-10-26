import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import CuratorRecordsAwaitingApproval from "@/components/Curators/CuratorRecordsAwaitingApproval.vue";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import recordStore from "@/store/recordData.js";
import usersStore from "@/store/users";

import dataDashboard from "../../../fixtures/curationDashboardData.json";
import {
  deleteProcessingNotes,
  saveProcessingNotes,
} from "@/utils/curatorUtils.js";

vi.mock("@/utils/curatorUtils.js", () => ({
  saveProcessingNotes: vi.fn(),
  deleteProcessingNotes: vi.fn(),
}));

let curationDataSummary = dataDashboard.curationSummary;

// Define Header constants
let header = [
  { text: "Date last edit", value: "updatedAt", width: 90 },
  { text: "", value: "priority", width: 40 },
  { text: "Curator", value: "curator", width: 50 },
  { text: "Record name (id)", value: "recordName", width: 400 },
  { text: "Last editor", value: "lastEditor", width: 120 },
  { text: "Processing Notes", value: "processingNotes", sortable: false },
  {
    text: "Accept record/edit?",
    value: "actions",
    sortable: false,
    width: 130,
  },
  { text: "Creation date & user", value: "createdAt", width: 90 },
];

// Setup Store Data
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

// Create Store Instance
const store = new Vuex.Store({
  modules: {
    record: recordStore,
    users: usersStore,
  },
});

// Mock Router
const $router = { push: vi.fn() };

describe("CuratorRecordsAwaitingApproval.vue", () => {
  let wrapper;
  let restSpy;

  beforeEach(() => {
    // Setup Spies
    vi.spyOn(GraphClient.prototype, "executeQuery").mockReturnValue(
      curationDataSummary,
    );

    restSpy = vi
      .spyOn(Client.prototype, "executeQuery")
      .mockReturnValue({ data: { error: false } });

    // Mount Component
    wrapper = shallowMount(CuratorRecordsAwaitingApproval, {
      global: {
        plugins: [store],
        mocks: { $router },
      },
      props: {
        headerItems: header,
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // graphSpy.restore();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("CuratorRecordsAwaitingApproval");
    // Check if method was called (assuming prepareApprovalRequired is called on mount)
    // Note: checking private methods is discouraged, but maintaining legacy test logic:
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(3);
    expect(wrapper.vm.approvalRequiredProcessed[0].recordName).toMatch(
      "Radi (11)",
    );
    expect(wrapper.vm.approvalRequired.length).toBe(3);
    expect(wrapper.vm.approvalRequired[0].curator).toBe("Terazu");
    expect(wrapper.vm.approvalRequired[1].creator).toBe("unknown");
    expect(wrapper.vm.curatorList.length).toBe(3);

    // Check Super Curator
    expect(wrapper.vm.curatorList[0].userName).toBe("Luther");
    // Check Curator
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

    // Timer Test
    vi.useFakeTimers();
    wrapper.vm.deleteRecordMenu("Record4 (100)", 100);
    vi.advanceTimersByTime(5000);

    expect(wrapper.vm.dialogs.disableDelButton).toBe(false);
    expect(wrapper.vm.dialogs.recordName).toMatch("Record4 (100)");
    expect(wrapper.vm.dialogs.recordID).toBe(100);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(true);

    wrapper.vm.closeDeleteMenu();
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
    vi.useRealTimers();
  });

  it("can assign a curator to a record", async () => {
    expect(wrapper.vm.approvalRequiredProcessed[1].curator).toMatch("Terazu");

    await wrapper.vm.assignCurator(11, 1, "Michael Smith");
    expect(wrapper.vm.approvalRequiredProcessed[0].curator).toMatch("Michae");

    // Change mock to error
    restSpy.mockReturnValue({ data: { error: { response: "Im an error" } } });
    await wrapper.vm.assignCurator(11, 1, "Michael Smith");
    expect(wrapper.vm.error.recordID).toBe(11);

    await wrapper.vm.assignCurator(11, 1, "none");
  });

  it("can approve a record", async () => {
    // Correct approval (Mock is already success from beforeEach)
    wrapper.vm.dialogs.recordID = 100;
    await wrapper.vm.confirmApproval();

    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(2);
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);
    expect(wrapper.vm.approvalRequiredProcessed[1].id).toBe(12345);

    // The element to approvalRequiredProcessed is also in maintenanceRequests
    wrapper.vm.dialogs.recordID = 99;
    await wrapper.vm.confirmApproval();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(1);
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);
    expect(wrapper.vm.approvalRequiredProcessed[0].id).toBe(11);

    // Simulate Error in Client query
    restSpy.mockReturnValue({
      data: { error: { response: { data: "error" } } },
    });

    wrapper.vm.dialogs.recordID = 101;
    await wrapper.vm.confirmApproval();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(1);
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);
    expect(wrapper.vm.approvalRequiredProcessed[0].id).toBe(11);
    expect(wrapper.vm.error.recordID).toBe(101);

    // Repeat error check logic
    wrapper.vm.dialogs.recordID = 101;
    await wrapper.vm.confirmApproval();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(1);
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);

    wrapper.vm.dialogs.recordID = 102;
    await wrapper.vm.confirmApproval();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(1);
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);
  });

  it("can delete a record", async () => {
    // Simulate Error
    restSpy.mockReturnValue({
      data: { error: { response: { data: "error" } } },
    });

    wrapper.vm.dialogs.recordID = 102;
    await wrapper.vm.confirmDelete();

    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(3);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
    expect(wrapper.vm.approvalRequiredProcessed[0].id).toBe(11);
    expect(wrapper.vm.error.recordID).toBe(102);

    // Simulate Success
    restSpy.mockReturnValue({ data: { error: false } });

    wrapper.vm.dialogs.recordID = 102;
    await wrapper.vm.confirmDelete();

    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(2);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
  });

  it("can watch props data", () => {
    // Directly call the watcher if testing Options API internals
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
  describe("saveProcessingNotesAndClose", () => {
    const token = 123;

    let item;
    let isActive;

    beforeEach(() => {
      vi.clearAllMocks();

      item = {
        id: 99,
        recordName: "Test Record",
        processingNoteId: 123,
        processingNotes: "Original note",
      };

      isActive = {
        value: true,
      };

      wrapper.vm.processingNotesDraft = "Updated note content";
      wrapper.vm.processingNoteError = null;
      wrapper.vm.loading = false;
    });

    it("calls saveProcessingNotes with the correct arguments", async () => {
      saveProcessingNotes.mockResolvedValue({
        success: true,
      });

      await wrapper.vm.saveProcessingNotesAndClose(item, isActive);

      expect(saveProcessingNotes).toHaveBeenCalledWith(
        item,
        "Updated note content",
        token,
      );
    });

    it("keeps the menu open when saving fails", async () => {
      saveProcessingNotes.mockResolvedValue({
        success: false,
        error: "Failed to save processing notes.",
      });

      await wrapper.vm.saveProcessingNotesAndClose(item, isActive);

      expect(isActive.value).toBe(true);
      expect(wrapper.vm.processingNoteError).toBe(
        "Failed to save processing notes.",
      );
      expect(wrapper.vm.loading).toBe(false);
    });

    it("resets loading when the utility throws an error", async () => {
      const error = new Error("Unexpected server error");
      saveProcessingNotes.mockRejectedValue(error);
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      try {
        await wrapper.vm.saveProcessingNotesAndClose(item, isActive);
        expect(wrapper.vm.loading).toBe(false);
        expect(isActive.value).toBe(true);
        expect(wrapper.vm.processingNoteError).toBe(
          "The processing notes for record Test Record could not be saved.",
        );
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to save processing notes:",
          error,
        );
      }
      finally {
        consoleSpy.mockRestore();
      }
    });
  });

  describe("deleteProcessingNoteAndClose", () => {
    const token = 123;
    let item;
    let isActive;
    let consoleSpy;

    beforeEach(() => {
      vi.clearAllMocks();

      item = {
        id: 99,
        recordName: "Test Record",
        processingNoteId: 123,
        processingNotes: "Existing note",
      };

      isActive = {
        value: true,
      };

      wrapper.vm.processingNoteError = null;
      wrapper.vm.loading = false;
      consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it("calls deleteProcessingNotes with the correct arguments", async () => {
      deleteProcessingNotes.mockResolvedValue({
        success: true,
      });

      await wrapper.vm.deleteProcessingNoteAndClose(item, isActive);

      expect(deleteProcessingNotes).toHaveBeenCalledWith(item, token);
    });

    it("keeps the menu open when deletion fails", async () => {
      deleteProcessingNotes.mockResolvedValue({
        success: false,
        error: "Failed to delete processing notes.",
      });

      await wrapper.vm.deleteProcessingNoteAndClose(item, isActive);

      expect(isActive.value).toBe(true);
      expect(wrapper.vm.processingNoteError).toBe(
        "Failed to delete processing notes.",
      );
      expect(wrapper.vm.loading).toBe(false);
    });

    it("handles unexpected errors and displays an error message", async () => {
      const error = new Error("Unexpected server error");

      deleteProcessingNotes.mockRejectedValue(error);

      await wrapper.vm.deleteProcessingNoteAndClose(item, isActive);

      expect(wrapper.vm.processingNoteError).toBe(
        "The processing notes for record Test Record could not be deleted.",
      );

      expect(isActive.value).toBe(true);
      expect(wrapper.vm.loading).toBe(false);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to delete processing notes:",
        error,
      );
    });

    // it("resets loading when deletion fails", async () => {
    //   deleteProcessingNotes.mockResolvedValue({
    //     success: false,
    //     error: "Server unavailable",
    //   });
    //
    //   await wrapper.vm.deleteProcessingNoteAndClose(item, isActive);
    //
    //   expect(wrapper.vm.loading).toBe(false);
    //   expect(wrapper.vm.processingNoteError).toBe("Server unavailable");
    //   expect(isActive.value).toBe(true);
    // });
  });
});
