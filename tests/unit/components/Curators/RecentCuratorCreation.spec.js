import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import RecentCuratorCreation from "@/components/Curators/RecentCuratorCreation.vue";
import GraphClient from "@/lib/GraphClient/GraphClient";

import dataDashboard from "../../../fixtures/curationDashboardData.json";
import { VDataTableStub, VTextFieldStub } from "../../../stubs/index.js";

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
    text: "Creator",
    value: "creator",
  },
];
const $router = { push: vi.fn() };

describe("Curator -> RecentCuratorCreation.vue", () => {
  let wrapper, graphStub;

  const createStore = () =>
    new Vuex.Store({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({
              isLoggedIn: true,
              credentials: { token: 123, username: 123 },
            }),
          },
        },
      },
    });

  beforeEach(() => {
    graphStub = sinon
      .stub(GraphClient.prototype, "executeQuery")
      .resolves(curationDataSummary);

    wrapper = shallowMount(RecentCuratorCreation, {
      global: {
        plugins: [createStore()],
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
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("RecentCuratorCreation");
  });

  it("can check for IF condition prepareRecordsCuratorCreationsLastWeek method", () => {
    wrapper.vm.recordsCreatedCuratorsLastWeek = [];
    let data = {
      recentCuratorCreations: [
        {
          name: "test",
          id: 1,
          type: "testtype",
          creator: "dummyCreator",
        },
      ],
    };
    wrapper.vm.prepareRecordsCuratorCreationsLastWeek(data);
    expect(wrapper.vm.recordsCreatedCuratorsLastWeek).toHaveLength(1);
  });

  it("can check for ELSE condition prepareRecordsCuratorCreationsLastWeek method ", () => {
    wrapper.vm.recordsCreatedCuratorsLastWeek = [];
    let data = {
      recentCuratorCreations: [
        {
          name: "test",
          id: 1,
          type: "testtype",
        },
      ],
    };
    wrapper.vm.prepareRecordsCuratorCreationsLastWeek(data);
    expect(wrapper.vm.recordsCreatedCuratorsLastWeek).toHaveLength(1);
  });

  it("updates the search field using v-model", async () => {
    const searchField = wrapper.find('[data-test="v-text-field"]');
    expect(searchField.exists()).toBe(true);
    await searchField.setValue("ShareSfhare");
    expect(wrapper.vm.searches).toBe("ShareSfhare");
  });

  it("navigates to record and creator pages", async () => {
    await wrapper.setData({
      recordsCreatedCuratorsLastWeek: [
        {
          id: "rec-1",
          recordNameID: "Record A (rec-1)",
          type: "database",
          createdAt: "Oct 20, 2026",
          creator: "Alice",
          idCreator: "user-1",
        },
      ],
    });

    const navigateSpy = vi
      .spyOn(wrapper.vm, "navigateTo")
      .mockImplementation(() => {});

    // Record navigation
    const recordLink = wrapper.find('a[href="/rec-1"]');
    expect(recordLink.exists()).toBe(true);
    await recordLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith("rec-1");

    // Creator navigation
    const creatorLink = wrapper.find('a[href="/users/user-1"]');
    expect(creatorLink.exists()).toBe(true);
    await creatorLink.trigger("click");
    expect(navigateSpy).toHaveBeenCalledWith("/users/user-1");
    expect(navigateSpy).toHaveBeenCalledTimes(2);
    navigateSpy.mockRestore();
  });
});
