import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import IncompleteRecords from "@/components/Curators/IncompleteRecords.vue";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import usersStore from "@/store/users";

import dataDashboard from "../../../fixtures/curationDashboardData.json";

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
  beforeAll(() => {
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
    vi.spyOn(Client.prototype, "deleteRecord").mockResolvedValue({
      error: false,
    });
    await wrapper.setData({
      incompleteRecords: [
        { id: 10, name: "Keep Me" },
        { id: 55, name: "Delete Me" },
        { id: 90, name: "Keep Me Too" },
      ],
      dialogs: {
        recordID: 55,
        deleteRecord: true,
      },
    });

    await wrapper.vm.confirmDelete();
    expect(wrapper.vm.incompleteRecords.length).toBe(2);
    expect(
      wrapper.vm.incompleteRecords.find((r) => r.id === 55),
    ).toBeUndefined();

    expect(wrapper.vm.incompleteRecords[0].id).toBe(10);
    expect(wrapper.vm.incompleteRecords[1].id).toBe(90);

    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
  });

  it("can check for deleteRecordMenu method", () => {
    vi.useFakeTimers();
    wrapper.vm.deleteRecordMenu(1);
    expect(wrapper.vm.dialogs.disableButton).toBe(false);
    expect(wrapper.vm.dialogs.disableDelButton).toBe(true);
    expect(wrapper.vm.dialogs.recordID).toBe(1);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(true);
    vi.advanceTimersByTime(5000);
    expect(wrapper.vm.dialogs.disableDelButton).toBe(false);
    vi.useRealTimers();
  });

  it("can check for closeDeleteMenu method", () => {
    wrapper.vm.closeDeleteMenu();
    expect(wrapper.vm.dialogs.disableButton).toBe(true);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
  });
});
