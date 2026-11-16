import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import MaintenanceRequests from "@/components/Curators/MaintenanceRequests.vue";
import RestClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import {
  VBtnStub,
  VDataTableStub,
  VDialogStub,
  VMenuStub,
  VOverlayStub,
  VTextareaStub,
  VTextFieldStub,
} from "../../../stubs";
import {
  deleteProcessingNotes,
  saveProcessingNotes,
} from "@/utils/curatorUtils.js";

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

vi.mock("@/utils/curatorUtils", () => ({
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
        processingNotes: "Notes A",
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

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the instance methods from the mocked classes
    const graphInstance = new GraphClient();
    graphQuerySpy = graphInstance.executeQuery;
    graphQuerySpy.mockResolvedValue(mockGraphResponse);

    const restInstance = new RestClient();
    restUpdateSpy = restInstance.updateStatusMaintenanceRequest;
    restUpdateSpy.mockResolvedValue({ error: false });
    updateRecordActionSpy = vi.fn().mockResolvedValue({});

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

    wrapper = shallowMount(MaintenanceRequests, {
      global: {
        plugins: [store],
        stubs: {
          "v-edit-dialog": true,
          VEditDialog: true,
          VDataTable: VDataTableStub,
          VTextField: VTextFieldStub,
          VDialog: VDialogStub,
          VMenu: VMenuStub,
          VBtn: VBtnStub,
          VTextarea: VTextareaStub,
          VOverlay: VOverlayStub,
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

  describe("assignMaintenanceOwnConfirm (Complex Logic)", () => {
    it("does not delete processing notes when record exists in approvalRequired", async () => {
      const item = {
        id: "rec-1",
        requestID: "req-1",
        processingNoteId: 10,
      };
      await wrapper.setData({
        maintenanceRequestsProcessed: [item],
        maintenanceRequests: [item],
        approvalRequired: [{ id: "rec-1" }],
        dialogs: {
          ...wrapper.vm.dialogs,
          requestId: "req-1",
          recordID: "rec-1",
          confirmAssignment: true,
        },
      });
      restUpdateSpy.mockResolvedValueOnce({
        error: false,
      });
      vi.mocked(deleteProcessingNotes).mockClear();
      await wrapper.vm.assignMaintenanceOwnConfirm("approved");
      expect(wrapper.vm.maintenanceRequestsProcessed).toHaveLength(0);
      expect(deleteProcessingNotes).not.toHaveBeenCalled();
      expect(wrapper.vm.dialogs.confirmAssignment).toBe(false);
    });

    it("does not delete processing notes when another request exists", async () => {
      const firstRequest = {
        id: "rec-1",
        requestID: "req-1",
        processingNoteId: 10,
      };
      const secondRequest = {
        id: "rec-1",
        requestID: "req-2",
        processingNoteId: 10,
      };
      await wrapper.setData({
        maintenanceRequestsProcessed: [firstRequest, secondRequest],
        maintenanceRequests: [firstRequest, secondRequest],
        approvalRequired: [],
        dialogs: {
          ...wrapper.vm.dialogs,
          requestId: "req-1",
          recordID: "rec-1",
          confirmAssignment: true,
        },
      });
      restUpdateSpy.mockResolvedValueOnce({
        error: false,
      });
      vi.mocked(deleteProcessingNotes).mockClear();
      await wrapper.vm.assignMaintenanceOwnConfirm("approved");
      expect(wrapper.vm.maintenanceRequestsProcessed).toHaveLength(1);
      expect(wrapper.vm.maintenanceRequestsProcessed[0].requestID).toBe(
        "req-2",
      );
      expect(deleteProcessingNotes).not.toHaveBeenCalled();
      expect(wrapper.vm.dialogs.confirmAssignment).toBe(false);
    });

    it("handles processing notes deletion failure after rejecting final request", async () => {
      const item = {
        id: "rec-1",
        requestID: "req-1",
        recordName: "Record A",
        processingNoteId: 10,
        processingNotes: "Existing notes",
      };
      await wrapper.setData({
        maintenanceRequestsProcessed: [item],
        maintenanceRequests: [item],
        approvalRequired: [],
        processingNoteError: null,
        dialogs: {
          ...wrapper.vm.dialogs,
          requestId: "req-1",
          recordID: "rec-1",
          rejectAssignment: true,
        },
      });
      restUpdateSpy.mockResolvedValueOnce({
        error: false,
      });
      vi.mocked(deleteProcessingNotes).mockResolvedValueOnce({
        success: false,
        error: "Unable to delete processing notes",
      });
      await wrapper.vm.assignMaintenanceOwnConfirm("rejected");
      expect(deleteProcessingNotes).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "rec-1",
          processingNoteId: 10,
        }),
        "test-token",
      );
      expect(wrapper.vm.processingNoteError).toBe(
        "Unable to delete processing notes",
      );
      expect(wrapper.vm.maintenanceRequestsProcessed).toHaveLength(0);
      expect(wrapper.vm.dialogs.rejectAssignment).toBe(false);
    });

    it("handles final request when original record is not found", async () => {
      const item = {
        id: "rec-1",
        requestID: "req-1",
      };
      await wrapper.setData({
        maintenanceRequestsProcessed: [item],
        maintenanceRequests: [],
        approvalRequired: [],
        dialogs: {
          ...wrapper.vm.dialogs,
          requestId: "req-1",
          recordID: "rec-1",
          confirmAssignment: true,
        },
      });
      restUpdateSpy.mockResolvedValueOnce({
        error: false,
      });
      vi.mocked(deleteProcessingNotes).mockClear();
      await wrapper.vm.assignMaintenanceOwnConfirm("approved");
      expect(wrapper.vm.maintenanceRequestsProcessed).toHaveLength(0);
      expect(deleteProcessingNotes).not.toHaveBeenCalled();
      expect(wrapper.vm.dialogs.confirmAssignment).toBe(false);
    });

    it("rejects request correctly", async () => {
      await wrapper.setData({
        dialogs: {
          ...wrapper.vm.dialogs,
          requestId: "req-1",
          recordID: "rec-1",
          rejectAssignment: true,
        },
      });

      restUpdateSpy.mockResolvedValueOnce({
        error: false,
      });

      // Mock the correct utility
      vi.mocked(deleteProcessingNotes).mockResolvedValueOnce({
        success: true,
      });

      await wrapper.vm.assignMaintenanceOwnConfirm("rejected");

      expect(restUpdateSpy).toHaveBeenCalledWith(
        "req-1",
        "rejected",
        "test-token",
      );

      expect(deleteProcessingNotes).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "rec-1",
        }),
        "test-token",
      );

      expect(wrapper.vm.maintenanceRequestsProcessed).toHaveLength(1);
      expect(wrapper.vm.dialogs.rejectAssignment).toBe(false);
    });

    // API Error
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

  describe("saveProcessingNotesAndClose Methods", () => {
    it("can save processing notes and report a save failure", async () => {
      const item = {
        id: 99,
        recordName: "Test Record (99)",
        processingNoteId: null,
        processingNotes: "",
      };

      const isActive = { value: true };

      await wrapper.setData({
        processingNotesDraft: "notes of text",
      });

      // Success scenario
      vi.mocked(saveProcessingNotes).mockResolvedValueOnce({
        success: true,
      });

      await wrapper.vm.saveProcessingNotesAndClose(item, isActive);

      expect(saveProcessingNotes).toHaveBeenCalledWith(
        item,
        "notes of text",
        "test-token",
      );

      expect(isActive.value).toBe(false);
      expect(wrapper.vm.processingNoteError).toBeNull();
      expect(wrapper.vm.loading).toBe(false);

      // Failure scenario
      isActive.value = true;

      vi.mocked(saveProcessingNotes).mockResolvedValueOnce({
        success: false,
        error: "Unable to save notes",
      });

      await wrapper.vm.saveProcessingNotesAndClose(item, isActive);

      expect(saveProcessingNotes).toHaveBeenCalledTimes(2);
      expect(wrapper.vm.processingNoteError).toBe("Unable to save notes");
      expect(isActive.value).toBe(true);
      expect(wrapper.vm.loading).toBe(false);
    });

    it("handles an exception when saving processing notes", async () => {
      const item = {
        id: 99,
        recordName: "Test Record (99)",
        processingNoteId: null,
        processingNotes: "",
      };

      const isActive = { value: true };
      const failure = new Error("Network unavailable");

      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      vi.mocked(saveProcessingNotes).mockRejectedValueOnce(failure);

      await wrapper.setData({
        processingNotesDraft: "notes of text",
      });

      await wrapper.vm.saveProcessingNotesAndClose(item, isActive);

      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to save processing notes:",
        failure,
      );

      expect(wrapper.vm.processingNoteError).toBe(
        "The processing notes for record Test Record (99) could not be saved.",
      );

      expect(isActive.value).toBe(true);
      expect(wrapper.vm.loading).toBe(false);

      consoleSpy.mockRestore();
    });

    it("saves processing notes when Save is clicked", async () => {
      const item = wrapper.vm.maintenanceRequestsProcessed[0];

      item.processingNoteId = 10;
      item.processingNotes = "Original processing notes";

      await wrapper.vm.$nextTick();

      // Mock the utility used by the component
      vi.mocked(saveProcessingNotes).mockResolvedValueOnce({
        success: true,
      });

      const textarea = wrapper.get('[data-test="v-textarea"]');

      await textarea.setValue("Updated processing notes");

      expect(wrapper.vm.processingNotesDraft).toBe("Updated processing notes");

      const saveButton = wrapper
        .findAll("button")
        .find((button) => button.text().trim() === "Save");

      expect(saveButton).toBeDefined();

      await saveButton.trigger("click");

      await flushPromises();

      expect(saveProcessingNotes).toHaveBeenCalledWith(
        expect.objectContaining({
          id: item.id,
          processingNoteId: 10,
        }),
        "Updated processing notes",
        "test-token",
      );

      expect(wrapper.vm.processingNoteError).toBeNull();
      expect(wrapper.vm.loading).toBe(false);
    });
  });

  describe("deleteProcessingNoteAndClose Methods", () => {
    it("successfully deletes processing notes and closes the menu", async () => {
      const item = {
        id: 99,

        recordName: "Test Record (99)",

        processingNoteId: 55,

        processingNotes: "Existing notes",
      };

      const isActive = { value: true };

      vi.mocked(deleteProcessingNotes).mockResolvedValueOnce({
        success: true,
      });

      await wrapper.vm.deleteProcessingNoteAndClose(item, isActive);

      expect(deleteProcessingNotes).toHaveBeenCalledWith(
        item,

        "test-token",
      );

      expect(isActive.value).toBe(false);

      expect(wrapper.vm.processingNoteError).toBeNull();

      expect(wrapper.vm.loading).toBe(false);
    });

    it("handles exceptions when deleting processing notes", async () => {
      const item = {
        id: 99,
        recordName: "Test Record (99)",
        processingNoteId: 55,
        processingNotes: "Existing notes",
      };
      const isActive = { value: true };
      const failure = new Error("Network unavailable");
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      vi.mocked(deleteProcessingNotes).mockRejectedValueOnce(failure);
      await wrapper.vm.deleteProcessingNoteAndClose(item, isActive);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to delete processing notes:",
        failure,
      );
      expect(wrapper.vm.processingNoteError).toBe(
        "The processing notes for record Test Record (99) could not be deleted.",
      );
      expect(isActive.value).toBe(true);
      expect(wrapper.vm.loading).toBe(false);
      consoleSpy.mockRestore();
    });

    it("handles API failure when deleting processing notes", async () => {
      const item = {
        id: 99,
        recordName: "Test Record (99)",
        processingNoteId: 55,
        processingNotes: "Existing notes",
      };
      const isActive = { value: true };
      vi.mocked(deleteProcessingNotes).mockResolvedValueOnce({
        success: false,
        error: "Unable to delete processing notes",
      });
      await wrapper.vm.deleteProcessingNoteAndClose(item, isActive);
      expect(deleteProcessingNotes).toHaveBeenCalledWith(item, "test-token");
      expect(wrapper.vm.processingNoteError).toBe(
        "Unable to delete processing notes",
      );
      // The menu should remain open when deletion fails.
      expect(isActive.value).toBe(true);
      // Loading must reset even after an API failure.
      expect(wrapper.vm.loading).toBe(false);
    });

    it("deletes processing notes when Delete is clicked", async () => {
      const item = wrapper.vm.maintenanceRequestsProcessed[0];

      item.processingNoteId = 10;
      item.processingNotes = "Existing notes";

      await wrapper.vm.$nextTick();

      // Mock the utility actually called by the component
      vi.mocked(deleteProcessingNotes).mockResolvedValueOnce({
        success: true,
      });

      const deleteButton = wrapper
        .findAll("button")
        .find((button) => button.text().trim() === "Delete");

      expect(deleteButton).toBeDefined();

      await deleteButton.trigger("click");
      await flushPromises();

      expect(deleteProcessingNotes).toHaveBeenCalledWith(
        expect.objectContaining({
          id: item.id,
          processingNoteId: 10,
        }),
        "test-token",
      );

      expect(wrapper.vm.processingNoteError).toBeNull();
      expect(wrapper.vm.loading).toBe(false);
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

  it("updates the search field using v-model", async () => {
    const searchField = wrapper.find('[data-test="v-text-field"]');
    expect(searchField.exists()).toBe(true);
    await searchField.setValue("ShareSfhare");
    expect(wrapper.vm.searches).toBe("ShareSfhare");
  });

  it("renders records with and without processing notes and types", async () => {
    await wrapper.setData({
      maintenanceRequestsProcessed: [
        {
          id: "rec-1",
          recordName: "Record A (rec-1)",
          type: "dataset",
          userName: "User A",
          userId: "u1",
          createdAt: "Jan 1, 2023",
          processingNotes: "Existing notes",
          processingNoteId: 10,
          requestID: "req-1",
        },
        {
          id: "rec-2",
          recordName: "Record B (rec-2)",
          type: null,
          userName: "User B",
          userId: "u2",
          createdAt: "Feb 1, 2023",
          processingNotes: "",
          processingNoteId: null,
          requestID: "req-2",
        },
      ],
    });

    expect(wrapper.text()).toContain("Record A");
    expect(wrapper.text()).toContain("Record B");

    expect(wrapper.text()).toContain("Existing notes");
    expect(wrapper.text()).toContain("Click to edit...");

    expect(wrapper.findAll("v-avatar-stub")).toHaveLength(1);
  });

  it("navigates to record and user pages", async () => {
    const navigateSpy = vi
      .spyOn(wrapper.vm, "navigateTo")
      .mockImplementation(() => {});
    const recordLink = wrapper.find('a[href="/rec-1"]');
    expect(recordLink.exists()).toBe(true);
    await recordLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith("rec-1");
    const userLink = wrapper.find('a[href="/users/u1"]');
    expect(userLink.exists()).toBe(true);
    await userLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith("/users/u1");
  });

  it("updates the processing notes draft through the textarea", async () => {
    const item = {
      id: "rec-1",
      recordName: "Record A (rec-1)",
      processingNotes: "Original notes",
      processingNoteId: 10,
    };

    await wrapper.setData({
      maintenanceRequestsProcessed: [item],
      processingNotesDraft: "Original notes",
    });

    const textarea = wrapper.get('[data-test="v-textarea"]');

    await textarea.setValue("Updated processing notes");

    expect(wrapper.vm.processingNotesDraft).toBe("Updated processing notes");

    expect(wrapper.vm.maintenanceRequestsProcessed[0].processingNotes).toBe(
      "Original notes",
    );
  });

  it("closes the rejection dialog when Cancel is clicked", async () => {
    wrapper.vm.rejectMaintenanceOwner("Record A", "rec-1", "User A", "req-1");

    await wrapper.vm.$nextTick();

    const dialog = wrapper.find('[data-test="v-dialog"]');

    const cancelButton = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "Cancel");

    expect(cancelButton).toBeDefined();

    await cancelButton.trigger("click");

    expect(wrapper.vm.dialogs.rejectAssignment).toBe(false);
  });

  it("closes the approval dialog when Cancel is clicked", async () => {
    wrapper.vm.assignMaintenanceOwner("Record A", "rec-1", "User A", "req-1");

    await wrapper.vm.$nextTick();

    const dialog = wrapper.find('[data-test="v-dialog"]');

    const cancelButton = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "Cancel");

    expect(cancelButton).toBeDefined();

    await cancelButton.trigger("click");

    expect(wrapper.vm.dialogs.confirmAssignment).toBe(false);
  });

  it("updates loading through the overlay v-model", async () => {
    const overlay = wrapper.findComponent({ name: "VOverlay" });
    expect(overlay.exists()).toBe(true);
    expect(overlay.props("modelValue")).toBe(false);
    overlay.vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.loading).toBe(true);
    overlay.vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.loading).toBe(false);
  });

  it("clears processing note error when alert is closed", async () => {
    await wrapper.setData({
      processingNoteError: "Unable to save notes",
    });
    const alert = wrapper
      .findAllComponents({ name: "VAlert" })
      .find(
        (component) =>
          component.props("title") === "Unable to update processing notes",
      );
    expect(alert).toBeDefined();
    alert.vm.$emit("click:close");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.processingNoteError).toBeNull();
  });

  it("submits approved status from the approval dialog OK button", async () => {
    await wrapper.setData({
      dialogs: {
        ...wrapper.vm.dialogs,
        confirmAssignment: true,
        rejectAssignment: false,
        requestId: "req-1",
        recordID: "rec-1",
        recordName: "Record A",
        userName: "User A",
        disableDelButton: false,
      },
    });
    restUpdateSpy.mockResolvedValueOnce({
      error: false,
    });
    vi.mocked(deleteProcessingNotes).mockResolvedValueOnce({
      success: true,
    });
    const dialog = wrapper
      .findAllComponents({ name: "VDialog" })
      .find((component) => component.props("modelValue") === true);
    expect(dialog).toBeDefined();
    const okButton = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "OK");
    expect(okButton).toBeDefined();
    await okButton.trigger("click");
    await flushPromises();
    expect(restUpdateSpy).toHaveBeenCalledWith(
      "req-1",
      "approved",
      "test-token",
    );
    expect(wrapper.vm.dialogs.confirmAssignment).toBe(false);
  });

  it("submits rejected status from the rejection dialog OK button", async () => {
    await wrapper.setData({
      dialogs: {
        ...wrapper.vm.dialogs,
        confirmAssignment: false,
        rejectAssignment: true,
        requestId: "req-1",
        recordID: "rec-1",
        recordName: "Record A",
        userName: "User A",
        disableDelButton: false,
      },
    });
    restUpdateSpy.mockResolvedValueOnce({
      error: false,
    });
    vi.mocked(deleteProcessingNotes).mockResolvedValueOnce({
      success: true,
    });
    const dialog = wrapper
      .findAllComponents({ name: "VDialog" })
      .find((component) => component.props("modelValue") === true);
    expect(dialog).toBeDefined();
    const okButton = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "OK");
    expect(okButton).toBeDefined();
    await okButton.trigger("click");
    await flushPromises();
    expect(restUpdateSpy).toHaveBeenCalledWith(
      "req-1",
      "rejected",
      "test-token",
    );
    expect(wrapper.vm.dialogs.rejectAssignment).toBe(false);
  });
});
