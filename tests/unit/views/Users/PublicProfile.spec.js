import { flushPromises, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import ORCIDfixture from "@/../tests/fixtures/ORCIDpub.json";
import ExternalClient from "@/lib/Client/ExternalClients.js";
import Client from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import editorStore from "@/store/editor";
import usersStore from "@/store/users";
import PublicProfile from "@/views/Users/PublicProfile";
import {
  VBtnStub,
  VDialogStub,
  VOverlayStub,
  VSlotStub,
} from "../../../stubs/index.js";

const $store = new Vuex.Store({
  modules: {
    users: usersStore,
    editor: editorStore,
  },
});
let $route = {
  path: "/users/12345",
  params: { id: 12345 },
};

const initialUser = usersStore.state.user;
const $router = { push: vi.fn() };

describe("PublicProfile.vue", () => {
  let wrapper;
  let restStub;
  let graphStub;
  let externalClientStub;
  let getpubs;

  const wrappers = [];
  const mountProfile = () => {
    const instance = shallowMount(PublicProfile, {
      mocks: { $store, $router, $route },
      stubs: {
        VBtn: VBtnStub,
        VDialog: VDialogStub,
        VOverlay: VOverlayStub,
        VListItem: VSlotStub,
      },
    });
    wrappers.push(instance);
    return instance;
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    $store.state.users.user = initialUser;
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: { id: "12345", name: "mrgoatse", orcid: "123" },
    });
    graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns({
      user: {
        email: "mrg@goatse.cx",
        firstName: "Mr.",
        lastName: "Goatse",
        homepage: "http://goatse.cx",
        orcid: "1234-5678-9012-3456",
        username: "goatse",
        maintainedRecords: [],
      },
    });
    externalClientStub = sinon
      .stub(ExternalClient.prototype, "executeQuery")
      .returns({ data: ORCIDfixture });
    wrapper = mountProfile();
    getpubs = vi.spyOn(wrapper.vm, "getPublications");
    await flushPromises();
  });

  afterEach(() => {
    wrappers.splice(0).forEach((instance) => instance.unmount());
    sinon.restore();
    vi.restoreAllMocks();
  });

  it("can be instantiated", () => {
    const title = "PublicProfile";
    expect(wrapper.vm.$options.name).toMatch(title);
    expect(wrapper.vm.publications.length).toBeGreaterThan(0);
    expect(getpubs).toHaveBeenCalledTimes(1);
  });

  it("has correct public user metadata", () => {
    expect(wrapper.vm.getPublicUserMeta.lastName).toEqual("Goatse");
    expect(wrapper.vm.getPublicUserMeta.maintainedRecords).toBe(undefined);
  });

  it("does not return publications if no orcid", async () => {
    let pubs = await wrapper.vm.getPublications();
    expect(pubs.length).toBeGreaterThan(0);
    wrapper.vm.userData.user.orcid = null;
    pubs = await wrapper.vm.getPublications();
    expect(getpubs).toHaveBeenCalledTimes(3);
    expect(pubs.length).toEqual(0);
  });

  it("doesn't look for publications if the user doesn't load", async () => {
    graphStub.returns({ error: "User not found" });
    wrapper = mountProfile();
    const publications = vi.spyOn(wrapper.vm, "getPublications");
    await flushPromises();
    expect(publications).not.toHaveBeenCalled();
    expect(wrapper.vm.publications).toStrictEqual([]);
    expect(wrapper.vm.error).toBe(true);
    expect(wrapper.findComponent({ name: "NotFound" }).exists()).toBe(true);
    expect(wrapper.vm.loading).toBe(false);
  });

  it("handles publications errors", async () => {
    externalClientStub.returns({ data: { error: "Unavailable" } });
    expect(await wrapper.vm.getPublications()).toStrictEqual([]);
  });

  it("builds publication URLs from DOI URLs and values, keeping unlinked works", async () => {
    const work = (title, externalIds) => ({
      "work-summary": [
        {
          title: { title: { value: title } },
          ...(externalIds === undefined ? {} : { "external-ids": externalIds }),
        },
      ],
    });
    externalClientStub.returns({
      data: {
        "activities-summary": {
          works: {
            group: [
              work("URL", {
                "external-id": [
                  {
                    "external-id-type": "doi",
                    "external-id-url": { value: "https://doi.org/10.1/url" },
                  },
                ],
              }),
              work("Value", {
                "external-id": [
                  {
                    "external-id-type": "doi",
                    "external-id-value": "10.1/value",
                  },
                ],
              }),
              work("Other", {
                "external-id": [{ "external-id-type": "isbn" }],
              }),
              work("Empty DOI", {
                "external-id": [{ "external-id-type": "doi" }],
              }),
              work("No ids"),
              work("Empty ids", {}),
              work("Seventh"),
              work("Eighth"),
            ],
          },
        },
      },
    });
    const result = await wrapper.vm.getPublications();
    expect(result).toEqual([
      { title: "URL", url: "https://doi.org/10.1/url" },
      { title: "Value", url: "https://doi.org/10.1/value" },
      ...["Other", "Empty DOI", "No ids", "Empty ids", "Seventh"].map(
        (title) => ({ title, url: null }),
      ),
    ]);
    await wrapper.setData({ publications: result });
    expect(wrapper.find('a[href="https://doi.org/10.1/url"]').exists()).toBe(
      true,
    );
    expect(wrapper.text()).toContain("Other (No available link)");
  });

  it("renders missing personal details, preferences and an empty publication list", async () => {
    await wrapper.setData({
      publications: [],
      userData: {
        user: {
          username: "reader",
          homepage: null,
          orcid: null,
          preferences: {},
          maintainedRecords: [],
          organisations: [],
          editEvents: [],
          role: "user",
          awards: [],
          thirdParty: false,
          createdSearches: [],
          savedSearches: [],
        },
      },
    });
    expect(wrapper.vm.getPublicUserMeta).toEqual({
      email: "mrg@goatse.cx",
      firstName: "Mr.",
      lastName: "Goatse",
      username: "reader",
      homepage: null,
      orcid: null,
      preferences: {},
    });
    expect(wrapper.vm.userData.user).toHaveProperty("maintainedRecords");
    expect(wrapper.text()).toContain("None");
    expect(wrapper.text()).toContain("does not have any publications");
    expect(wrapper.find('a[href^="https://orcid.org/"]').exists()).toBe(false);
  });

  it("only allows super curators to open the deletion dialog and delete accounts", async () => {
    const account = {
      is_super_curator: false,
      credentials: { token: "admin-token" },
    };
    $store.state.users.user = () => account;
    restStub.resetHistory();
    wrapper.vm.showDeleteDialog();
    await wrapper.vm.deleteAccount();
    expect(wrapper.vm.confirmDelete).toBe(false);
    expect(restStub.called).toBe(false);
    expect($router.push).not.toHaveBeenCalled();

    account.is_super_curator = true;
    wrapper
      .findComponent({ name: "UserProfileMenu" })
      .vm.$emit("show-confirm-delete");
    await wrapper.vm.$nextTick();
    expect(wrapper.get('[data-test="v-dialog"]').text()).toContain(
      "Deleting User Account!",
    );
    await wrapper
      .findAll("button")
      .find((button) => button.text() === "Cancel")
      .trigger("click");
    expect(wrapper.vm.confirmDelete).toBe(false);
    wrapper.vm.showDeleteDialog();
    await wrapper.vm.$nextTick();
    await wrapper
      .findAll("button")
      .find((button) => button.text() === "Delete")
      .trigger("click");
    await flushPromises();
    expect(restStub.firstCall.args[0]).toMatchObject({
      method: "delete",
      baseURL: expect.stringContaining("/user_admin/12345"),
      headers: { Authorization: expect.stringContaining("admin-token") },
    });
    expect($router.push).toHaveBeenCalledWith({ path: "/" });
  });

  it("updates the dialog and loading overlay models", async () => {
    wrapper.findComponent(VDialogStub).vm.$emit("update:modelValue", true);
    wrapper.findComponent(VOverlayStub).vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.confirmDelete).toBe(true);
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.findComponent({ name: "RecordsTable" }).exists()).toBe(
      false,
    );
  });
});
