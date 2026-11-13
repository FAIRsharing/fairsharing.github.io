import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { cloneDeep } from "lodash-es";
import { flushPromises, shallowMount } from "@vue/test-utils";

import sinon from "sinon";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import usersStore from "@/store/users";
import Curator from "@/views/Curators/Curator.vue";

import dataDashboard from "../../../fixtures/curationDashboardData.json";
import {
  VSlotStub,
  VTabsStub,
  VTabsWindowStub,
  VTabsWindowItemStub,
} from "../../../stubs/index.js";
const initialUsers = cloneDeep(usersStore.state);

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

let fakeDataDashboard = dataDashboard;
let vuetify = createVuetify();

describe("Curator.vue", () => {
  let wrapper;
  let restStub;
  let graphStub;

  const mountOptions = {
    global: {
      plugins: [vuetify, $store],
      mocks: { $router },
      stubs: {
        VContainer: VSlotStub,
        VRow: VSlotStub,
        VCol: VSlotStub,
        VToolbar: VSlotStub,
        VToolbarTitle: VSlotStub,
        VCard: VSlotStub,
        VCardText: VSlotStub,
        VTabs: VTabsStub,
        VTab: VSlotStub,
        VTabsWindow: VTabsWindowStub,
        VTabsWindowItem: VTabsWindowItemStub,
      },
    },
  };
  const baseUser = {
    id: 1,
    isLoggedIn: true,
    role: "super_curator",
    credentials: { token: "test-token", username: "Curator One" },
  };
  const leastRecord = {
    id: 42,
    name: "Old resource",
    updatedAt: "2020-01-27T12:00:00Z",
  };
  let originalUser;

  beforeAll(() => {
    restStub = sinon.stub(Client.prototype, "executeQuery");
    graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
  });
  beforeEach(async () => {
    originalUser = localStorage.getItem("user");
    localStorage.setItem("user", JSON.stringify(baseUser));
    Object.assign($store.state.users, cloneDeep(initialUsers));
    $store.state.users.user = () => cloneDeep(baseUser);
    $router.push.mockClear();
    restStub.reset();
    restStub.returns({ data: { id: "12345", username: "Curator One" } });
    graphStub.reset();
    graphStub.callsFake((query) =>
      query.queryName === "leastRecentlyUpdated"
        ? { leastRecentlyUpdated: structuredClone(leastRecord) }
        : { ...structuredClone(fakeDataDashboard), user: {} },
    );
    vi.stubEnv("VITE_HOSTNAME", "https://fairsharing.org/");
    wrapper = shallowMount(Curator, mountOptions);
    await flushPromises();
  });
  afterEach(async () => {
    await flushPromises();
    wrapper.unmount();
    vi.unstubAllEnvs();
    if (originalUser === null) localStorage.removeItem("user");
    else localStorage.setItem("user", originalUser);
  });
  afterAll(() => {
    graphStub.restore();
    restStub.restore();
  });

  it("can be mounted", async () => {
    const title = "Curator";
    expect(wrapper.vm.$options.name).toMatch(title);

    //Not sure why this variable (recordsInCuration) was introduced and assisgned array
    // expect(wrapper.vm.recordsInCuration.length).toBe(2);
    // expect(wrapper.vm.recordsInCuration[1].recordNameID).toBe("Frog French databases (12345)");
  });

  it("loads the curator dashboard and least recently updated record", () => {
    expect(wrapper.text()).toContain("Welcome, curator Curator One");
    expect(wrapper.find('a[href="https://fairsharing.org/42"]').text()).toBe(
      "Old resource",
    );
    expect(wrapper.text()).toContain("Jan 27, 2020");
    expect(wrapper.vm.loading).toBe(false);
    expect(
      graphStub
        .getCalls()
        .some((call) => call.args[0].queryName === "leastRecentlyUpdated"),
    ).toBe(true);
    for (const tab of wrapper.vm.tabs) {
      expect(wrapper.text()).toContain(tab.name);
      const child = wrapper.findComponent({ name: tab.component });
      expect(
        child.props("headerItems") ?? child.vm.$attrs["header-items"],
      ).toEqual(tab.headers);
    }
  });

  it.each(["developer", "super_curator", "curator", null])(
    "allows dashboard access only for privileged roles: %s",
    async (role) => {
      $store.state.users.user = () => ({ ...cloneDeep(baseUser), role });
      await wrapper.vm.$nextTick();
      const permitted = role === "developer" || role === "super_curator";
      expect(wrapper.findComponent(VTabsStub).exists()).toBe(permitted);
      expect(wrapper.findComponent({ name: "Unauthorized" }).exists()).toBe(
        !permitted,
      );
    },
  );

  it("synchronizes both tab model bindings", async () => {
    wrapper.findComponent(VTabsStub).vm.$emit("update:modelValue", 3);
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(VTabsWindowStub).props("modelValue")).toBe(3);
    wrapper.findComponent(VTabsWindowStub).vm.$emit("update:modelValue", 5);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedTab).toBe(5);
    expect(wrapper.findComponent(VTabsStub).props("modelValue")).toBe(5);
  });

  it("hides least-updated details when the API returns no record", async () => {
    wrapper.unmount();
    graphStub.callsFake((query) =>
      query.queryName === "leastRecentlyUpdated"
        ? { leastRecentlyUpdated: null }
        : { user: {} },
    );
    wrapper = shallowMount(Curator, mountOptions);
    await flushPromises();
    expect(wrapper.text()).not.toContain(
      "The record least recently updated is:",
    );
    expect(wrapper.vm.loading).toBe(false);
  });

  it("keeps loading active until the least-updated request resolves", async () => {
    wrapper.unmount();
    let resolve;
    graphStub.callsFake((query) =>
      query.queryName === "leastRecentlyUpdated"
        ? new Promise((done) => {
            resolve = done;
          })
        : { user: {} },
    );
    wrapper = shallowMount(Curator, mountOptions);
    await flushPromises();
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.vm.leastRecentlyDetails).toBeNull();
    resolve({ leastRecentlyUpdated: leastRecord });
    await flushPromises();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.leastRecentlyDetails).toEqual(leastRecord);
  });

  it("reports an expired user session and redirects to login", async () => {
    wrapper.unmount();
    restStub.returns({
      data: { error: { response: { data: { error: "Session expired" } } } },
    });
    wrapper = shallowMount(Curator, mountOptions);
    await flushPromises();
    expect($store.state.users.messages().login).toEqual({
      error: true,
      message: "You've been logged out automatically",
    });
    expect($router.push).toHaveBeenCalledWith({ path: "/accounts/login" });
    expect(wrapper.text()).not.toContain("Welcome, curator");
    expect(wrapper.vm.loading).toBe(false);
  });
});
