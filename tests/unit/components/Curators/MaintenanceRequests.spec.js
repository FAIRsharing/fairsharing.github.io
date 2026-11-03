import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import MaintenanceRequests from "@/components/Curators/MaintenanceRequests.vue";
import RestClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import {
  deleteProcessingNotes,
  saveProcessingNotes,
} from "@/utils/curatorUtils.js";

// MOCK EXTERNAL DEPENDENCIES
const graphClientMock = vi.hoisted(() => ({
  setHeader: vi.fn(),
  executeQuery: vi.fn(),
}));

const restClientMock = vi.hoisted(() => ({
  updateStatusMaintenanceRequest: vi.fn(),
  deleteRecord: vi.fn(),
  updateProcessingNotes: vi.fn(),
  createProcessingNotes: vi.fn(),
  deleteProcessingNote: vi.fn(),
}));

// Mock RESTClient and GraphClient classes
vi.mock("@/lib/Client/RESTClient.js", () => {
  return {
    default: vi.fn(function () {
      return restClientMock;
    }),
  };
});

vi.mock("@/lib/GraphClient/GraphClient", () => {
  return {
    default: vi.fn(function () {
      return graphClientMock;
    }),
  };
});

vi.mock("@/utils/curatorUtils.js", () => ({
  saveProcessingNotes: vi.fn(),
  deleteProcessingNotes: vi.fn(),
}));

// Mock Data
const mockGraphResponse = {
  pendingMaintenanceRequests: [
    {
      id: "req-1",
      createdAt: "2023-01-01T10:00:00Z",
      user: { id: "u1", username: "User A" },
      fairsharingRecord: {
        id: "rec-1",
        name: "Record A",
        type: "dataset",
        processingNotes: {
          id: 11,
          note: "Notes A",
        },
      },
    },
    {
      id: "req-2",
      createdAt: "2023-02-01T10:00:00Z",
      user: { id: "u2", username: "User B" },
      fairsharingRecord: {
        id: "rec-2",
        name: "Record B",
        type: "database",
        processingNotes: {
          id: 12,
          note: "Notes B",
        },
      },
    },
  ],
};

