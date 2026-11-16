import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import SystemMessages from "@/components/Curators/SystemMessages.vue";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import usersStore from "@/store/users";

import dataDashboard from "../../../fixtures/curationDashboardData.json";
import {
  VBtnStub,
  VDataTableStub,
  VDialogStub,
  VMenuStub,
  VTextareaStub,
} from "../../../stubs/index.js";

let curationDataSummary = dataDashboard.curationSummary;

let header = [
  {
    title: "ID",
    value: "id",
  },
  {
    title: "Text",
    value: "message",
  },
  {
    title: "Created at",
    value: "created_at",
  },
  {
    title: "Updated at",
    value: "updated_at",
  },
  {
    title: "Delete",
    value: "actions",
    sortable: false,
    width: 130,
  },
];
usersStore.state.user = function () {
  return {
    isLoggedIn: true,
    role: "super_curator",
    credentials: { token: 123, username: 123 },
  };
};

const $store = new Vuex.Store({
  modules: {
    users: usersStore,
    // Added a dummy messages module to swallow the component's lifecycle dispatch call
    messages: {
      namespaced: true,
      actions: {
        setMessages: vi.fn(),
      },
    },
  },
});

const $router = { push: vi.fn() };

describe("Curator -> SystemMessages.vue", () => {
  let restStub, wrapper, graphStub;
  beforeEach(() => {
    global.store = $store;

    graphStub = sinon
      .stub(GraphClient.prototype, "executeQuery")
      .returns(curationDataSummary);
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: {
        error: false,
      },
    });
    wrapper = shallowMount(SystemMessages, {
      global: {
        plugins: [$store],
        mocks: { $router },
        stubs: {
          "v-edit-dialog": true,
          VEditDialog: true,
          VBtn: VBtnStub,
          VDataTable: VDataTableStub,
          VDialog: VDialogStub,
          VMenu: VMenuStub,
          VTextarea: VTextareaStub,
        },
      },
      props: {
        headerItems: header,
      },
    });
  });
  afterEach(() => {
    wrapper?.unmount();
    restStub.restore();
    graphStub.restore();
    vi.restoreAllMocks();
  });
  afterAll(() => {
    delete global.store;
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("SystemMessages");
    expect(wrapper.vm.prepareSystemMessages).toBeDefined();
  });

  describe("Add Message", () => {
    it("opens the add message dialog when Add message is clicked", async () => {
      await flushPromises();
      const addButton = wrapper
        .findAll("button")
        .find((button) => button.text().includes("Add message"));
      expect(addButton).toBeDefined();
      await addButton.trigger("click");
      expect(wrapper.vm.dialogs.addMessage).toBe(true);
    });

    it("can addMessage method fails", async () => {
      restStub.restore();
      restStub = sinon.stub(Client.prototype, "executeQuery").returns({
        data: { error: "error" },
      });
      await wrapper.vm.addMessage();
      expect(wrapper.vm.error.general).toBe("error");
      expect(wrapper.vm.dialogs.addMessage).toBe(false);
      expect(wrapper.vm.dialogs.newMessage).toBe(null);
    });

    it("can check showAddMessage method", async () => {
      const createSpy = vi
        .spyOn(Client.prototype, "createMessage")
        .mockResolvedValue({
          id: 55,
          message: "New system notice",
          created_at: "2026-10-20T00:00:00Z",
          updated_at: "2026-10-20T00:00:00Z",
        });
      wrapper.vm.showAddMessage();
      await wrapper.setData({
        dialogs: {
          ...wrapper.vm.dialogs,
          newMessage: "New system notice",
        },
      });

      const dialog = wrapper
        .findAll('[data-test="v-dialog"]')
        .find((element) => element.text().includes("Add new message"));
      expect(dialog).toBeDefined();
      const okButton = dialog
        .findAll("button")
        .find((button) => button.text().trim() === "OK");
      expect(okButton).toBeDefined();
      expect(okButton.attributes("disabled")).toBeUndefined();
      await okButton.trigger("click");
      await flushPromises();
      expect(createSpy).toHaveBeenCalledWith(
        { message: "New system notice" },
        123,
      );
      expect(wrapper.vm.dialogs.addMessage).toBe(false);
      expect(wrapper.vm.dialogs.newMessage).toBeNull();
      expect(
        wrapper.vm.systemMessages.some((message) => message.id === 55),
      ).toBe(true);
    });

    it("can check closeAddMessageMenu method", async () => {
      wrapper.vm.showAddMessage();
      await wrapper.vm.$nextTick();
      const dialog = wrapper
        .findAll('[data-test="v-dialog"]')
        .find((element) => element.text().includes("Add new message"));
      expect(dialog).toBeDefined();
      const cancelButton = dialog
        .findAll("button")
        .find((button) => button.text().trim() === "Cancel");
      expect(cancelButton).toBeDefined();
      await cancelButton.trigger("click");
      expect(wrapper.vm.dialogs.addMessage).toBe(false);
    });
  });
  describe("Delete Message", () => {
    it("can check deleteMessage method", async () => {
      const deleteSpy = vi
        .spyOn(Client.prototype, "deleteMessage")
        .mockResolvedValue({
          error: false,
        });
      await wrapper.setData({
        systemMessages: [
          {
            id: 42,
            message: "System notice",
            created_at: "Oct 1, 2026",
            updated_at: "Oct 2, 2026",
          },
        ],
      });

      wrapper.vm.deleteMessage(42);
      await wrapper.vm.$nextTick();
      const dialog = wrapper
        .findAll('[data-test="v-dialog"]')
        .find((element) => element.text().includes("DELETE"));
      expect(dialog).toBeDefined();

      const okButton = dialog
        .findAll("button")
        .find((button) => button.text().trim() === "OK");
      expect(okButton).toBeDefined();
      await okButton.trigger("click");
      await flushPromises();
      expect(deleteSpy).toHaveBeenCalledWith(42, 123);
      expect(
        wrapper.vm.systemMessages.some((message) => message.id === 42),
      ).toBe(false);
      expect(wrapper.vm.dialogs.deleteMessage).toBe(false);
      expect(wrapper.vm.dialogs.messageId).toBeNull();
    });

    it("can confirmDeleteMessage method fails", async () => {
      restStub.restore();
      restStub = sinon.stub(Client.prototype, "executeQuery").returns({
        data: { error: "error" },
      });
      await wrapper.vm.confirmDeleteMessage();
      expect(wrapper.vm.error.general).toBe("error");
      expect(wrapper.vm.dialogs.deleteMessage).toBe(false);
      expect(wrapper.vm.dialogs.messageId).toBe(null);
    });

    it("can check closeDeleteMessageMenu method", async () => {
      wrapper.vm.deleteMessage(42);
      await wrapper.vm.$nextTick();
      const dialog = wrapper
        .findAll('[data-test="v-dialog"]')
        .find((element) => element.text().includes("DELETE"));
      expect(dialog).toBeDefined();
      const cancelButton = dialog
        .findAll("button")
        .find((button) => button.text().trim() === "Cancel");
      expect(cancelButton).toBeDefined();
      await cancelButton.trigger("click");
      expect(wrapper.vm.dialogs.deleteMessage).toBe(false);
      expect(wrapper.vm.dialogs.messageId).toBeNull();
    });
  });

  describe("saveEdited Message", () => {
    it("can check saveEditedMessage method success", async () => {
      restStub.restore();
      restStub = sinon.stub(Client.prototype, "executeQuery").returns({
        data: { id: 1, message: "changed message" },
      });
      wrapper.vm.systemMessages = [
        { id: 1, message: "changed message" },
        { id: 2, message: "another message" },
      ];
      await wrapper.vm.saveEditedMessage(1, "changed message");
      expect(wrapper.vm.systemMessages[0].message).toBe("changed message");
    });

    it("can check saveEditedMessage method fails", async () => {
      restStub.restore();
      restStub = sinon.stub(Client.prototype, "executeQuery").returns({
        data: { error: "error" },
      });
      await wrapper.vm.saveEditedMessage(1, "changed message");
      expect(wrapper.vm.error.general).toBe("error");
    });
  });

  it("updates message text through the textarea", async () => {
    await flushPromises();
    await wrapper.setData({
      systemMessages: [
        {
          id: 42,
          message: "Old notice",
          created_at: "Oct 1, 2026",
          updated_at: "Oct 2, 2026",
        },
      ],
    });

    const textarea = wrapper.find('[data-test="v-textarea"]');
    expect(textarea.exists()).toBe(true);
    await textarea.setValue("Updated notice");
    expect(wrapper.vm.systemMessages[0].message).toBe("Updated notice");
  });

  it("saves an edited message when Save is clicked", async () => {
    const updateSpy = vi
      .spyOn(Client.prototype, "updateMessage")
      .mockResolvedValue({
        error: false,
      });

    await wrapper.setData({
      systemMessages: [
        {
          id: 42,
          message: "Original message",
          created_at: "Oct 1, 2026",
          updated_at: "Oct 2, 2026",
        },
      ],
    });

    const textarea = wrapper.find('[data-test="v-textarea"]');
    await textarea.setValue("Updated message");
    const saveButton = wrapper
      .findAll("button")
      .find((button) => button.text().trim() === "Save");
    expect(saveButton).toBeDefined();
    await saveButton.trigger("click");
    await flushPromises();
    expect(updateSpy).toHaveBeenCalledWith(
      {
        id: 42,
        message: "Updated message",
      },
      123,
    );
    updateSpy.mockRestore();
  });

  it("opens the delete dialog when the trash icon is clicked", async () => {
    await wrapper.setData({
      systemMessages: [
        {
          id: 42,
          message: "System notice",
          created_at: "Oct 1, 2026",
          updated_at: "Oct 2, 2026",
        },
      ],
    });

    const deleteIcon = wrapper.find('tbody v-icon-stub[icon="fas fa-trash"]');

    expect(deleteIcon.exists()).toBe(true);

    await deleteIcon.trigger("click");

    expect(wrapper.vm.dialogs.messageId).toBe(42);
    expect(wrapper.vm.dialogs.deleteMessage).toBe(true);
  });

  it.each([
    ["super_curator", true],
    ["developer", true],
    ["curator", false],
  ])("renders system messages for role %s", async (role, expected) => {
    const roleStore = new Vuex.Store({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({
              role,
              credentials: { token: 123 },
            }),
          },
        },
      },
    });

    const roleWrapper = shallowMount(SystemMessages, {
      global: {
        plugins: [roleStore],
      },
      props: {
        headerItems: header,
      },
    });

    await flushPromises();

    expect(roleWrapper.find("#system-messages").exists()).toBe(expected);

    roleWrapper.unmount();
  });
});
