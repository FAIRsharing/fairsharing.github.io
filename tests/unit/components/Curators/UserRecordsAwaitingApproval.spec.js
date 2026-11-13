import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";
import { defineComponent, h } from "vue";
import UserRecordsAwaitingApproval from "@/components/Curators/UserRecordsAwaitingApproval.vue";
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
  VOverlayStub,
  VSwitchStub,
  VTextareaStub,
  VTextFieldStub,
} from "../../../stubs/index.js";
import {
  deleteProcessingNotes,
  saveProcessingNotes,
} from "@/utils/curatorUtils.js";

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

vi.mock("@/utils/curatorUtils", () => ({
  saveProcessingNotes: vi.fn(),
  deleteProcessingNotes: vi.fn(),
}));

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
          VBtn: VBtnStub,
          VDataTable: VDataTableStub,
          VDialog: VDialogStub,
          VMenu: VMenuStub,
          VTextarea: VTextareaStub,
          VTextField: VTextFieldStub,
          VOverlay: VOverlayStub,
          VSwitch: VSwitchStub,
        },
      },
      props: {
        headerItems: header,
      },
    });
  });

  afterAll(() => {
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
    restStub.returns({ data: { error: { response: "Im an error" } } });
    await wrapper.vm.assignCurator(11, 1, "Michael Smith");
    expect(wrapper.vm.error.recordID).toBe(11);

    await wrapper.vm.assignCurator(11, 1, "none");
  });

  it("can approve a record", async () => {
    //Correct approval
    wrapper.vm.dialogs.recordID = 100;
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
    wrapper.vm.dialogs.recordID = 101;
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

    wrapper.vm.dialogs.recordID = 102;
    restStub.returns({ data: { error: { response: { data: "error" } } } });
    await wrapper.vm.confirmApproval();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(1);
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);
  });

  it("can delete a record", async () => {
    //There is an error in the Client query
    wrapper.vm.dialogs.recordID = 102;
    restStub.returns({ data: { error: { response: { data: "error" } } } });
    await wrapper.vm.confirmDelete();
    expect(wrapper.vm.approvalRequiredProcessed.length).toBe(1);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
    expect(wrapper.vm.approvalRequiredProcessed[0].id).toBe(11);
    expect(wrapper.vm.error.recordID).toBe(102);

    //Correct deleted
    wrapper.vm.dialogs.recordID = 102;
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
      const item = wrapper.vm.approvalRequiredProcessed[0];

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
        123,
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

      expect(deleteProcessingNotes).toHaveBeenCalledWith(item, 123);

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
      expect(deleteProcessingNotes).toHaveBeenCalledWith(item, 123);
      expect(wrapper.vm.processingNoteError).toBe(
        "Unable to delete processing notes",
      );
      // The menu should remain open when deletion fails.
      expect(isActive.value).toBe(true);
      // Loading must reset even after an API failure.
      expect(wrapper.vm.loading).toBe(false);
    });

    it("deletes processing notes when Delete is clicked", async () => {
      const item = wrapper.vm.approvalRequiredProcessed[0];

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
        123,
      );

      expect(wrapper.vm.processingNoteError).toBeNull();
      expect(wrapper.vm.loading).toBe(false);
    });
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

  it("navigates to record and user pages", async () => {
    const record = {
      id: "rec-1",
      recordName: "Test Record (rec-1)",
      lastEditor: "Test Editor",
      idLastEditor: "u1",
      creator: "Test Creator",
      idCreator: "u2",
      processingNotes: "",
      processingNoteId: null,
    };
    await wrapper.setData({
      recordType: { name: "test" },
      approvalRequiredProcessed: [record],
    });
    const navigateSpy = vi
      .spyOn(wrapper.vm, "navigateTo")
      .mockImplementation(() => {});
    // Record navigation
    const recordLink = wrapper.get('a[href="/rec-1"]');
    await recordLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith("rec-1");
    // Last editor navigation
    const editorLink = wrapper.get('a[href="/users/u1"]');
    await editorLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith("/users/u1");
    // Creator navigation
    const creatorLink = wrapper.get('a[href="/users/u2"]');
    await creatorLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith("/users/u2");
  });

  it("loads processing notes when the activator is clicked", async () => {
    const record = {
      id: 99,
      recordName: "Test Record (99)",
      processingNotes: "Existing notes",
      processingNoteId: 10,
      lastEditor: "unknown",
      creator: "unknown",
    };
    await wrapper.setData({
      approvalRequiredProcessed: [record],
      recordType: { name: "test" },
    });
    const activator = wrapper.get('span[style*="cursor: pointer"]');
    await activator.trigger("click");
    expect(wrapper.vm.processingNotesDraft).toBe("Existing notes");
    await wrapper.setData({
      approvalRequiredProcessed: [
        {
          ...record,
          processingNotes: "",
        },
      ],
    });
    await wrapper.get('span[style*="cursor: pointer"]').trigger("click");
    expect(wrapper.vm.processingNotesDraft).toBe("");
  });

  it("closes the processing notes editor when Close is clicked", async () => {
    await wrapper.setData({
      approvalRequiredProcessed: [
        {
          id: 99,
          recordName: "Test Record (99)",
          processingNotes: "Existing notes",
          processingNoteId: 10,
        },
      ],
      recordType: { name: "test" },
    });
    const closeButton = wrapper.get(
      '[aria-label="Close processing notes editor"]',
    );
    expect(closeButton.exists()).toBe(true);
    await closeButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(closeButton.exists()).toBe(true);
  });

  it("opens delete dialog when trash icon is clicked", async () => {
    await wrapper.setData({
      approvalRequiredProcessed: [
        {
          id: 99,
          recordName: "Test Record (99)",
          processingNotes: "",
          processingNoteId: null,
        },
      ],
      recordType: { name: "test" },
    });
    const deleteSpy = vi.spyOn(wrapper.vm, "deleteRecordMenu");
    const trashIcon = wrapper
      .findAll("v-icon-stub, [data-test='v-icon'], span")
      .find((element) => element.text().trim() === "fas fa-trash");
    expect(trashIcon).toBeDefined();
    await trashIcon.trigger("click");
    expect(deleteSpy).toHaveBeenCalledWith("Test Record (99)", 99);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(true);
    expect(wrapper.vm.dialogs.recordID).toBe(99);
  });

  it("updates approval dialog and switch v-model values", async () => {
    const dialogs = wrapper.findAllComponents({
      name: "VDialog",
    });
    expect(dialogs.length).toBeGreaterThanOrEqual(2);
    dialogs[0].vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dialogs.approveChanges).toBe(true);
    const switches = wrapper.findAllComponents({
      name: "VSwitch",
    });
    expect(switches).toHaveLength(2);
    switches[0].vm.$emit("update:modelValue", true);
    switches[1].vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dialogs.createReview).toBe(true);
    expect(wrapper.vm.dialogs.recordHidden).toBe(true);
  });

  it("updates delete record dialog v-model", async () => {
    const dialogs = wrapper.findAllComponents({
      name: "VDialog",
    });
    expect(dialogs.length).toBeGreaterThanOrEqual(2);
    dialogs[1].vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dialogs.deleteRecord).toBe(true);
    dialogs[1].vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
  });

  it("covers approval dialog Cancel and OK template click handlers", async () => {
    await wrapper.setData({
      dialogs: {
        ...wrapper.vm.dialogs,
        approveChanges: true,
        deleteRecord: false,
        disableButton: false,
        recordID: 99,
        recordName: "Test Record (99)",
      },
    });
    const dialog = wrapper.findAllComponents({ name: "VDialog" })[0];
    expect(dialog.exists()).toBe(true);
    const buttons = dialog.findAllComponents({ name: "VBtn" });
    const cancel = buttons.find((button) => button.text().trim() === "Cancel");
    const ok = buttons.find((button) => button.text().trim() === "OK");
    expect(cancel).toBeDefined();
    expect(ok).toBeDefined();
    const closeSpy = vi.spyOn(wrapper.vm, "closeApproveChangesMenu");
    await cancel.trigger("click");
    expect(closeSpy).toHaveBeenCalled();
    expect(wrapper.vm.dialogs.approveChanges).toBe(false);
    await wrapper.setData({
      dialogs: {
        ...wrapper.vm.dialogs,
        approveChanges: true,
        disableButton: false,
      },
    });
    const confirmSpy = vi
      .spyOn(wrapper.vm, "confirmApproval")
      .mockResolvedValueOnce(undefined);
    const okAgain = wrapper
      .findAllComponents({ name: "VDialog" })[0]
      .findAllComponents({ name: "VBtn" })
      .find((button) => button.text().trim() === "OK");
    expect(okAgain).toBeDefined();
    await okAgain.trigger("click");
    expect(confirmSpy).toHaveBeenCalledTimes(1);
    confirmSpy.mockRestore();
    closeSpy.mockRestore();
  });

  it("covers delete dialog Cancel and OK template click handlers", async () => {
    await wrapper.setData({
      dialogs: {
        ...wrapper.vm.dialogs,
        approveChanges: false,
        deleteRecord: true,
        disableButton: false,
        disableDelButton: false,
        recordID: 99,
        recordName: "Test Record (99)",
      },
    });
    const dialog = wrapper.findAllComponents({ name: "VDialog" })[1];
    expect(dialog.exists()).toBe(true);
    const buttons = dialog.findAllComponents({ name: "VBtn" });
    const cancel = buttons.find((button) => button.text().trim() === "Cancel");
    const ok = buttons.find((button) => button.text().trim() === "OK");
    expect(cancel).toBeDefined();
    expect(ok).toBeDefined();
    const closeSpy = vi.spyOn(wrapper.vm, "closeDeleteMenu");
    await cancel.trigger("click");
    expect(closeSpy).toHaveBeenCalled();
    expect(wrapper.vm.dialogs.deleteRecord).toBe(true);
    await wrapper.setData({
      dialogs: {
        ...wrapper.vm.dialogs,
        deleteRecord: true,
        disableButton: false,
        disableDelButton: false,
      },
    });
    const confirmSpy = vi
      .spyOn(wrapper.vm, "confirmDelete")
      .mockResolvedValueOnce(undefined);
    const okAgain = wrapper
      .findAllComponents({ name: "VDialog" })[1]
      .findAllComponents({ name: "VBtn" })
      .find((button) => button.text().trim() === "OK");
    expect(okAgain).toBeDefined();
    await okAgain.trigger("click");
    expect(confirmSpy).toHaveBeenCalledTimes(1);
    confirmSpy.mockRestore();
    closeSpy.mockRestore();
  });
});
