import { flushPromises, shallowMount } from "@vue/test-utils";
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
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import Organisations from "@/components/Editor/Organisations/Organisations.vue";
import RestClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import getGrantsQuery from "@/lib/GraphClient/queries/Organisations/getGrants.json";
import getOrganisationsQuery from "@/lib/GraphClient/queries/Organisations/getOrganisations.json";
import getOrganisationsTypesQuery from "@/lib/GraphClient/queries/Organisations/getOrganisationTypes.json";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import userStore from "@/store/users.js";

import {
  VBtnStub,
  VFormStub,
  VOverlayStub,
  VSwitchStub,
} from "../../../../stubs/index.js";

const sinon = require("sinon");

const vuetify = createVuetify();

let organisation = {
  organisation: {
    name: "tester",
  },
  id: 1,
};
recordStore.state.sections = {
  organisations: {
    error: false,
    data: [organisation],
    initialData: [JSON.parse(JSON.stringify(organisation))],
    changes: 0,
    message: null,
  },
};
recordStore.state.currentRecord = { fairsharingRecord: { id: 123 } };
userStore.state.user().credentials.token = 123;
const $store = new Vuex.Store({
  modules: {
    editor: editorStore,
    record: recordStore,
    users: userStore,
  },
});
let $route = { path: "/123/edit", params: { id: 123 } };
const $router = { push: vi.fn() };

