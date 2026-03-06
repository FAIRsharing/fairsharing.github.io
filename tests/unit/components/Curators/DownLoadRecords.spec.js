import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import DownloadRecords from "@/components/Curators/DownloadRecords.vue";
import Client from "@/lib/Client/RESTClient.js";
import usersStore from "@/store/users";

usersStore.state.user = function () {
  return {
    isLoggedIn: true,
    credentials: { token: 123, username: 123 },
  };
};

const store = new Vuex.Store({
  modules: {
    users: usersStore,
  },
});

// Mock Router
const router = { push: vi.fn() };

describe("Curator -> DownloadRecords.vue", () => {
  let restStub, wrapper;
  beforeAll(() => {
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: {
        error: false,
      },
    });
    wrapper = shallowMount(DownloadRecords, {
      plugins: [store],
      mocks: { router },
    });
  });
  afterEach(() => {
    restStub.restore();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("DownloadRecords");
  });
});
