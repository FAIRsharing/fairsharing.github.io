import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import RecentCuratorCreation from "@/components/Curators/RecentCuratorCreation.vue";
import GraphClient from "@/lib/GraphClient/GraphClient";

import dataDashboard from "../../../fixtures/curationDashboardData.json";

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
});
