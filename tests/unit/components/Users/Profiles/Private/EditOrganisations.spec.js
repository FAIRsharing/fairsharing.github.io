import { flushPromises, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import { createVuetify } from "vuetify";
import Vuex from "vuex";
import { defineComponent, reactive } from "vue";

import EditOrganisations from "@/components/Users/Profiles/Private/EditOrganisations";
import RestClient from "@/lib/Client/RESTClient";
import RESTClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getPublicUserQuery from "@/lib/GraphClient/queries/getPublicUserMeta.json";
import getUserQuery from "@/lib/GraphClient/queries/getUserMeta.json";
import getOrganisationsQuery from "@/lib/GraphClient/queries/Organisations/getOrganisations.json";
import getOrganisationTypesQuery from "@/lib/GraphClient/queries/Organisations/getOrganisationTypes.json";
import editor from "@/store/editor.js";
import editorStore from "@/store/editor.js";
import userStore from "@/store/users.js";

import {
  VAutocompleteStub,
  VBtnStub,
  VDataTableStub,
  VDialogStub,
  VFormStub,
  VRouterLinkStub,
  VTextFieldStub,
} from "../../../../../stubs/index.js";
import { VIconStub } from "../../../../../stubs/VIconStub.js";

const organisationFixtures = [
  {
    id: 4,
    name: "Organisation four",
    homepage: "https://four.example.org",
    types: ["Research"],
    organisationTypes: [{ name: "Research" }],
  },
  {
    id: 1,
    name: "Organisation one",
    homepage: "https://one.example.org",
    types: ["Company"],
    organisationTypes: [{ name: "Company" }],
  },
  {
    id: 7,
    name: "Organisation seven",
    homepage: "https://seven.example.org",
    types: ["Research", "Company"],
    organisationTypes: [{ name: "Research" }, { name: "Company" }],
  },
];

// Initializing store states and getters
editorStore.state.organisations = [];

userStore.state.user = function () {
  return {
    isLoggedIn: true,
    credentials: { token: 123, username: 123 },
    watchedRecords: [1],
    records: { organisations: [] },
    id: 1,
    is_super_curator: true,
  };
};
let $store = new Vuex.Store({
    modules: {
      users: userStore,
      editor: editor,
    },
  }),
  $route = reactive({
    path: "/",
    params: { id: "1" },
    name: "EditPublicProfile",
  });
const $router = { push: vi.fn() };
// Preparing mocks
let mocks = {
  graphMock: null,
  restMock: null,
  editPublicUserStub: null,
  editUserStub: null,
  getUserStub: null,
  /**
   * Commenting as it is giving null output
   * Need to check it again later
   */
  // restore: function(mockKey) {
  //     this[mockKey].restore();
  // },
  // restoreAll: function(){
  //     this.restore("graphMock");
  //     this.restore("restMock");
  //     this.restore("editPublicUserStub");
  //     this.restore("editUserStub");
  //     this.restore("getUserStub");
  // },

  setMock: function (mockKey, targetClass, targetMethod, returnedValue) {
    this[mockKey] = sinon.stub(targetClass, targetMethod);
    this[mockKey].returns(returnedValue);
  },
  throwMock: function (mockKey, targetClass, targetMethod) {
    this[mockKey] = sinon
      .stub(targetClass, targetMethod)
      .throws(new Error("error"));
  },
};

const textFieldStub = defineComponent(VTextFieldStub);
describe("OrganisationTable.vue", () => {
  let wrapper,
    vuetify,
    graphMockValue = { user: { organisations: [{ id: 4 }, { id: 1 }] } };
  let originalUserFn;

  beforeAll(async () => {
    originalUserFn = userStore.state.user;
    mocks.setMock(
      "graphMock",
      GraphClient.prototype,
      "executeQuery",
      graphMockValue,
    );
    mocks.setMock(
      "editPublicUserStub",
      RESTClient.prototype,
      "editPublicUser",
      "success",
    );
    mocks.setMock("editUserStub", RESTClient.prototype, "editUser", "success");
    mocks.setMock("getUserStub", RESTClient.prototype, "getUser", {});
    mocks.setMock("restMock", RestClient.prototype, "executeQuery", {
      data: {},
    });
    vuetify = createVuetify();
  });
  afterAll(() => {
    [
      "graphMock",
      "restMock",
      "editPublicUserStub",
      "editUserStub",
      "getUserStub",
    ].forEach((key) => mocks[key].restore());
    userStore.state.user = originalUserFn;
  });
  afterEach(async () => {
    await flushPromises();
    wrapper.unmount();
    vi.restoreAllMocks();
    localStorage.removeItem("user");
  });
  beforeEach(async () => {
    [
      "graphMock",
      "restMock",
      "editPublicUserStub",
      "editUserStub",
      "getUserStub",
    ].forEach((key) => mocks[key].reset());
    $route.path = "/";
    $route.name = "EditPublicProfile";
    $route.params = { id: "1" };
    $store.state.users.user = originalUserFn;
    $store.commit("users/clearMessages");
    localStorage.setItem("user", JSON.stringify(originalUserFn()));
    graphMockValue = {
      user: {
        organisations: structuredClone(organisationFixtures.slice(0, 2)),
      },
    };
    mocks.graphMock.withArgs(getPublicUserQuery).returns(graphMockValue);
    mocks.graphMock.withArgs(getUserQuery).returns(graphMockValue);
    mocks.graphMock
      .withArgs(getOrganisationsQuery)
      .returns({ searchOrganisations: structuredClone(organisationFixtures) });
    mocks.graphMock.withArgs(getOrganisationTypesQuery).returns({
      searchOrganisationTypes: [
        { id: 1, name: "Research" },
        { id: 2, name: "Company" },
      ],
    });
    mocks.editPublicUserStub.resolves({ error: false });
    mocks.editUserStub.resolves({ error: false });
    mocks.getUserStub.returns({ id: 1, username: "user", preferences: {} });
    mocks.restMock.resolves({ data: {} });
    wrapper = await shallowMount(EditOrganisations, {
      mocks: { $route, $store, $router },
      vuetify,
      stubs: {
        "v-text-field": textFieldStub,
        VTextField: textFieldStub,
        VBtn: VBtnStub,
        VDialog: VDialogStub,
        VForm: VFormStub,
        VAutocomplete: VAutocompleteStub,
        VIcon: VIconStub,
        "router-link": VRouterLinkStub,
        VSnackbar: {
          name: "VSnackbar",
          props: ["modelValue"],
          emits: ["update:modelValue"],
          template: '<div v-if="modelValue" role="status"><slot /></div>',
        },
        VDataTable: {
          ...VDataTableStub,
          name: "VDataTable",
          props: {
            ...VDataTableStub.props,
            modelValue: Array,
            itemsPerPage: Number,
          },
          emits: ["update:modelValue"],
          template: `
            <div data-test="v-data-table">
              <slot name="top" />
              <table>
                <thead><tr><th v-for="header in headers" :key="header.value">{{ header.title }}</th></tr></thead>
                <tbody>
                  <tr v-for="item in items" :key="item.id">
                    <td v-for="header in headers" :key="header.value">
                      <slot :name="'item.' + header.value" :item="item" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <slot v-if="!items.length" name="no-data" />
            </div>
          `,
        },
      },
    });
    await flushPromises();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("EditOrganisations");
    expect(wrapper.vm.perPage).toBe(5);
    wrapper.vm.rules.isRequired();
    wrapper.vm.rules.isURL();
    wrapper.vm.rules.isLongEnough(1);
  });

  it("can process organisation types", () => {
    $route.params.id = "1";
    let obj = [
      {
        name: "one",
      },
      {
        name: "two",
      },
    ];
    expect(wrapper.vm.objToList(obj)).toEqual("one, two");
  });

  it("can close delete dialog", () => {
    wrapper.vm.closeDelete();
    expect(wrapper.vm.selectedOrganisationID).toBe(-1);
  });

  it("can close delete item", () => {
    const item = { id: 4 };
    wrapper.vm.deleteItem({ id: 4 });
    expect(wrapper.vm.selectedOrganisationID).toBe(item.id);
  });

  it("can check delete confirm method", async () => {
    wrapper.vm.selectedOrganisationID = 4;
    await wrapper.vm.deleteItemConfirm();
    expect(wrapper.vm.userOrganisations).toStrictEqual([
      organisationFixtures[1],
    ]);
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
        credentials: { token: 123, username: 123 },
        is_super_curator: true,
      };
    };
    $route.params.id = "1";
    wrapper.vm.selectedOrganisationID = 1;
    await wrapper.vm.deleteItemConfirm();
    expect(wrapper.vm.userOrganisations).toEqual([]);
  });

  it("can check watcher behavior", () => {
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
        credentials: { token: 123, username: 123 },
        is_super_curator: false,
        id: 1,
      };
    };
    wrapper.vm.viewerCanManipulate();
    expect(wrapper.vm.userCanEditOrganisation).toBe(true);
    $store.state.users.user = function () {
      return {
        isLoggedIn: false,
        credentials: { token: 123, username: 123 },
        is_super_curator: true,
      };
    };
    $route.path = "another route";
    $route.name = "Edit profile";
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
      };
    };
    wrapper.vm.viewerCanManipulate();
    expect(wrapper.vm.userCanEditOrganisation).toBe(true);
    $store.state.users.user = function () {
      return {
        isLoggedIn: false,
      };
    };
    wrapper.vm.viewerCanManipulate();
    expect(wrapper.vm.userCanEditOrganisation).toBe(false);
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
        credentials: { token: 123, username: 123 },
        is_super_curator: false,
      };
    };
    wrapper.vm.viewerCanManipulate();
    expect(wrapper.vm.userCanEditOrganisation).toBe(true);
  });

  it("can check AddToUsersOrganisations method", async () => {
    graphMockValue.user.organisations = [];
    wrapper.vm.userOrganisations = graphMockValue.user.organisations;
    let item = { id: 1, types: ["company", "organisation"] };
    await wrapper.vm.AddToUsersOrganisations(item);
    expect(wrapper.vm.userOrganisations).toStrictEqual([
      {
        id: 1,
        organisationTypes: [{ name: "company" }, { name: "organisation" }],
        types: ["company", "organisation"],
      },
    ]);
    item = { id: 1, types: ["company", "organisation"] };
    await wrapper.vm.AddToUsersOrganisations(item);
    expect(wrapper.vm.userOrganisations).toStrictEqual([
      {
        id: 1,
        organisationTypes: [{ name: "company" }, { name: "organisation" }],
        types: ["company", "organisation"],
      },
    ]);
  });

  it("can create a new organisation", async () => {
    // Exercise API orchestration independently of table rendering. The component
    // temporarily inserts an ID-only row, which its type formatter cannot render.
    wrapper.unmount();
    wrapper = shallowMount(EditOrganisations, {
      mocks: { $route, $store, $router },
      vuetify,
      stubs: { VDataTable: VDataTableStub, VTextField: textFieldStub },
    });
    await flushPromises();
    let restStub = mocks.restMock;
    restStub.returns({
      data: {
        error: "I am an error",
      },
    });
    wrapper.vm.AddNewOrganisation.logoData = {
      data: "data:image/png;base64,AnotherTest",
    };
    wrapper.vm.AddNewOrganisation.data = {
      name: "test",
      homepage: "https://example.com/test",
      organisation_type_ids: [{ id: 1, name: "?" }],
    };
    await wrapper.vm.createNewOrganisation();
    expect(wrapper.vm.AddNewOrganisation.error).toBe("I am an error");
    expect(restStub.firstCall.args[0].data.organisation).toEqual({
      name: "test",
      homepage: "https://example.com/test",
      organisation_type_ids: [1],
      logo: { data: "AnotherTest" },
    });
    wrapper.vm.AddNewOrganisation.logoData = null;
    restStub.returns({
      data: {
        id: 9,
        name: "test",
        types: [{ name: "?" }],
      },
    });
    $route.name = "EditPublicProfile";
    await wrapper.vm.createNewOrganisation();
    expect(wrapper.vm.organisations).toStrictEqual(organisationFixtures);
    expect(mocks.editPublicUserStub.lastCall.args).toEqual([
      { id: "1", organisation_ids: [4, 1, 9] },
      123,
    ]);
    wrapper.vm.AddNewOrganisation.data = {
      name: "test",
      homepage: "https://example.com/test",
      organisation_type_ids: [{ id: 1, name: "?" }],
    };
    $route.name = "sss";
    await wrapper.vm.createNewOrganisation();
  });

  it("loads and renders organisation details, types and links", () => {
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.loadingAllOrganisations).toBe(false);
    expect(wrapper.vm.allOrganisations).toEqual(organisationFixtures);
    expect(wrapper.vm.userOrganisations).toEqual(
      organisationFixtures.slice(0, 2),
    );
    expect(wrapper.vm.organisationsTypes).toEqual([
      { id: 1, name: "Research" },
      { id: 2, name: "Company" },
    ]);
    const tables = wrapper.findAllComponents({ name: "VDataTable" });
    expect(tables).toHaveLength(2);
    expect(tables[0].props("itemsPerPage")).toBe(5);
    expect(tables[1].props("itemsPerPage")).toBe(5);
    expect(wrapper.vm.footer).toEqual({ "items-per-page-options": [5] });
    expect(tables[0].text()).toContain("Research, Company");
    expect(tables[1].text()).toContain("Organisation four");
    expect(tables[1].find('a[href="/organisations/4"]').exists()).toBe(true);
    expect(
      tables[1].find('a[href="https://four.example.org"]').attributes(),
    ).toMatchObject({ target: "_blank", rel: "noopener" });
  });

  it("binds table searches and available-organisation selection", async () => {
    await wrapper.setData({
      userOrganisations: Array.from({ length: 11 }, (_, index) => ({
        ...structuredClone(organisationFixtures[0]),
        id: index + 100,
        name: `Organisation ${index}`,
      })),
    });
    const inputs = wrapper.findAll('[aria-label="Search"]');
    expect(inputs).toHaveLength(2);
    await inputs[0].setValue("Research");
    await inputs[1].setValue("Organisation 10");
    const tables = wrapper.findAllComponents({ name: "VDataTable" });
    expect(tables[0].props("search")).toBe("Research");
    expect(tables[1].props("search")).toBe("Organisation 10");
    await tables[0].vm.$emit("update:modelValue", [organisationFixtures[2]]);
    expect(wrapper.vm.selected).toEqual([organisationFixtures[2]]);
  });

  it("adds an available organisation through the row action and persists the public profile", async () => {
    const available = wrapper.findAllComponents({ name: "VDataTable" })[0];
    await available.findAll("button")[2].trigger("click");
    await flushPromises();
    expect(wrapper.vm.userOrganisations.map((item) => item.id)).toEqual([
      4, 1, 7,
    ]);
    expect(
      mocks.editPublicUserStub.calledOnceWithExactly(
        { id: "1", organisation_ids: [4, 1, 7] },
        123,
      ),
    ).toBe(true);
    expect(mocks.editUserStub.called).toBe(false);
    expect(wrapper.vm.successTerm).toBe("added");
    expect(wrapper.text()).toContain(
      "Successfully added the organisation in your list!",
    );
    const snackbar = wrapper
      .findAllComponents({ name: "VSnackbar" })
      .find((item) => item.attributes("color") === "success");
    await snackbar.vm.$emit("update:modelValue", false);
    expect(wrapper.vm.showSuccessAction).toBe(false);
  });

  it("rejects duplicate membership without sending an update request", async () => {
    const available = wrapper.findAllComponents({ name: "VDataTable" })[0];
    await available.findAll("button")[0].trigger("click");
    await flushPromises();
    expect(wrapper.vm.userOrganisations.map((item) => item.id)).toEqual([4, 1]);
    expect(mocks.editPublicUserStub.called).toBe(false);
    expect(mocks.editUserStub.called).toBe(false);
    expect(wrapper.text()).toContain(
      "You have already added this organisation in your list!",
    );
    const snackbar = wrapper
      .findAllComponents({ name: "VSnackbar" })
      .find((item) => item.attributes("color") === "error");
    await snackbar.vm.$emit("update:modelValue", false);
    expect(wrapper.vm.showFailedAction).toBe(false);
  });

  it("cancels membership deletion without changing the organisation list", async () => {
    const table = wrapper.findAllComponents({ name: "VDataTable" })[1];
    await table.find("button").trigger("click");
    expect(wrapper.vm.dialogDelete).toBe(true);
    expect(wrapper.vm.selectedOrganisationID).toBe(4);
    await table
      .findAll("button")
      .find((item) => item.text() === "Cancel")
      .trigger("click");
    expect(wrapper.vm.dialogDelete).toBe(false);
    expect(wrapper.vm.selectedOrganisationID).toBe(-1);
    expect(wrapper.vm.userOrganisations).toEqual(
      organisationFixtures.slice(0, 2),
    );
    expect(mocks.editPublicUserStub.called).toBe(false);
    await table.find("button").trigger("click");
    await table
      .findComponent({ name: "VDialog" })
      .vm.$emit("update:modelValue", false);
    expect(wrapper.vm.dialogDelete).toBe(false);
  });

  it("confirms membership deletion through the dialog and shows success", async () => {
    let finishUpdate;
    mocks.editPublicUserStub.callsFake(
      () =>
        new Promise((resolve) => {
          finishUpdate = resolve;
        }),
    );
    const table = wrapper.findAllComponents({ name: "VDataTable" })[1];
    await table.find("button").trigger("click");
    await table
      .findAll("button")
      .find((item) => item.text() === "OK")
      .trigger("click");
    expect(
      mocks.editPublicUserStub.calledOnceWithExactly(
        { id: "1", organisation_ids: [1] },
        123,
      ),
    ).toBe(true);
    expect(wrapper.vm.dialogDelete).toBe(true);
    finishUpdate({ error: false });
    await flushPromises();
    expect(wrapper.vm.dialogDelete).toBe(false);
    expect(wrapper.vm.selectedOrganisationID).toBe(-1);
    expect(wrapper.vm.userOrganisations).toEqual([organisationFixtures[1]]);
    expect(wrapper.text()).toContain(
      "Successfully deleted the organisation in your list!",
    );
  });

  it("persists private-profile membership through updateUser", async () => {
    $route.name = "Edit profile";
    $route.params = {};
    $route.path = "/accounts/profile";
    await flushPromises();
    const available = wrapper.findAllComponents({ name: "VDataTable" })[0];
    await available.findAll("button")[2].trigger("click");
    await flushPromises();
    expect(
      mocks.editUserStub.calledOnceWithExactly(
        { id: 1, organisation_ids: [4, 1, 7] },
        123,
      ),
    ).toBe(true);
    expect(mocks.editPublicUserStub.called).toBe(false);
    expect(mocks.getUserStub.called).toBe(true);
    expect(wrapper.vm.userOrganisations.map((item) => item.id)).toEqual([
      4, 1, 7,
    ]);
  });

  it.each([
    [true, 1, false, "EditPublicProfile", true],
    [true, 2, false, "EditPublicProfile", false],
    [true, 2, true, "EditPublicProfile", true],
    [true, 2, false, "Edit profile", true],
    [true, 1, true, "PublicProfile", false],
    [false, 1, true, "EditPublicProfile", false],
  ])(
    "checks permissions for loggedIn=%s, viewer=%s, superCurator=%s, route=%s",
    async (isLoggedIn, id, isSuperCurator, name, allowed) => {
      $store.state.users.user = () => ({
        ...originalUserFn(),
        isLoggedIn,
        id,
        is_super_curator: isSuperCurator,
      });
      $route.name = name;
      wrapper.vm.viewerCanManipulate();
      await flushPromises();
      expect(wrapper.vm.userCanEditOrganisation).toBe(allowed);
      expect(wrapper.findAllComponents({ name: "VDataTable" })).toHaveLength(
        allowed ? 2 : 1,
      );
      if (!allowed) {
        const table = wrapper.findComponent({ name: "VDataTable" });
        expect(table.props("headers").map((item) => item.value)).toEqual([
          "name",
          "organisationTypes",
          "homepage",
        ]);
        expect(wrapper.find('button[icon="fas fa-plus"]').exists()).toBe(false);
      }
    },
  );

  it("reloads organisations and permissions when the route changes", async () => {
    const load = vi.spyOn(wrapper.vm, "loadUserOrganisationData");
    const permissions = vi.spyOn(wrapper.vm, "viewerCanManipulate");
    graphMockValue.user.organisations = structuredClone([
      organisationFixtures[2],
    ]);
    $route.params = { id: "2" };
    $route.path = "/accounts/2/edit";
    await flushPromises();
    expect(load).toHaveBeenCalledOnce();
    expect(permissions).toHaveBeenCalledOnce();
    expect(getPublicUserQuery.queryParam.id).toBe(2);
    expect(wrapper.vm.userOrganisations).toEqual([organisationFixtures[2]]);
  });

  it("reacts to login and logout through the computed user state", async () => {
    const load = vi.spyOn(wrapper.vm, "loadUserOrganisationData");
    $store.state.users.user = () => ({
      ...originalUserFn(),
      isLoggedIn: false,
    });
    await flushPromises();
    expect(wrapper.vm.userIsLoggedIn).toBe(false);
    expect(wrapper.vm.userCanEditOrganisation).toBe(false);
    expect(load).toHaveBeenCalledTimes(1);
    $store.state.users.user = originalUserFn;
    await flushPromises();
    expect(wrapper.vm.userIsLoggedIn).toBe(true);
    expect(wrapper.vm.userCanEditOrganisation).toBe(true);
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("shows the empty state when the public user response is absent", async () => {
    mocks.graphMock.withArgs(getPublicUserQuery).returns({ user: null });
    await wrapper.vm.loadUserOrganisationData();
    await flushPromises();
    expect(wrapper.vm.userOrganisations).toEqual([]);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.text()).toContain(
      "You are not a member of any organisations.",
    );
  });

  it("renders an available organisation even when its types are absent", async () => {
    await wrapper.setData({
      allOrganisations: [
        { id: 8, name: "No types", homepage: "https://eight.example.org" },
      ],
    });
    const table = wrapper.findAllComponents({ name: "VDataTable" })[0];
    expect(table.text()).toContain("No types");
    expect(table.find('a[href="/organisations/8"]').exists()).toBe(true);
  });

  it("binds the new-organisation form and cancels without a request", async () => {
    await wrapper.find('button[icon="fas fa-plus"]').trigger("click");
    expect(wrapper.vm.AddNewOrganisation.show).toBe(true);
    await wrapper
      .find('[aria-label="Organisation Name"]')
      .setValue("New organisation");
    await wrapper
      .find('[aria-label="Organisation Homepage"]')
      .setValue("https://new.example.org");
    await wrapper
      .findComponent({ name: "VAutocomplete" })
      .vm.$emit("update:modelValue", [{ id: 1, name: "Research" }]);
    const save = wrapper
      .findAll("button")
      .find((item) => item.text() === "Save new organisation");
    expect(save.attributes("disabled")).toBeDefined();
    await wrapper
      .findComponent({ name: "VForm" })
      .vm.$emit("update:modelValue", true);
    expect(save.attributes("disabled")).toBeUndefined();
    expect(wrapper.vm.AddNewOrganisation.data).toEqual({
      name: "New organisation",
      homepage: "https://new.example.org",
      organisation_type_ids: [{ id: 1, name: "Research" }],
    });
    await wrapper
      .findAll("button")
      .find((item) => item.text() === "Cancel")
      .trigger("click");
    expect(wrapper.vm.AddNewOrganisation.show).toBe(false);
    expect(mocks.restMock.called).toBe(false);
    await wrapper.find('button[icon="fas fa-plus"]').trigger("click");
    await wrapper
      .findAllComponents({ name: "VDialog" })[1]
      .vm.$emit("update:modelValue", false);
    expect(wrapper.vm.AddNewOrganisation.show).toBe(false);
  });

  it.each([
    [
      { response: { data: "Organisation name is already used" } },
      "Organisation name is already used",
    ],
    [{ message: "Failed" }, "An error occurred"],
  ])("shows an organisation creation error %#", async (error, message) => {
    mocks.restMock.resolves({ data: { error } });
    await wrapper.find('button[icon="fas fa-plus"]').trigger("click");
    await wrapper
      .find('[aria-label="Organisation Name"]')
      .setValue("New organisation");
    await wrapper
      .find('[aria-label="Organisation Homepage"]')
      .setValue("https://new.example.org");
    await wrapper
      .findComponent({ name: "VAutocomplete" })
      .vm.$emit("update:modelValue", [{ id: 1, name: "Research" }]);
    await wrapper
      .findComponent({ name: "VForm" })
      .vm.$emit("update:modelValue", true);
    await wrapper
      .findAll("button")
      .find((item) => item.text() === "Save new organisation")
      .trigger("click");
    await flushPromises();
    expect(wrapper.findComponent({ name: "VAlert" }).text()).toBe(message);
    expect(wrapper.findComponent({ name: "VAlert" }).props("type")).toBe(
      "error",
    );
    expect(wrapper.vm.AddNewOrganisation.show).toBe(true);
    expect(mocks.editPublicUserStub.called).toBe(false);
    expect(mocks.restMock.firstCall.args[0].data.organisation).toEqual({
      name: "New organisation",
      homepage: "https://new.example.org",
      organisation_type_ids: [1],
    });
  });

  it("formats an empty organisation type list", () => {
    expect(wrapper.vm.objToList([])).toBe("");
  });
});
