import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import HiddenRecords from "@/components/Curators/HiddenRecords.vue";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import usersStore from "@/store/users";

import dataDashboard from "../../../fixtures/curationDashboardData.json";
import { VDataTableStub } from "../../../stubs/VDataTableStub.js";
import { VTextFieldStub } from "../../../stubs/VTextFieldStub.js";

let curationDataSummary = dataDashboard.curationSummary;

let header = [
  {
    text: "Record name (id)",
    value: "recordNameID",
  },
  {
    text: "Date created",
    value: "createdAt",
  },
  {
    text: "Under curation by",
    value: "curator",
  },
  {
    text: "Created by",
    value: "creator",
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

describe("Curator -> HiddenRecords.vue", () => {
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
    wrapper = shallowMount(HiddenRecords, {
      global: {
        plugins: [$store],
        mocks: { $router },
        stubs: {
          VDataTable: VDataTableStub,
          VTextField: VTextFieldStub,
        },
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
    expect(wrapper.vm.$options.name).toMatch("HiddenRecords");
    expect(wrapper.vm.prepareHiddenRecords).toHaveBeenCalled;
    expect(wrapper.vm.hiddenRecords.length).toBe(2);
    let date = new Date("1425,01,01");
    let auxString =
      date.toLocaleString("default", { month: "short" }) +
      " " +
      date.getDate() +
      ", " +
      date.getFullYear();
    expect(wrapper.vm.hiddenRecords[1].createdAt).toBe(auxString);
  });

  it("can check for hiddenRecords", () => {
    let output = {
      createdAt: "Oct 12, 2020",
      creator: "Juancho",
      curator: "Manolo",
      id: "2669f95",
      idCreator: "234",
      recordNameID: "ShareSfhare (2669f95)",
      type: undefined,
    };
    expect(wrapper.vm.hiddenRecords[0]).toStrictEqual(output);
  });

  it("navigates to the record when record name is clicked", async () => {
    const record = wrapper.vm.hiddenRecords[0];
    const navigateSpy = vi.spyOn(wrapper.vm, "navigateTo");
    const recordLink = wrapper.find(`a[href="/${record.id}"]`);
    expect(recordLink.exists()).toBe(true);
    await recordLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith(record.id);
  });
  it("navigates to the creator profile when clicked", async () => {
    const record = wrapper.vm.hiddenRecords.find((item) => item.idCreator);
    expect(record).toBeDefined();
    const navigateSpy = vi.spyOn(wrapper.vm, "navigateTo");
    const creatorLink = wrapper.find(`a[href="/users/${record.idCreator}"]`);
    expect(creatorLink.exists()).toBe(true);
    await creatorLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith(`/users/${record.idCreator}`);
  });

  it("renders an avatar only when record type is available", async () => {
    await wrapper.setData({
      hiddenRecords: [
        {
          id: "123",
          recordNameID: "Record A (123)",
          type: "database",
          createdAt: "Oct 12, 2020",
          curator: "Manolo",
          creator: "Juancho",
          idCreator: "234",
        },
        {
          id: "456",
          recordNameID: "Record B (456)",
          type: null,
          createdAt: "Oct 13, 2020",
          curator: "none",
          creator: "unknown",
        },
      ],
    });

    await wrapper.vm.$nextTick();
    // Only the first record should have an avatar.
    expect(wrapper.findAll("v-avatar-stub")).toHaveLength(1);
    // Both records should still be displayed.
    expect(wrapper.text()).toContain("Record A (123)");
    expect(wrapper.text()).toContain("Record B (456)");
  });

  it("updates the search field using v-model", async () => {
    const searchField = wrapper.find('[data-test="v-text-field"]');
    expect(searchField.exists()).toBe(true);
    await searchField.setValue("ShareSfhare");
    expect(wrapper.vm.searches).toBe("ShareSfhare");
  });
});
