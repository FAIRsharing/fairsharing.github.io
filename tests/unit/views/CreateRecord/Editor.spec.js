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
import Vuex from "vuex";
import RESTClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import userStore from "@/store/users.js";
import CreateRecord from "@/views/CreateRecord/Editor.vue";
import metaTemplate from "../../../fixtures/metaTemplate.json";
import {
  VBtnStub,
  VDialogStub,
  VRouterLinkStub,
  VSlotStub,
  VTabsStub,
  VTabsWindowItemStub,
  VTabsWindowStub,
} from "../../../stubs/index.js";

const sinon = require("sinon");
const initialRecordState = cloneDeep(recordStore.state);
const initialEditorState = cloneDeep(editorStore.state);

const $store = new Vuex.Store({
  modules: {
    record: recordStore,
    users: userStore,
    editor: editorStore,
  },
});
$store.state.users.user = function () {
  return { credentials: { token: "123" } };
};
let $route = { params: { id: "123" } };
const $router = { push: vi.fn() };
let graphStub;
let restStub;
const mountGlobal = {
  plugins: [$store],
  mocks: { $route, $router },
  stubs: {
    VContainer: VSlotStub,
    VAlert: VSlotStub,
    VRow: VSlotStub,
    VCol: VSlotStub,
    VToolbar: VSlotStub,
    VToolbarTitle: VSlotStub,
    VCard: VSlotStub,
    VCardTitle: VSlotStub,
    VCardText: VSlotStub,
    VCardActions: VSlotStub,
    VSpacer: true,
    VDialog: VDialogStub,
    VBtn: VBtnStub,
    VTabs: VTabsStub,
    VTab: {
      props: ["disabled"],
      template: '<button :disabled="disabled"><slot /></button>',
    },
    VTabsWindow: VTabsWindowStub,
    VTabsWindowItem: VTabsWindowItemStub,
    "router-link": VRouterLinkStub,
  },
};

