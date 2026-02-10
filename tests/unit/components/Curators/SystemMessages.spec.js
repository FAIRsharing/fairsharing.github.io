import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import SystemMessages from "@/components/Curators/SystemMessages.vue";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import usersStore from "@/store/users";

import dataDashboard from "../../../fixtures/curationDashboardData.json";

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
    credentials: { token: 123, username: 123 },
  };
};

const $store = new Vuex.Store({
  modules: {
    users: usersStore,
  },
});

const $router = { push: vi.fn() };

describe("Curator -> SystemMessages.vue", () => {
  let restStub, wrapper, graphStub;
  beforeAll(() => {
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
    expect(wrapper.vm.$options.name).toMatch("SystemMessages");
    expect(wrapper.vm.prepareSystemMessages).toHaveBeenCalled;
  });

  it("can addMessage method is success", async () => {
    wrapper.vm.dialogs.newMessage = "newMessage";
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: { id: 1, message: wrapper.vm.dialogs.newMessage },
    });
    await wrapper.vm.addMessage();
    expect(wrapper.vm.systemMessages[0].message).toBe(
      "This is an exciting message",
    );
    expect(wrapper.vm.dialogs.addMessage).toBe(false);
    expect(wrapper.vm.dialogs.newMessage).toBe(null);
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

  it("can check confirmDeleteMessage method is success", async () => {
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: { id: 2, message: "newMessage" },
    });
    wrapper.vm.dialogs.messageId = 2;
    wrapper.vm.systemMessages = [
      { id: 1, message: "changed message" },
      { id: 2, message: "another message" },
    ];
    await wrapper.vm.confirmDeleteMessage();
    expect(wrapper.vm.systemMessages.length).toEqual(1);
    expect(wrapper.vm.dialogs.deleteMessage).toBe(false);
    expect(wrapper.vm.dialogs.messageId).toBe(null);
  });

  it("can confirmDeleteMessage method fails", async () => {
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: { error: "error" },
    });
    await wrapper.vm.confirmDeleteMessage();
    expect(wrapper.vm.error.general).toBe("error");
    expect(wrapper.vm.dialogs.addMessage).toBe(false);
    expect(wrapper.vm.dialogs.newMessage).toBe(null);
  });

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

  it("can check showAddMessage method", async () => {
    wrapper.vm.dialogs.addMessage = false;
    wrapper.vm.showAddMessage();
    expect(wrapper.vm.dialogs.addMessage).toBe(true);
  });

  it("can check closeAddMessageMenu method", async () => {
    wrapper.vm.dialogs.addMessage = true;
    wrapper.vm.closeAddMessageMenu();
    expect(wrapper.vm.dialogs.addMessage).toBe(false);
  });

  it("can check closeDeleteMessageMenu method", async () => {
    wrapper.vm.dialogs.deleteMessage = true;
    wrapper.vm.dialogs.messageId = 1;
    wrapper.vm.closeDeleteMessageMenu();
    expect(wrapper.vm.dialogs.messageId).toBe(null);
    expect(wrapper.vm.dialogs.deleteMessage).toBe(false);
  });

  it("can check deleteMessage method", async () => {
    wrapper.vm.deleteMessage(1);
    expect(wrapper.vm.dialogs.messageId).toBe(1);
    expect(wrapper.vm.dialogs.deleteMessage).toBe(true);
  });
});
