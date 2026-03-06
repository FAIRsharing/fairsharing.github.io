import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import MaintenanceRequests from "@/components/Curators/MaintenanceRequests.vue";
import RestClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";

// -------------------------------------------------------------------------
// 1. MOCK EXTERNAL DEPENDENCIES
// -------------------------------------------------------------------------

// Mock RESTClient and GraphClient classes
vi.mock("@/lib/Client/RESTClient.js", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      updateStatusMaintenanceRequest: vi.fn(),
      deleteRecord: vi.fn(),
    })),
  };
});

vi.mock("@/lib/GraphClient/GraphClient", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      setHeader: vi.fn(),
      executeQuery: vi.fn(),
    })),
  };
});

// Mock Data
const mockGraphResponse = {
  pendingMaintenanceRequests: [
    {
      id: "req-1",
      createdAt: "2023-01-01T10:00:00Z",
      user: { id: "u1", username: "UserA" },
      fairsharingRecord: {
        id: "rec-1",
        name: "Record A",
        type: "dataset",
        processingNotes: "Notes A",
      },
    },
    {
      id: "req-2",
      createdAt: "2023-02-01T10:00:00Z",
      user: { id: "u2", username: "UserB" },
      fairsharingRecord: {
        id: "rec-2",
        name: "Record B",
        type: "database",
        processingNotes: "Notes B",
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

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();

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
      },
      props: {
        headerItems: [],
      },
      // Mock Mixin
      mixins: [{ methods: { formatDate: (d) => `Formatted: ${d}` } }],
    });
  });

  describe("Initialization (Mounted)", () => {
    it("fetches data, formats dates, and sorts records desc", async () => {
      await wrapper.vm.$nextTick();
      await new Promise((r) => setTimeout(r, 0)); // Flush promises

      expect(graphQuerySpy).toHaveBeenCalled();

      // Check formatting (mixin usage)
      expect(wrapper.vm.maintenanceRequests[0].createdAt).toContain(
        "Formatted:",
      );

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

  describe("saveProcessingNotes", () => {
    it("successfully calls updateRecord", async () => {
      await wrapper.vm.saveProcessingNotes("rec-1", "New Notes");

      expect(updateRecordActionSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          id: "rec-1",
          record: { processing_notes: "New Notes", skip_approval: true },
        }),
      );
    });

    it("handles update error", async () => {
      // Mock error state in store
      store.state.record.recordUpdate = {
        error: true,
        message: "Server Error",
      };

      await wrapper.vm.saveProcessingNotes("rec-1", "Notes");

      expect(wrapper.vm.error.general).toBe("Server Error");
      expect(wrapper.vm.error.recordID).toBe("rec-1");
    });
  });

  describe("assignMaintenanceOwnConfirm (Complex Logic)", () => {
    // Scenario 1: Approve + Success + Record exists elsewhere (Do NOT clear notes)
    it("approves request but preserves notes if record is in approval list", async () => {
      await wrapper.vm.$nextTick(); // Load data

      // Setup: "rec-2" is in approvalRequired list
      wrapper.setData({
        approvalRequired: [{ id: "rec-2" }],
        dialogs: {
          requestId: "req-2",
          recordID: "rec-2",
          confirmAssignment: true,
        },
      });

      const saveNotesSpy = vi.spyOn(wrapper.vm, "saveProcessingNotes");

      await wrapper.vm.assignMaintenanceOwnConfirm("approved");

      expect(restUpdateSpy).toHaveBeenCalledWith(
        "req-2",
        "approved",
        "test-token",
      );
      // Should remove from processed list
      expect(
        wrapper.vm.maintenanceRequestsProcessed.find(
          (r) => r.requestID === "req-2",
        ),
      ).toBeUndefined();
      // Should NOT clear notes because it's in approvalRequired
      expect(saveNotesSpy).not.toHaveBeenCalled();
      // Dialog closed
      expect(wrapper.vm.dialogs.confirmAssignment).toBe(false);
    });

    // Scenario 2: Approve + Success + Record is completely done (Clear notes)
    it("approves request and clears notes if record is fully processed", async () => {
      await wrapper.vm.$nextTick();

      // Setup: "rec-2" NOT in approval list, and will be removed from maintenance list
      wrapper.setData({
        approvalRequired: [],
        dialogs: {
          requestId: "req-2",
          recordID: "rec-2",
          confirmAssignment: true,
        },
      });

      const saveNotesSpy = vi.spyOn(wrapper.vm, "saveProcessingNotes");

      await wrapper.vm.assignMaintenanceOwnConfirm("approved");

      // Verify removal
      expect(
        wrapper.vm.maintenanceRequestsProcessed.find(
          (r) => r.requestID === "req-2",
        ),
      ).toBeUndefined();

      // CRITICAL: Verify notes are cleared (passed as null)
      expect(saveNotesSpy).toHaveBeenCalledWith("rec-2", null);
    });

    // Scenario 3: Reject Assignment
    it("rejects request correctly", async () => {
      await wrapper.vm.$nextTick();
      wrapper.setData({
        dialogs: {
          requestId: "req-1",
          recordID: "rec-1",
          rejectAssignment: true,
        },
      });

      await wrapper.vm.assignMaintenanceOwnConfirm("rejected");

      expect(restUpdateSpy).toHaveBeenCalledWith(
        "req-1",
        "rejected",
        "test-token",
      );
      // Should remove from list
      expect(wrapper.vm.maintenanceRequestsProcessed.length).toBe(1);
      // Dialog closed
      expect(wrapper.vm.dialogs.rejectAssignment).toBe(false);
    });

    // Scenario 4: API Error
    it("handles API error during assignment", async () => {
      restUpdateSpy.mockResolvedValue({ error: true });

      wrapper.setData({
        dialogs: { requestId: "req-1", recordID: "rec-1" },
      });

      await wrapper.vm.assignMaintenanceOwnConfirm("approved");

      expect(wrapper.vm.error.general).toContain("error assigning approved");
      expect(wrapper.vm.error.recordID).toBe("rec-1");
      // List should NOT change
      expect(wrapper.vm.maintenanceRequestsProcessed.length).toBe(2);
    });
  });

  it("prepareMaintenanceRequests: Formats data, sorts by date desc, and applies date formatting", () => {
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
    expect(wrapper.vm.maintenanceRequests[0].createdAt).toBe(
      "Formatted(2023-01-01)",
    );
    expect(wrapper.vm.maintenanceRequests[1].createdAt).toBe(
      "Formatted(2020-01-01)",
    );
  });
});
