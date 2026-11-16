import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import IncompleteRecords from "@/components/Curators/IncompleteRecords.vue";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import usersStore from "@/store/users";

import dataDashboard from "../../../fixtures/curationDashboardData.json";
import { VTextFieldStub } from "../../../stubs/VTextFieldStub.js";
import { VDialogStub } from "../../../stubs/VDialogStub.js";
import { VDataTableStub } from "../../../stubs/VDataTableStub.js";

let curationDataSummary = dataDashboard.curationSummary;
let header = [
  {
    title: "Record name (id)",
    value: "recordNameID",
  },
  {
    title: "Date created",
    value: "createdAt",
  },
  {
    title: "Missing required",
    value: "required",
  },
  {
    title: "Missing recommended",
    value: "recommended",
  },
  {
    title: "Missing optional",
    value: "optional",
  },
];
usersStore.state.user = function () {
  return {
    isLoggedIn: true,
    credentials: { token: 123, username: 123 },
  };
};

const $store = new Vuex.Store({
  modules: {
    users: usersStore,
  },
});

const $router = { push: vi.fn() };

describe("Curator -> IncompleteRecords.vue", () => {
  let restStub, wrapper, graphStub;
  beforeEach(() => {
    graphStub = sinon
      .stub(GraphClient.prototype, "executeQuery")
      .returns(curationDataSummary);
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: {
        error: false,
      },
    });
    wrapper = shallowMount(IncompleteRecords, {
      global: {
        plugins: [$store],
        mocks: { $router },
        stubs: {
          VTextField: VTextFieldStub,
          VDialog: VDialogStub,
          VDataTable: VDataTableStub,
          VCol: {
            template: "<div><slot /></div>",
          },
          VLayout: {
            template: "<div><slot /></div>",
          },
          VCard: {
            template: "<div><slot /></div>",
          },
          VCardTitle: {
            template: "<div><slot /></div>",
          },
          VCardActions: {
            template: "<div><slot /></div>",
          },
          VBtn: {
            props: ["disabled"],
            template: `
          <button :disabled="disabled" v-bind="$attrs">
            <slot />
          </button>
        `,
          },
        },
      },
      props: {
        headerItems: header,
      },
    });
  });
  afterEach(() => {
    wrapper?.unmount();
    graphStub.restore();
    restStub.restore();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("IncompleteRecords");
    expect(wrapper.vm.prepareIncompleteRecords).toHaveBeenCalled;
    expect(wrapper.vm.incompleteRecords.length).toBe(2);
    let auxString = "1425-01-01";
    expect(wrapper.vm.incompleteRecords[1].createdAt).toBe(auxString);
  });

  it("can check for incompleteRecords", () => {
    let output = {
      createdAt: "1425-01-01",
      id: "2669f95",
      recordNameID: "ShareSfhare (2669f95)",
      type: undefined,
      recommended: "data_sharing",
      required: "name",
      optional: "",
    };
    expect(wrapper.vm.incompleteRecords[0]).toStrictEqual(output);
  });

  it("can check for confirmDelete method when deleteRecord throws error", async () => {
    vi.spyOn(Client.prototype, "deleteRecord").mockResolvedValue({
      error: true,
    });

    await wrapper.setData({
      dialogs: {
        recordID: 55,
        deleteRecord: true,
      },
      error: {},
    });

    await wrapper.vm.confirmDelete();
    expect(wrapper.vm.error.general).toBe("error deleting record");
    expect(wrapper.vm.error.recordID).toBe(55);
  });

  it("can check for confirmDelete method when deleteRecord does not have error", async () => {
    const deleteSpy = vi
      .spyOn(Client.prototype, "deleteRecord")
      .mockResolvedValue({
        error: false,
      });

    await wrapper.setData({
      incompleteRecords: [
        {
          id: 10,
          recordNameID: "Keep Me (10)",
          type: null,
          createdAt: "2026-10-20",
          required: "name",
          recommended: "data_sharing",
          optional: "",
        },

        {
          id: 55,
          recordNameID: "Delete Me (55)",
          type: null,
          createdAt: "2026-10-20",
          required: "name",
          recommended: "",
          optional: "",
        },

        {
          id: 90,
          recordNameID: "Keep Me Too (90)",
          type: null,
          createdAt: "2026-10-20",
          required: "name",
          recommended: "",
          optional: "",
        },
      ],
      dialogs: {
        ...wrapper.vm.dialogs,
        recordID: 55,
        deleteRecord: true,
        disableButton: false,
        disableDelButton: false,
      },
    });

    // Find OK button
    const okButton = wrapper
      .findAll("button")
      .find((button) => button.text().trim() === "OK");

    expect(okButton).toBeDefined();

    // Click OK
    await okButton.trigger("click");

    // Wait for asynchronous deletion
    await vi.waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith(55, 123);
    });

    await vi.waitFor(() => {
      expect(wrapper.vm.incompleteRecords).toHaveLength(2);
    });

    expect(
      wrapper.vm.incompleteRecords.find((record) => record.id === 55),
    ).toBeUndefined();

    expect(wrapper.vm.incompleteRecords[0].id).toBe(10);
    expect(wrapper.vm.incompleteRecords[1].id).toBe(90);

    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);

    deleteSpy.mockRestore();
  });

  it("can check for deleteRecordMenu method", async () => {
    vi.useFakeTimers();
    const record = {
      id: 101,
      recordNameID: "Test Record (101)",
      type: null,
      createdAt: "2026-10-20",
      required: "name",
      recommended: "data_sharing",
      optional: "",
    };

    await wrapper.setData({
      incompleteRecords: [record],
    });

    // Find the trash icon inside the table
    const deleteIcon = wrapper.find("tbody v-icon-stub");
    expect(deleteIcon.exists()).toBe(true);
    // Click the trash icon instead of calling the method directly
    await deleteIcon.trigger("click");
    expect(wrapper.vm.dialogs.disableButton).toBe(false);
    expect(wrapper.vm.dialogs.disableDelButton).toBe(true);
    expect(wrapper.vm.dialogs.recordID).toBe(101);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(true);
    // Advance the countdown
    vi.advanceTimersByTime(5000);
    expect(wrapper.vm.dialogs.disableDelButton).toBe(false);
    vi.useRealTimers();
  });

  it("can check for closeDeleteMenu method", async () => {
    // Open dialog
    await wrapper.setData({
      dialogs: {
        ...wrapper.vm.dialogs,
        recordID: 55,
        deleteRecord: true,
        disableButton: false,
        disableDelButton: false,
      },
    });

    expect(wrapper.find('[data-test="v-dialog"]').exists()).toBe(true);
    // Find Cancel button
    const cancelButton = wrapper
      .findAll("button")
      .find((button) => button.text().trim() === "Cancel");
    expect(cancelButton).toBeDefined();
    // Trigger actual Vue click handler
    await cancelButton.trigger("click");
    expect(wrapper.vm.dialogs.disableButton).toBe(true);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
  });

  it("updates dialog visibility through v-model", async () => {
    await wrapper.setData({
      dialogs: {
        ...wrapper.vm.dialogs,
        deleteRecord: true,
      },
    });

    const dialog = wrapper.findComponent(VDialogStub);
    expect(dialog.exists()).toBe(true);
    expect(dialog.props("modelValue")).toBe(true);
    dialog.vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
  });

  it("updates the search field using v-model", async () => {
    const searchField = wrapper.find('[data-test="v-text-field"]');
    expect(searchField.exists()).toBe(true);
    await searchField.setValue("ShareSfhare");
    expect(wrapper.vm.searches).toBe("ShareSfhare");
  });

  it("renders an avatar only for records with a type", async () => {
    await wrapper.setData({
      incompleteRecords: [
        {
          id: 101,
          recordNameID: "Database Record (101)",
          type: "database",
          createdAt: "2026-10-20",
          required: "name",
          recommended: "data_sharing",
          optional: "",
        },
        {
          id: 102,
          recordNameID: "Record Without Type (102)",
          type: null,
          createdAt: "2026-10-21",
          required: "name",
          recommended: "",
          optional: "",
        },
      ],
    });

    await wrapper.vm.$nextTick();

    // Both records should appear.
    expect(wrapper.text()).toContain("Database Record (101)");
    expect(wrapper.text()).toContain("Record Without Type (102)");

    // Only the first record should have an avatar.
    expect(wrapper.findAll("v-avatar-stub")).toHaveLength(1);

    // The Icon component should be rendered inside the avatar.
    expect(wrapper.findComponent({ name: "Icon" }).exists()).toBe(true);
  });

  it("navigates to the record when record name is clicked", async () => {
    const record = wrapper.vm.incompleteRecords[0];
    const navigateSpy = vi.spyOn(wrapper.vm, "navigateTo");
    const recordLink = wrapper.find(`a[href="/${record.id}"]`);
    expect(recordLink.exists()).toBe(true);
    await recordLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith(record.id);
  });
});