describe("MaintenanceRequests.vue", () => {
  let wrapper;
  let store;
  let graphQuerySpy;
  let restUpdateSpy;
  let updateRecordActionSpy;

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks();
    saveProcessingNotes.mockReset();
    deleteProcessingNotes.mockReset();
    // Default successful responses for utility functions
    saveProcessingNotes.mockResolvedValue({ success: true });
    deleteProcessingNotes.mockResolvedValue({ success: true });
    // 2. SETUP SPIES
    // Get the instance methods from the mocked classes
    const graphInstance = new GraphClient();
    graphQuerySpy = graphInstance.executeQuery;
    graphQuerySpy.mockResolvedValue(mockGraphResponse);

    const restInstance = new RestClient();
    restUpdateSpy = restInstance.updateStatusMaintenanceRequest;
    restUpdateSpy.mockResolvedValue({ error: false });

    updateRecordActionSpy = vi.fn().mockResolvedValue({});

    // 3. SETUP VUEX
    store = new Vuex.Store({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({ credentials: { token: "test-token" } }),
          },
        },
        record: {
          namespaced: true,
          state: {
            recordUpdate: { error: false, message: "" },
          },
          actions: {
            updateRecord: updateRecordActionSpy,
          },
        },
      },
    });

    // 4. MOUNT COMPONENT
    wrapper = shallowMount(MaintenanceRequests, {
      global: {
        plugins: [store],
        stubs: {
          "v-edit-dialog": true,
          VEditDialog: true,
        },
      },
      props: {
        headerItems: [],
      },
    });
    await flushPromises();
  });

  describe("Initialization (Mounted)", () => {
    it("fetches data, formats dates, and sorts records desc", async () => {
      await wrapper.vm.$nextTick();
      await new Promise((r) => setTimeout(r, 0)); // Flush promises

      expect(graphQuerySpy).toHaveBeenCalled();

      // Check date formatting
      expect(wrapper.vm.maintenanceRequests[0].createdAt).toBe("Feb 1, 2023");

      // Check Sorting (Desc Date)
      // req-2 (Feb) should come before req-1 (Jan)
      expect(wrapper.vm.maintenanceRequests[0].id).toBe("rec-2");
      expect(wrapper.vm.maintenanceRequests[1].id).toBe("rec-1");
    });
  });

  describe("Sorting Logic (compareRecordDesc)", () => {
    it("sorts correctly (Branch Coverage for if/else)", () => {
      const itemA = { createdAt: "2023-01-01" };
      const itemB = { createdAt: "2023-02-01" };

      // Case 1: B is newer than A (Should return 1)
      expect(wrapper.vm.compareRecordDesc(itemA, itemB)).toBe(1);

      // Case 2: A is newer than B (Should return -1)
      expect(wrapper.vm.compareRecordDesc(itemB, itemA)).toBe(-1);
    });
  });

  describe("Watchers", () => {
    it("deep copies maintenanceRequests to maintenanceRequestsProcessed", async () => {
      const newData = [{ id: "test", details: { foo: "bar" } }];
      await wrapper.setData({ maintenanceRequests: newData });

      expect(wrapper.vm.maintenanceRequestsProcessed).toEqual(newData);
      // Ensure different reference (Deep Copy)
      expect(wrapper.vm.maintenanceRequestsProcessed).not.toBe(newData);
      expect(wrapper.vm.maintenanceRequestsProcessed[0]).not.toBe(newData[0]);
    });

    it("closes confirmAssignment dialog when model becomes false", async () => {
      const spy = vi.spyOn(wrapper.vm, "closeMaintenanceAssign");

      // Set true (open) - spy should NOT call
      await wrapper.setData({ dialogs: { confirmAssignment: true } });
      expect(spy).not.toHaveBeenCalled();

      // Set false (close) - spy SHOULD call
      await wrapper.setData({ dialogs: { confirmAssignment: false } });
      expect(spy).toHaveBeenCalled();
    });

    it("closes rejectAssignment dialog when model becomes false", async () => {
      const spy = vi.spyOn(wrapper.vm, "closeMaintenanceReject");

      await wrapper.setData({ dialogs: { rejectAssignment: true } });
      expect(spy).not.toHaveBeenCalled();

      await wrapper.setData({ dialogs: { rejectAssignment: false } });
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("Dialog Controls", () => {
    it("opens and closes assign dialog", () => {
      wrapper.vm.assignMaintenanceOwner("Rec", "1", "User", "req1");
      expect(wrapper.vm.dialogs.confirmAssignment).toBe(true);
      expect(wrapper.vm.dialogs.recordID).toBe("1");

      wrapper.vm.closeMaintenanceAssign();
      expect(wrapper.vm.dialogs.confirmAssignment).toBe(false);
      expect(wrapper.vm.dialogs.disableDelButton).toBe(true);
    });

    it("opens and closes reject dialog", () => {
      wrapper.vm.rejectMaintenanceOwner("Rec", "1", "User", "req1");
      expect(wrapper.vm.dialogs.rejectAssignment).toBe(true);

      wrapper.vm.closeMaintenanceReject();
      expect(wrapper.vm.dialogs.rejectAssignment).toBe(false);
    });
  });

  describe("assignMaintenanceOwnConfirm", () => {
    beforeEach(async () => {
      await wrapper.setData({
        dialogs: {
          ...wrapper.vm.dialogs,
          requestId: "req-2",
          recordID: "rec-2",
          confirmAssignment: true,
        },
      });
    });

    it("approves request without deleting notes when approval is pending", async () => {
      await wrapper.setData({
        approvalRequired: [{ id: "rec-2" }],
      });

      await wrapper.vm.assignMaintenanceOwnConfirm("approved");

      expect(restUpdateSpy).toHaveBeenCalledWith(
        "req-2",
        "approved",
        "test-token",
      );

      expect(deleteProcessingNotes).not.toHaveBeenCalled();

      expect(wrapper.vm.dialogs.confirmAssignment).toBe(false);
    });

    it("deletes processing notes when record is fully processed", async () => {
      await wrapper.setData({
        approvalRequired: [],
      });

      deleteProcessingNotes.mockResolvedValue({
        success: true,
      });

      await wrapper.vm.assignMaintenanceOwnConfirm("approved");

      expect(deleteProcessingNotes).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "rec-2",
        }),
        "test-token",
      );

      expect(
        wrapper.vm.maintenanceRequestsProcessed.find(
          (record) => record.requestID === "req-2",
        ),
      ).toBeUndefined();

      expect(wrapper.vm.dialogs.confirmAssignment).toBe(false);
    });

    it("does not delete notes if another maintenance request exists", async () => {
      await wrapper.setData({
        approvalRequired: [],
        maintenanceRequestsProcessed: [
          ...wrapper.vm.maintenanceRequestsProcessed,
          {
            id: "rec-2",
            requestID: "another-request",
          },
        ],
      });

      await wrapper.vm.assignMaintenanceOwnConfirm("approved");

      expect(deleteProcessingNotes).not.toHaveBeenCalled();
    });

    it("rejects a maintenance request", async () => {
      await wrapper.setData({
        dialogs: {
          ...wrapper.vm.dialogs,
          rejectAssignment: true,
        },
        approvalRequired: [{ id: "rec-2" }],
      });

      await wrapper.vm.assignMaintenanceOwnConfirm("rejected");

      expect(restUpdateSpy).toHaveBeenCalledWith(
        "req-2",
        "rejected",
        "test-token",
      );

      expect(wrapper.vm.dialogs.rejectAssignment).toBe(false);
    });

    it("handles API errors during assignment", async () => {
      restUpdateSpy.mockResolvedValue({
        error: true,
      });

      await wrapper.vm.assignMaintenanceOwnConfirm("approved");

      expect(wrapper.vm.error.general).toBe("error assigning approved");

      expect(wrapper.vm.error.recordID).toBe("rec-2");

      expect(wrapper.vm.maintenanceRequestsProcessed).toHaveLength(2);

      expect(deleteProcessingNotes).not.toHaveBeenCalled();
    });

    it("displays an error when processing-note deletion fails", async () => {
      await wrapper.setData({
        approvalRequired: [],
      });

      deleteProcessingNotes.mockResolvedValue({
        success: false,
        error: "Failed to delete processing notes.",
      });

      await wrapper.vm.assignMaintenanceOwnConfirm("approved");

      expect(wrapper.vm.processingNoteError).toBe(
        "Failed to delete processing notes.",
      );
    });
  });

  describe("saveProcessingNotesAndClose", () => {
    const token = "test-token";

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
      } finally {
        consoleSpy.mockRestore();
      }
    });
  });

  describe("deleteProcessingNoteAndClose", () => {
    const token = "test-token";
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
  });

  it("prepareMaintenanceRequests: Formats data, sorts by date desc, and applies date formatting", () => {
    wrapper.vm.maintenanceRequests = [];

    // RAW MOCK DATA (Before processing)
    const rawData = {
      pendingMaintenanceRequests: [
        {
          id: "req_old",
          createdAt: "2020-01-01",
          user: { id: "u1", username: "User1" },
          fairsharingRecord: {
            id: "rec_A",
            name: "Record A",
            type: "dataset",
            processingNotes: "Notes A",
          },
        },
        {
          id: "req_new",
          createdAt: "2023-01-01", // Newer date
          user: { id: "u2", username: "User2" },
          fairsharingRecord: {
            id: "rec_B",
            name: "Record B",
            type: "database",
            processingNotes: "Notes B",
          },
        },
      ],
    };

    // Call method directly
    wrapper.vm.prepareMaintenanceRequests(rawData);

    // ASSERTION 1: Data pushed to array
    expect(wrapper.vm.maintenanceRequests.length).toBe(2);

    // ASSERTION 2: Sorting Logic
    // Because of .sort(compareRecordDesc), the newer date (2023) should be at index 0
    expect(wrapper.vm.maintenanceRequests[0].id).toBe("rec_B"); // 2023
    expect(wrapper.vm.maintenanceRequests[1].id).toBe("rec_A"); // 2020

    // ASSERTION 3: Date Formatting
    // The method loops at the end and calls formatDate
    expect(wrapper.vm.maintenanceRequests[0].createdAt).toBe("Jan 1, 2023");
    expect(wrapper.vm.maintenanceRequests[1].createdAt).toBe("Jan 1, 2020");
  });
});
