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
  VBtnStub,
  VDataTableStub,
  VDialogStub,
  VMenuStub,
  VTextareaStub,
  VTextFieldStub,
  VTooltipStub,
} from "../../../stubs/index.js";
import { defineComponent, h } from "vue";
import {
  deleteProcessingNotes,
  saveProcessingNotes,
} from "@/utils/curatorUtils";
import { VIconStub } from "../../../stubs/VIconStub.js";

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

vi.mock("@/utils/curatorUtils", () => ({
  saveProcessingNotes: vi.fn(),
  deleteProcessingNotes: vi.fn(),
}));

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
const editDialogStub = defineComponent({
  name: "VEditDialog",
  setup(_, { slots }) {
    // Renders whatever is placed inside the <v-edit-dialog> tags
    return () => h("div", slots.default?.());
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
        stubs: {
          "v-edit-dialog": editDialogStub,
          VEditDialog: editDialogStub,
          VBtn: VBtnStub,
          VDataTable: VDataTableStub,
          VDialog: VDialogStub,
          VMenu: VMenuStub,
          VTextarea: VTextareaStub,
          VTextField: VTextFieldStub,
          VIcon: VIconStub,
          VTooltip: VTooltipStub,
        },
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

    expect(wrapper.vm.prepareApprovalRequired).toHaveBeenCalled;
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

  it("updates the search field using v-model", async () => {
    const searchField = wrapper.find('[data-test="v-text-field"]');
    expect(searchField.exists()).toBe(true);
    await searchField.setValue("ShareSfhare");
    expect(wrapper.vm.searches).toBe("ShareSfhare");
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

      const saveButton = wrapper
        .findAll("button")
        .find((button) => button.text().trim() === "Save");
      expect(saveButton).toBeDefined();
      await saveButton.trigger("click");

      // Success scenario
      vi.mocked(saveProcessingNotes).mockResolvedValueOnce({
        success: true,
      });

      await wrapper.vm.saveProcessingNotesAndClose(item, isActive);

      expect(saveProcessingNotes).toHaveBeenCalledWith(
        item,
        "notes of text",
        123,
      );

      expect(isActive.value).toBe(false);
      expect(wrapper.vm.processingNoteError).toBeNull();

      // Failure scenario
      isActive.value = true;

      vi.mocked(saveProcessingNotes).mockResolvedValueOnce({
        success: false,
        error: "Unable to save notes",
      });

      await wrapper.vm.saveProcessingNotesAndClose(item, isActive);

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
      expect(deleteProcessingNotes).toHaveBeenCalledWith(item, 123);
      expect(isActive.value).toBe(false);
      expect(wrapper.vm.processingNoteError).toBeNull();
      expect(wrapper.vm.loading).toBe(false);
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
      expect(deleteProcessingNotes).toHaveBeenCalledWith(item, 123);
      expect(wrapper.vm.processingNoteError).toBe(
        "Unable to delete processing notes",
      );
      expect(isActive.value).toBe(true);
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

    it("renders and clicks Delete when processingNoteId exists", async () => {
      const item = {
        id: 99,
        recordName: "Test Record (99)",
        processingNotes: "Existing notes",
        processingNoteId: 55,
      };
      vi.mocked(deleteProcessingNotes).mockResolvedValueOnce({
        success: true,
      });

      await wrapper.setData({
        approvalRequiredProcessed: [item],
      });
      await wrapper.vm.$nextTick();
      const deleteButton = wrapper
        .findAll("button")
        .find((button) => button.text().trim() === "Delete");
      expect(deleteButton).toBeDefined();

      await deleteButton.trigger("click");
      await wrapper.vm.$nextTick();
      expect(deleteProcessingNotes).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 99,
          processingNoteId: 55,
        }),
        123,
      );
      expect(wrapper.vm.processingNoteError).toBeNull();
      expect(wrapper.vm.loading).toBe(false);
    });
  });

  it("loads existing processing notes when editor is clicked", async () => {
    const item = {
      id: 99,
      recordName: "Test Record (99)",
      processingNotes: `Existing processing notes`,
      processingNoteId: 55,
    };

    await wrapper.setData({
      approvalRequiredProcessed: [item],
      processingNotesDraft: "",
    });

    const activator = wrapper
      .findAll("span")
      .find((element) => element.text().includes("Existing processing notes"));

    expect(activator).toBeDefined();

    await activator.trigger("click");

    expect(wrapper.vm.processingNotesDraft).toBe("Existing processing notes");
  });

  it("closes processing notes editor when close button is clicked", async () => {
    const item = {
      id: 99,
      recordName: "Test Record (99)",
      processingNotes: "Existing notes",
      processingNoteId: 55,
    };

    await wrapper.setData({
      approvalRequiredProcessed: [item],
    });

    const closeButton = wrapper.find(
      '[aria-label="Close processing notes editor"]',
    );

    expect(closeButton.exists()).toBe(true);

    await closeButton.trigger("click");

    // The click changes the VMenu slot's isActive.value.
    // Assert the menu's state using your VMenuStub.
  });

  it("clears processing note error when alert is closed", async () => {
    await wrapper.setData({
      processingNoteError: "Unable to save processing notes",
    });

    const alert = wrapper.findComponent({ name: "VAlert" });

    expect(alert.exists()).toBe(true);

    alert.vm.$emit("click:close");

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.processingNoteError).toBeNull();
  });

  it("navigates to record when record name is clicked", async () => {
    const item = {
      id: 99,
      recordName: "Test Record (99)",
      processingNotes: "",
      processingNoteId: null,
      lastEditor: "unknown",
      creator: "unknown",
    };

    await wrapper.setData({
      approvalRequiredProcessed: [item],
    });
    const recordLink = wrapper.find('a[href="/99"]');
    expect(recordLink.exists()).toBe(true);
    const navigateSpy = vi.spyOn(wrapper.vm, "navigateTo");
    await recordLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith(99);
  });

  it("does not display Delete button when processingNoteId is null", async () => {
    const item = {
      id: 99,
      recordName: "Test Record (99)",
      processingNotes: "",
      processingNoteId: null,
    };
    await wrapper.setData({
      approvalRequiredProcessed: [item],
    });
    const deleteButton = wrapper
      .findAll("button")
      .find((button) => button.text().trim() === "Delete");
    expect(deleteButton).toBeUndefined();
  });

  it("covers approval dialog Cancel and OK clicks", async () => {
    wrapper.vm.approveChangesMenu("Test Record (99)", 99, false);
    await wrapper.vm.$nextTick();

    const dialog = wrapper.findAllComponents({ name: "VDialog" })[0];

    expect(dialog.exists()).toBe(true);
    expect(dialog.props("modelValue")).toBe(true);

    const closeSpy = vi.spyOn(wrapper.vm, "closeApproveChangesMenu");
    const confirmSpy = vi.spyOn(wrapper.vm, "confirmApproval");

    const cancelButton = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "Cancel");

    expect(cancelButton).toBeDefined();

    await cancelButton.trigger("click");
    await wrapper.vm.$nextTick();

    expect(closeSpy).toHaveBeenCalled();
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);

    wrapper.vm.approveChangesMenu("Test Record (99)", 99, false);
    await wrapper.vm.$nextTick();

    const okButton = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "OK");

    expect(okButton).toBeDefined();

    await okButton.trigger("click");
    await wrapper.vm.$nextTick();

    expect(confirmSpy).toHaveBeenCalled();

    expect(wrapper.vm.dialogs.approveChanges).toBe(false);
  });

  it("covers approval dialog switches", async () => {
    wrapper.vm.approveChangesMenu("Test Record (99)", 99, false);

    await wrapper.vm.$nextTick();

    const switches = wrapper.findAllComponents({ name: "VSwitch" });

    expect(switches).toHaveLength(2);

    switches[0].vm.$emit("update:modelValue", true);
    switches[1].vm.$emit("update:modelValue", true);

    await wrapper.vm.$nextTick();

    expect(wrapper.vm.dialogs.createReview).toBe(true);
    expect(wrapper.vm.dialogs.recordHidden).toBe(true);
  });

  it("covers delete dialog Cancel and OK clicks", async () => {
    wrapper.vm.deleteRecordMenu("Test Record (99)", 99);

    await wrapper.vm.$nextTick();

    const dialog = wrapper.findAllComponents({ name: "VDialog" })[1];

    expect(dialog.exists()).toBe(true);
    expect(dialog.props("modelValue")).toBe(true);

    const cancelButton = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "Cancel");

    expect(cancelButton).toBeDefined();

    await cancelButton.trigger("click");

    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);

    wrapper.vm.deleteRecordMenu("Test Record (99)", 99);

    await wrapper.vm.$nextTick();

    await wrapper.setData({
      dialogs: {
        ...wrapper.vm.dialogs,
        disableDelButton: false,
        disableButton: false,
      },
    });

    const deleteSpy = vi
      .spyOn(Client.prototype, "deleteRecord")
      .mockResolvedValue({ error: false });

    const okButton = dialog
      .findAll("button")
      .find((button) => button.text().trim() === "OK");

    expect(okButton).toBeDefined();

    await okButton.trigger("click");

    expect(deleteSpy).toHaveBeenCalledWith(99, 123);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
  });

  it("covers approval and delete dialog v-model updates", async () => {
    const dialogs = wrapper.findAllComponents({ name: "VDialog" });

    expect(dialogs).toHaveLength(2);

    dialogs[0].vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.dialogs.approveChanges).toBe(true);

    dialogs[0].vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.dialogs.approveChanges).toBe(false);

    dialogs[1].vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.dialogs.deleteRecord).toBe(true);

    dialogs[1].vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
  });

  it("covers Approve and Delete record icon clicks", async () => {
    const item = {
      id: 99,
      recordName: "Test Record (99)",
      rawhidden: true,
      lastEditor: "unknown",
      creator: "unknown",
      processingNotes: "",
      processingNoteId: null,
    };
    await wrapper.setData({
      approvalRequiredProcessed: [item],
    });
    const approveSpy = vi.spyOn(wrapper.vm, "approveChangesMenu");
    const deleteSpy = vi.spyOn(wrapper.vm, "deleteRecordMenu");
    const icons = wrapper.findAll('[data-test="v-icon"]');
    const approveIcon = icons.find((icon) =>
      icon.text().includes("fa-check-circle"),
    );
    const deleteIcon = icons.find((icon) => icon.text().includes("fa-trash"));
    expect(approveIcon).toBeDefined();
    expect(deleteIcon).toBeDefined();
    await approveIcon.trigger("click");
    expect(approveSpy).toHaveBeenCalledWith("Test Record (99)", 99, true);
    expect(wrapper.vm.dialogs.approveChanges).toBe(true);
    await deleteIcon.trigger("click");
    expect(deleteSpy).toHaveBeenCalledWith("Test Record (99)", 99);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(true);
  });

  it("covers Edit record navigation click", async () => {
    const item = {
      id: 99,
      recordName: "Test Record (99)",
      lastEditor: "unknown",
      creator: "unknown",
      processingNotes: "",
      processingNoteId: null,
    };
    await wrapper.setData({
      approvalRequiredProcessed: [item],
    });
    await wrapper.vm.$nextTick();
    const navigateSpy = vi.spyOn(wrapper.vm, "navigateTo");
    const editLink = wrapper.get('a[href="/99/edit"]');
    expect(editLink.exists()).toBe(true);
    await editLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith("/99/edit");
  });

  it("covers Last Editor navigation click", async () => {
    const item = {
      id: 99,
      recordName: "Test Record (99)",
      lastEditor: "Test Editor",
      idLastEditor: 789,
      creator: "unknown",
      processingNotes: "",
      processingNoteId: null,
    };
    await wrapper.setData({
      approvalRequiredProcessed: [item],
    });
    const navigateSpy = vi.spyOn(wrapper.vm, "navigateTo");
    const editorLink = wrapper.get('a[href="/users/789"]');
    await editorLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith("/users/789");
  });
});