describe("Editor.vue", function () {
  let wrapper;

  beforeAll(() => {
    let returnedData = structuredClone(metaTemplate.data);
    graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
    graphStub.withArgs(sinon.match.any).returns({
      fairsharingRecord: returnedData,
    });
    restStub = sinon.stub(RESTClient.prototype, "executeQuery");
    restStub.withArgs(sinon.match.any).returns({
      data: { id: 1 },
    });
  });
  beforeEach(() => {
    wrapper = null;
    Object.assign($store.state.record, cloneDeep(initialRecordState));
    Object.assign($store.state.editor, cloneDeep(initialEditorState));
    $store.state.users.user = () => ({ credentials: { token: "123" } });
    $route.params = { id: "123" };
    $router.push.mockReset();
    graphStub.resetBehavior();
    graphStub.resetHistory();
    graphStub.callsFake(() => ({
      fairsharingRecord: { ...structuredClone(metaTemplate.data), id: 123 },
    }));
    restStub.resetBehavior();
    restStub.resetHistory();
    restStub.returns({ data: { id: 1 } });
  });

  afterEach(async () => {
    await flushPromises();
    if (wrapper?.exists()) wrapper.unmount();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  afterAll(() => {
    graphStub.restore();
    restStub.restore();
  });

  it("can be instantiated", async () => {
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    expect(wrapper.vm.$options.name).toMatch("Editor");
    expect(wrapper.vm.userToken).toBe("123");
    $store.state.users.user = () => {
      return {};
    };
    expect(wrapper.vm.userToken).toBe(null);
    let isDisabled = wrapper.vm.isDisabled("Additional Information");
    expect(isDisabled).toBe(true);
    isDisabled = wrapper.vm.isDisabled("Another tab");
    expect(isDisabled).toBe(false);
    await flushPromises();
    wrapper.vm.hasLoaded = false;
    wrapper.unmount();
  });

  it("can clean the store on destroy", async () => {
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    wrapper.vm.hasLoaded = false;
    wrapper.unmount();
    expect(editorStore.state.countries).toBe(null);
    expect(recordStore.state.sections.dataAccess).toBe(undefined);
  });

  it("can deal with errors", async () => {
    $route.params.id = "FAIRsharing.abcde";
    restStub.restore();
    restStub = sinon.stub(RESTClient.prototype, "executeQuery");
    restStub.withArgs(sinon.match.any).returns({ data: { error: "error" } });
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    $store.state.users.user = function () {
      return { credentials: { token: "123" } };
    };
    await wrapper.vm.getData();
    expect(wrapper.vm.error).toBe(true);
  });

  it("reloads data correctly", async () => {
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    wrapper.vm.confirmPanels[0].show = true;
    await wrapper.vm.confirmPanels[0].method();
    expect(wrapper.vm.confirmPanels[0].show).toBe(false);
  });

  it("can prevent leaving the route", async () => {
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    vi.stubGlobal(
      "confirm",
      vi.fn(() => true),
    );
    const beforeRouteLeave = wrapper.vm.$options.beforeRouteLeave;
    let nextFun = vi.fn();
    beforeRouteLeave.call(wrapper.vm, "toObj", "fromObj", nextFun);
    expect(nextFun).toHaveBeenCalledTimes(1);
    $store.state.record.sections.generalInformation.changes = 1;
    beforeRouteLeave.call(wrapper.vm, "toObj", "fromObj", nextFun);
    expect(nextFun).toHaveBeenCalledTimes(2);
    window.confirm.mockReturnValue(false);
    beforeRouteLeave.call(wrapper.vm, "toObj", "fromObj", nextFun);
    expect(nextFun).toHaveBeenCalledTimes(2);
    expect(window.confirm).toHaveBeenLastCalledWith(
      "Are you sure you want to leave this page? You have 1 unsaved modifications.",
    );
  });

  it("can load without support links", async () => {
    let returnedData = structuredClone(metaTemplate.data);
    returnedData.metadata.support_links = null;
    graphStub.returns({
      fairsharingRecord: returnedData,
    });
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    expect(wrapper.vm.$options.name).toMatch("Editor");
  });

  it("renders the loaded record title, exit link and enabled sections", async () => {
    const data = { ...structuredClone(metaTemplate.data), id: 123 };
    data.metadata.name = "Editable resource";
    graphStub.returns({ fairsharingRecord: data });
    restStub.returns({ data: { properties: {} } });
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    expect(wrapper.vm.hasLoaded).toBe(true);
    expect(wrapper.vm.error).toBe(false);
    expect(wrapper.text()).toContain("Editable resource (123)");
    expect(wrapper.find('a[href="/123"]').text()).toBe("Exit editing");
    expect(
      wrapper.find('a[href*="how-to-update-a-record"]').attributes("target"),
    ).toBe("_blank");
    expect(wrapper.findComponent({ name: "EditAdditionalInfo" }).exists()).toBe(
      true,
    );
    expect(wrapper.vm.isDisabled("Additional Information")).toBe(false);
    expect($store.state.record.newRecord).toBe(false);
  });

  it("shows Unauthorized when the permission API rejects editing", async () => {
    restStub.returns({ data: { error: "Permission denied" } });
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    expect(wrapper.vm.hasLoaded).toBe(true);
    expect(wrapper.vm.error).toBe(true);
    expect(wrapper.findComponent({ name: "Unauthorized" }).exists()).toBe(true);
    expect(wrapper.find('[data-test="v-tabs"]').exists()).toBe(false);
  });

  it("finishes loading without fetching when there is no user token", async () => {
    $store.state.users.user = () => ({});
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    expect(wrapper.vm.userToken).toBeNull();
    expect(wrapper.vm.hasLoaded).toBe(true);
    expect(graphStub.called).toBe(false);
    expect(restStub.called).toBe(false);
  });

  it("reloads data when the user token changes", async () => {
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    const dispatch = vi.spyOn($store, "dispatch");
    $store.state.users.user = () => ({
      credentials: { token: "replacement-token" },
    });
    await flushPromises();
    expect(dispatch).toHaveBeenCalledWith("record/fetchRecord", {
      id: "123",
      token: "replacement-token",
    });
    expect(dispatch).toHaveBeenCalledWith("editor/getAllowedFields", {
      type: "standard",
      token: "replacement-token",
    });
    expect(wrapper.vm.hasLoaded).toBe(true);
  });

  it("normalizes DOI record identifiers and redirects to the numeric edit URL", async () => {
    $route.params.id = "FAIRsharing.example";
    const dispatch = vi.spyOn($store, "dispatch");
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    expect(dispatch).toHaveBeenCalledWith("record/fetchRecord", {
      id: "10.25504/FAIRsharing.example",
      token: "123",
    });
    expect($router.push).toHaveBeenCalledWith({ path: "/123/edit" });
    expect(wrapper.vm.recordId).toBe(123);
  });

  it("falls back to the route ID when record metadata is unavailable", async () => {
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    await wrapper.setData({ hasLoaded: false });
    $store.state.record.currentRecord = null;
    expect(wrapper.vm.recordId).toBe("123");
  });

  it.each([null, {}, { properties: {} }])(
    "enables additional information only when properties are allowed: %j",
    async (allowedFields) => {
      wrapper = shallowMount(CreateRecord, { global: mountGlobal });
      await flushPromises();
      $store.state.editor.allowedFields = allowedFields;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isDisabled("Additional Information")).toBe(
        !allowedFields || !("properties" in allowedFields),
      );
      expect(wrapper.vm.isDisabled("Publications")).toBe(false);
      expect(
        wrapper.findComponent({ name: "EditAdditionalInfo" }).exists(),
      ).toBe(Boolean(allowedFields && "properties" in allowedFields));
    },
  );

  it("shows change counts and synchronizes both tab v-model bindings", async () => {
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    $store.state.record.sections.generalInformation.changes = 2;
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain("(2)");
    wrapper.findComponent(VTabsStub).vm.$emit("update:modelValue", 2);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.selectedTab).toBe(2);
    expect(wrapper.findComponent(VTabsWindowStub).props("modelValue")).toBe(2);
    wrapper.findComponent(VTabsWindowStub).vm.$emit("update:modelValue", 1);
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent(VTabsStub).props("modelValue")).toBe(1);
  });

  it("cancels reload through its button and dialog v-model", async () => {
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    const calls = graphStub.callCount;
    await wrapper.find('[id="Reload data_button"]').trigger("click");
    expect(wrapper.text()).toContain(
      "This will reload your record from the database",
    );
    await wrapper
      .findAll("button")
      .find((b) => b.text() === "No, keep editing")
      .trigger("click");
    expect(wrapper.vm.confirmPanels[0].show).toBe(false);
    await wrapper.find('[id="Reload data_button"]').trigger("click");
    wrapper.findComponent(VDialogStub).vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.confirmPanels[0].show).toBe(false);
    expect(graphStub.callCount).toBe(calls);
  });

  it("confirms reload through the dialog and fetches the current record without a token", async () => {
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    const dispatch = vi.spyOn($store, "dispatch");
    await wrapper.find('[id="Reload data_button"]').trigger("click");
    await wrapper
      .findAll("button")
      .find((b) => b.text() === "Yes")
      .trigger("click");
    await flushPromises();
    expect(dispatch).toHaveBeenCalledWith("record/fetchRecord", { id: 123 });
    expect(wrapper.vm.confirmPanels[0].show).toBe(false);
  });

  it("propagates a record API rejection before requesting edit permissions", async () => {
    wrapper = shallowMount(CreateRecord, { global: mountGlobal });
    await flushPromises();
    graphStub.rejects(new Error("Record unavailable"));
    restStub.resetHistory();
    await expect(wrapper.vm.getData()).rejects.toThrow("Record unavailable");
    expect(restStub.called).toBe(false);
    expect(wrapper.vm.hasLoaded).toBe(false);
  });
});
