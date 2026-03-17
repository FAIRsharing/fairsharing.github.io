import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import RecentCuratorCreation from "@/components/Curators/RecentCuratorCreation.vue";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient";
import usersStore from "@/store/users";

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
usersStore.state.user = function () {
  return {
    namespaced: true,
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

describe("Curator -> RecentCuratorCreation.vue", () => {
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
    wrapper = shallowMount(RecentCuratorCreation, {
      plugins: [$store],
      mocks: { $router },
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