describe("Edit -> Organisations.vue", function () {
  let wrapper;
  let graphStub;
  let restStub;

  beforeAll(async () => {
    graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
    graphStub.returns({
      fairsharingRecord: {
        organisationLinks: [],
      },
    });
    graphStub.withArgs(getOrganisationsTypesQuery).returns({
      searchOrganisationTypes: [{ id: 1, name: "Government body" }],
    });
    graphStub.withArgs(getOrganisationsQuery).returns({
      searchOrganisations: [
        {
          homepage: "test",
          id: 1,
          name: "anOrganisation",
          types: ["Government body"],
          urlForLogo: null,
        },
      ],
    });
    graphStub.withArgs(getGrantsQuery).returns({
      searchGrants: [{ id: 1, name: "aGrant", description: null }],
    });
  });

  beforeEach(async () => {
    $store.state.users.user = () => ({ credentials: { token: 123 } });
    $store.state.record.sections = {
      organisations: {
        error: false,
        data: [structuredClone(organisation)],
        initialData: [structuredClone(organisation)],
        changes: 0,
        message: null,
      },
    };
    $store.state.record.editOrganisationLink = { showOverlay: false, data: {} };
    graphStub.resetHistory();
    wrapper = await shallowMount(Organisations, {
      vuetify,
      mocks: { $store, $route, $router },
      stubs: {
        VBtn: VBtnStub,
        VForm: VFormStub,
        VOverlay: VOverlayStub,
        VSwitch: VSwitchStub,
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.restoreAllMocks();
    if (restStub && restStub.restore) {
      restStub.restore();
      restStub = null;
    }
    vi.clearAllMocks();
  });

  afterAll(async () => {
    sinon.restore();
  });

  it("can be mounted", async () => {
    expect(wrapper.vm.$options.name).toMatch("Organisations");
  });

  it("can compute changes when adding, editing or removing a link", async () => {
    await wrapper.vm.organisationLinks.push({
      organisation: {
        name: "test",
      },
    });

    expect(wrapper.vm.sections.organisations.changes).toBe(1);
    // wrapper.vm.organisationLinks[0].organisation.name = "another name";
    await wrapper.vm.organisationLinks.push({
      organisation: {
        name: "another name",
      },
    });
    expect(wrapper.vm.sections.organisations.changes).toBe(2);
    wrapper.vm.removeRelation(0);
    expect(wrapper.vm.sections.organisations.changes).toBe(2);
  });

  it("can open the overlay", async () => {
    await wrapper.vm.showEditOverlay(null);
    expect($store.state.record.editOrganisationLink.showOverlay).toBe(true);
    expect($store.state.record.editOrganisationLink.data).toStrictEqual({});
    expect($store.state.editor.organisationsTypes).toStrictEqual([
      { id: 1, name: "Government body" },
    ]);
    expect($store.state.editor.organisations).toStrictEqual([
      {
        homepage: "test",
        id: 1,
        name: "anOrganisation",
        types: ["Government body"],
        urlForLogo: null,
      },
    ]);
    expect($store.state.editor.grants).toStrictEqual([
      { id: 1, name: "aGrant", description: null },
    ]);
    await wrapper.vm.showEditOverlay(0);
    expect($store.state.record.editOrganisationLink).toStrictEqual({
      showOverlay: true,
      id: 0,
      data: organisation,
    });
  });

  it("can save the current data", async () => {
    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({ data: {} });
    $store.state.record.sections.organisations = {
      error: false,
      data: [
        organisation,
        {
          organisation: {
            name: "another name",
          },
          grant: { id: 123 },
          id: 2,
        },
      ],
      initialData: [
        JSON.parse(JSON.stringify(organisation)),
        {
          organisation: {
            name: "another name",
          },
          id: 2,
        },
      ],
      changes: 0,
      message: null,
    };
    wrapper.vm.removeRelation(0);
    wrapper.vm.organisationLinks[0].organisation.name = "changing name";
    wrapper.vm.organisationLinks.push({
      organisation: { name: "a third organisation" },
    });
    await wrapper.vm.saveRecord(false, { textContent: "Save and continue" });
    expect($router.push).toHaveBeenCalledTimes(0);
    await wrapper.vm.saveRecord(true, { textContent: "Save and exit" });
    expect($router.push).toHaveBeenCalledTimes(1);
    expect($router.push).toHaveBeenCalledWith({ path: "/123" });
    $store.state.record.sections = {
      organisations: {
        error: false,
        data: [organisation],
        initialData: [JSON.parse(JSON.stringify(organisation))],
        changes: 0,
        message: null,
      },
    };
  });

  it("can handle error upon saving the data", async () => {
    wrapper.vm.removeRelation(0);
    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({ data: { error: "I am an error" } });
    await wrapper.vm.saveRecord(false, { textContent: "Save and continue" });
    expect($store.state.record.sections.organisations.error).toBe(true);
  });

  it("tracks edits and restores the change count when reverted", async () => {
    wrapper.vm.organisationLinks[0].organisation.name = "Edited";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.sections.organisations.changes).toBe(1);
    wrapper.vm.organisationLinks[0].organisation.name = "tester";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.sections.organisations.changes).toBe(0);
    await wrapper
      .findAll("button")
      .find((button) => button.text().includes("fa-trash"))
      .trigger("click");
    expect(wrapper.vm.organisationLinks).toEqual([]);
    expect(wrapper.vm.sections.organisations.changes).toBe(1);
  });

  it("renders organisation details and updates its lead status through the switch", async () => {
    Object.assign(wrapper.vm.organisationLinks[0], {
      organisation: {
        name: "University",
        homepage: "https://example.org",
        types: ["Academic", "Nonprofit"],
      },
      relation: "maintains",
      isLead: false,
      grant: { name: "Research grant" },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("University");
    expect(wrapper.text()).toContain("Academic, Nonprofit");
    expect(wrapper.text()).toContain("Research grant");
    await wrapper.get('input[type="checkbox"]').setValue(true);
    expect(wrapper.vm.organisationLinks[0].isLead).toBe(true);
    expect(
      wrapper
        .findAll("v-card-stub")
        .some((card) => card.classes().includes("bg-green-lighten-3")),
    ).toBe(true);
    wrapper.vm.organisationLinks[0].organisation.name = "";
    await wrapper.vm.$nextTick();
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(false);
  });

  it("opens add and edit overlays through clicks, loading options only once", async () => {
    await wrapper.get(".newRel").trigger("click");
    await flushPromises();
    expect(wrapper.vm.initialized).toBe(true);
    expect(wrapper.vm.loading).toBe(false);
    expect($store.state.record.editOrganisationLink).toEqual({
      showOverlay: true,
      data: {},
    });
    const calls = graphStub.callCount;
    await wrapper
      .findAll("button")
      .find((button) => button.text().includes("fa-pen"))
      .trigger("click");
    await flushPromises();
    expect(graphStub.callCount).toBe(calls);
    expect($store.state.record.editOrganisationLink).toEqual({
      showOverlay: true,
      id: 0,
      data: organisation,
    });
    $store.state.record.editOrganisationLink.data.organisation.name = "Unsaved";
    expect(wrapper.vm.organisationLinks[0].organisation.name).toBe("tester");
  });

  it("updates the form and overlay models", async () => {
    wrapper.findComponent(VFormStub).vm.$emit("update:modelValue", true);
    wrapper.findComponent(VOverlayStub).vm.$emit("update:modelValue", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.formValid).toBe(true);
    expect(wrapper.vm.loading).toBe(true);
  });

  it.each(["Save and continue", "Save and exit"])(
    "saves from the %s button",
    async (label) => {
      let finish;
      const update = vi
        .spyOn(wrapper.vm, "updateOrganisations")
        .mockImplementation(
          () =>
            new Promise((resolve) => {
              finish = resolve;
            }),
        );
      const save = wrapper
        .findAll("button")
        .find((button) => button.text() === label);
      await save.trigger("click");
      expect(update).toHaveBeenCalledWith(123);
      expect(wrapper.vm.continueLoader).toBe(label === "Save and continue");
      expect(wrapper.vm.exitLoader).toBe(label === "Save and exit");
      finish();
      await flushPromises();
      expect(wrapper.vm.continueLoader).toBe(false);
      expect(wrapper.vm.exitLoader).toBe(false);
      if (label === "Save and exit")
        expect($router.push).toHaveBeenCalledWith({ path: "/123" });
      else expect(wrapper.vm.$scrollTo).toHaveBeenCalledWith("#mainHeader");
    },
  );

  it("reports an API failure and resets the Save and exit loader", async () => {
    restStub = sinon
      .stub(RestClient.prototype, "executeQuery")
      .returns({ data: { error: "Save failed" } });
    await wrapper
      .findAll("button")
      .find((button) => button.text() === "Save and exit")
      .trigger("click");
    await flushPromises();
    expect(wrapper.vm.sections.organisations.error).toBe(true);
    expect(wrapper.vm.exitLoader).toBe(false);
  });
});
