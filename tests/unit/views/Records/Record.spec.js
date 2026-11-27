import {flushPromises, shallowMount} from "@vue/test-utils";
import sinon from "sinon";
import {createVuetify} from "vuetify";
import Vuex from "vuex";
import {reactive} from "vue";
import RESTClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import light from "@/plugins/theme";
import introspection from "@/store/introspector.js";
import record from "@/store/recordData.js";
import users from "@/store/users.js";
import Record from "@/views/Records/Record.vue";
import {VBtnStub, VDialogStub, VOverlayStub} from "../../../stubs/index.js";

vi.mock("vike-vue/useData", () => ({
  useData: () => ({}),
}));

// Initializing store states and getters
users.state.user = function () {
  return {
    isLoggedIn: true,
    id: 123,
    credentials: { token: 123, username: 123 },
    watchedRecords: [1],
  };
};
record.state.currentRecord.fairsharingRecord = {
  registry: "Standard",
  maintainers: [{ username: 123 }],
  reviews: [],
  doi: "abc123",
};
record.getters = {
  getField: () => () => {
    return [{ username: 123 }];
  },
};
let $store = new Vuex.Store({
    modules: {
      record: record,
      users: users,
      introspection: introspection,
    },
  }),
  $route = {
    path: "/",
    params: { id: "980190962" },
  };

$store.state.users.user = function () {
  return { isLoggedIn: false };
};

const $router = { push: vi.fn(), replace: vi.fn() };

$router.go = vi.fn();
//-- making a mock div element
const element = document.createElement("div");
element.id = "hashtag";
document.body.appendChild(element);

//-- making a mock div element
const element2 = document.createElement("div");
element2.id = "a";
document.body.appendChild(element2);

// Preparing mocks
let mocks = {
  graphMock: null,
  restMock: null,
  canEditStub: null,
  canClaimStub: null,
  claimRecord: null,
  removeMaintainer: null,
  restore: function (mockKey) {
    if (this[mockKey] && this[mockKey].restore) {
      this[mockKey].restore();
      this[mockKey] = null;
    }
  },
  restoreAll: function () {
    [
      "graphMock",
      "restMock",
      "canEditStub",
      "canClaimStub",
      "claimRecord",
      "removeMaintainer",
      "metadataFields",
      "changeWatcher",
      "deleteMock",
    ].forEach((mockKey) => this.restore(mockKey));
  },
  setMock: function (mockKey, targetClass, targetMethod, returnedValue) {
    this.restore(mockKey);
    this[mockKey] = sinon.stub(targetClass, targetMethod);
    this[mockKey].returns(returnedValue);
  },
  throwMock: function (mockKey, targetClass, targetMethod) {
    this.restore(mockKey);
    this[mockKey] = sinon
      .stub(targetClass, targetMethod)
      .throws(new Error("error"));
  },
};

describe("Record.vue", function () {
  let wrapper,
    anotherWrapper,
    vuetify,
    graphMockValue = {
      fairsharingRecord: {
        id: 980190962,
        abbreviation: "IAT",
        name: "I Am a Test",
        licences: [
          {
            name: "test",
            url: "https://example.com",
          },
        ],
        metadata: {
          contacts: [],
          support_links: [],
        },
        domains: [],
        subjects: [],
        taxonomies: [],
        userDefinedTags: [],
        reviews: [],
        registry: "Standard",
      },
    };

  beforeAll(async () => {
    mocks.setMock(
      "graphMock",
      GraphClient.prototype,
      "executeQuery",
      graphMockValue,
    );
    mocks.setMock("canEditStub", RESTClient.prototype, "canEdit", true);
    mocks.setMock("canClaimStub", RESTClient.prototype, "canClaim", true);
    mocks.setMock("claimRecord", RESTClient.prototype, "claimRecord", true);
    mocks.setMock(
      "removeMaintainer",
      RESTClient.prototype,
      "removeMaintainer",
      true,
    );
    mocks.setMock(
      "metadataFields",
      RESTClient.prototype,
      "extraMetadataFields",
      true,
    );
    mocks.setMock("changeWatcher", RESTClient.prototype, "changeWatcher", {
      message: "success",
    });

    vuetify = createVuetify({
      theme: {
        defaultTheme: "fairSharingTheme",
        themes: { fairSharingTheme: light },
        options: {
          customProperties: true,
        },
      },
    });
  });
  afterAll(() => {
    mocks.restoreAll();
  });
  afterEach(() => {
    wrapper?.unmount();
    anotherWrapper?.unmount();
    anotherWrapper = null;
    vi.restoreAllMocks();
    if (vi.isFakeTimers()) {
      vi.clearAllTimers();
      vi.useRealTimers();
    }
  });
  beforeEach(async () => {
    if (!mocks.graphMock) {
      mocks.setMock("graphMock", GraphClient.prototype, "executeQuery", {
        fairsharingRecord: record.state.currentRecord.fairsharingRecord,
      });
    }
    wrapper = await shallowMount(Record, {
      mocks: { $route, $store, $router },
      vuetify,
    });
  });

  it("Testing currentRoute & getTitle with a integer style", () => {
    expect(wrapper.vm.$options.name).toMatch("Record");
    expect(wrapper.vm.getTitle).toBe("FAIRsharing | 980190962");
    expect(wrapper.vm.currentRoute).toBe("980190962");
  });

  it("can be mounted with a target", async () => {
    anotherWrapper = await shallowMount(Record, {
      mocks: { $route, $store, $router },
      vuetify,
      props: { target: 123 },
    });
    expect(anotherWrapper.vm.$options.name).toMatch("Record");
    expect(anotherWrapper.vm.getTitle).toBe("FAIRsharing | 123");
    expect(anotherWrapper.vm.currentRoute).toBe(123);
    expect(anotherWrapper.vm.error).toBe(null);
  });

  it("Testing currentRoute & getTitle with a DOI style", () => {
    $route.params.id = "FAIRsharing.abc";
    const currentRoute = wrapper.vm.$options.computed.currentRoute.call({
      $route,
      target: null,
    });
    expect(currentRoute).toBe("10.25504/FAIRsharing.abc");
    expect(`FAIRsharing | ${currentRoute}`).toBe(
      "FAIRsharing | 10.25504/FAIRsharing.abc",
    );
  });

  it("Can react to user logging out", async () => {
    wrapper.vm.canEdit = true;
    $store.state.users.user = function () {
      return { isLoggedIn: false };
    };
    await wrapper.vm.canEditRecord();
    expect(wrapper.vm.canEdit).toBe(false);
  });

  it("Testing buttons methods", async () => {
    $store.state.users.user().isLoggedIn = false;
    await wrapper.vm.getMenuButtons();
    expect(wrapper.vm.buttons[0].name()).toEqual("Edit record");
    expect(wrapper.vm.buttons[0].isDisabled()).toBe(false);
    expect(wrapper.vm.buttons[1].name()).toEqual("Request ownership");
    expect(wrapper.vm.buttons[1].isDisabled()).toBe(false);
    expect(wrapper.vm.buttons[2].name()).toEqual("Watch record");
    expect(wrapper.vm.buttons[2].isDisabled()).toBe(false);
    expect(wrapper.vm.buttons[3].name().toLowerCase()).toEqual(
      "no graph available",
    );
    expect(wrapper.vm.buttons[3].isDisabled()).toBe(true);
    expect(wrapper.vm.buttons[4].name()).toEqual("View record history");
    expect(wrapper.vm.buttons[4].isDisabled()).toBe(false);
    expect(wrapper.vm.buttons[5].name()).toEqual(
      "Have a suggestion/question ?",
    );
    expect(wrapper.vm.buttons[5].isDisabled()).toBe(false);
    wrapper.vm.buttons[0].method();
    expect($router.push).toHaveBeenCalledWith({
      path: "/accounts/login",
      query: { goTo: "/980190962" },
    });
    wrapper.vm.buttons[1].method();
    expect($router.push).toHaveBeenCalledWith({
      path: "/accounts/login",
      query: { goTo: "/980190962" },
    });
    expect($router.push).toHaveBeenCalledTimes(2);
    await wrapper.vm.buttons[2].method();
    expect($router.push).toHaveBeenCalledWith({
      path: "/accounts/login",
      query: { goTo: "/980190962" },
    });
    await wrapper.vm.buttons[5].method();
    expect($router.push).toHaveBeenCalledTimes(3);
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
        credentials: { token: 123, username: 123 },
        watchedRecords: [],
      };
    };
    wrapper.vm.buttons[0].method();
    expect(wrapper.vm.buttons[0].isDisabled()).toBe(!wrapper.vm.canEdit);
    expect(wrapper.vm.buttons[1].isDisabled()).toBe(!wrapper.vm.canClaim);
    wrapper.vm.buttons[1].method();
    expect(wrapper.vm.claimedTriggered).toBe(false);
    expect(wrapper.vm.canClaim).toBe(false);
    wrapper.vm.buttons[3].method();
    expect($router.push).toHaveBeenCalledWith({ path: "/graph/980190962" });

    mocks.setMock("restMock", RESTClient.prototype, "executeQuery", {
      data: "abc",
    });
    await wrapper.vm.buttons[4].method();
    expect(wrapper.vm.history.show).toBe(true);
    expect(wrapper.vm.history.loading).toBe(false);
    mocks.restore("restMock");
  });

  it("runs the watch method", async () => {
    mocks.setMock("restMock", RESTClient.prototype, "executeQuery", {
      data: {
        message: "success",
      },
    });
    expect(wrapper.vm.isWatching()).toBe(false);
    let changeWatchRecord = vi.spyOn(wrapper.vm, "changeWatchRecord");
    let changeWatchUsers = vi.spyOn(wrapper.vm, "changeWatched");
    await wrapper.vm.getMenuButtons();
    expect(wrapper.vm.buttons[2].name()).toEqual("Watch record");
    await wrapper.vm.buttons[2].method();
    expect(changeWatchRecord).toHaveBeenCalledWith(true);
    mocks.restore("restMock");
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
        credentials: { token: 123, username: 123 },
        watchedRecords: [980190962],
      };
    };
    expect(wrapper.vm.isWatching()).toBe(true);
    expect(wrapper.vm.buttons[2].name()).toEqual("Unwatch record");
    await wrapper.vm.buttons[2].method();
    expect(changeWatchRecord).toHaveBeenCalledWith(false);
    mocks.restore("restMock");
    mocks.setMock("restMock", RESTClient.prototype, "executeQuery", {
      data: {
        message: "nothing",
      },
    });
    await wrapper.vm.buttons[2].method();
    expect(changeWatchRecord).toHaveBeenCalledWith(false);
    expect(changeWatchUsers).toHaveBeenCalledTimes(1);
    mocks.restore("restMock");
  });

  it("doesn't change watched records if the user wasn't updated", async () => {
    let changeWatch = vi.spyOn(wrapper.vm, "changeWatchRecord");
    let changeWatchUsers = vi.spyOn(wrapper.vm, "changeWatched");
    expect(changeWatchUsers).toHaveBeenCalledTimes(0);
    await wrapper.vm.getMenuButtons();
    mocks.setMock("restMock", RESTClient.prototype, "executeQuery", {
      data: {
        modification: "failure",
      },
    });
    await wrapper.vm.buttons[2].method();
    expect(changeWatch).toHaveBeenCalled();
    expect(changeWatchUsers).toHaveBeenCalledTimes(0);
    mocks.restore("restMock");
  });

  it("can properly fetch a record history", async () => {
    mocks.setMock("restMock", RESTClient.prototype, "executeQuery", {
      data: "abc",
    });
    await wrapper.vm.getHistory();
    mocks.restore("restMock");
  });

  it("can process check claim status errors", async () => {
    mocks.restore("canClaimStub");
    mocks.setMock("canClaimStub", RESTClient.prototype, "canClaim", {
      error: { response: { data: { status: "approved" } } },
    });
    await wrapper.vm.checkClaimStatus();
    expect(wrapper.vm.canClaim).toBe(false);
    wrapper.vm.setBannerExpiry();

    mocks.restore("canClaimStub");
    mocks.setMock("canClaimStub", RESTClient.prototype, "canClaim", {
      error: { response: { data: { existing: true, status: "pending" } } },
    });
    await wrapper.vm.checkClaimStatus();
    expect(wrapper.vm.alreadyClaimed).toBe(false);

    wrapper.vm.alreadyClaimed = false;
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
        credentials: { token: 123, username: 567 },
        watchedRecords: [],
      };
    };
    await wrapper.vm.checkClaimStatus();
    expect(wrapper.vm.alreadyClaimed).toBe(true);
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
        credentials: { token: 123, username: 123 },
      };
    };

    mocks.restore("canClaimStub");
    mocks.setMock("restMock", RESTClient.prototype, "executeQuery", {
      data: true,
    });
    await wrapper.vm.checkClaimStatus();
    expect(wrapper.vm.alreadyClaimed).toBe(true);
    mocks.restore("restMock");
    mocks.setMock("canClaimStub", RESTClient.prototype, "canClaim", {});
  });

  it("can process request ownership errors", async () => {
    mocks.restore("claimRecord");
    mocks.setMock("restMock", RESTClient.prototype, "executeQuery", {
      data: { error: true },
    });
    await wrapper.vm.requestOwnership();
    expect(wrapper.vm.error).toBe(
      "Sorry, your request to claim this record failed. Please contact us.",
    );
    mocks.restore("restMock");
    mocks.setMock("claimRecord", RESTClient.prototype, "claimRecord", true);
    mocks.restore("restMock");

    wrapper.vm.dialogs.claimRecord = true;
    wrapper.vm.closeClaimMenu();
    expect(wrapper.vm.dialogs.claimRecord).toBe(false);
  });

  it("getData can process errors", async () => {
    mocks.restore("graphMock");
    mocks.throwMock("graphMock", GraphClient.prototype, "executeQuery");
    await wrapper.vm.getData();
    expect(wrapper.vm.error).toBe("error");
    mocks.restore("graphMock");
  });

  it("Testing breakpoint reactivity", async () => {
    const wrapper2 = await shallowMount(Record, {
      mocks: { $route, $store, $router },
      vuetify,
    });
    expect(wrapper2.vm.$options.name).toMatch("Record");
    expect(wrapper2.vm.currentDynamicBlock.leftBlock.length).toBeGreaterThan(0);
    wrapper2.unmount();
  });

  it("handles failed attempts to review", async () => {
    mocks.restore("graphMock");
    mocks.setMock("graphMock", GraphClient.prototype, "executeQuery", {
      fairsharing_record: record.state.currentRecord.fairsharingRecord,
    });
    mocks.restore("restMock");
    mocks.setMock("restMock", RESTClient.prototype, "executeQuery", {
      data: {
        error: "oh no!",
      },
    });
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
        credentials: { token: 123, username: 123 },
        is_curator: true,
      };
    };
    let reviewRecord = vi.spyOn(wrapper.vm, "reviewRecord");

    await wrapper.vm.getData();
    expect(wrapper.vm.reviewFail).toBe(false);
    //expect(wrapper.vm.error).toBe(null);
    await wrapper.vm.getMenuButtons();
    await wrapper.vm.buttons[6].method();
    expect(reviewRecord).toHaveBeenCalled();
    expect(wrapper.vm.needsReviewing()).toBe(true);
    expect(wrapper.vm.reviewFail).toBe(true);
    mocks.restore("graphMock");
    mocks.restore("restMock");
  });

  it("runs the review method", async () => {
    mocks.restore("graphMock");
    mocks.setMock("graphMock", GraphClient.prototype, "executeQuery");
    mocks.restore("restMock");
    mocks.setMock("restMock", RESTClient.prototype, "executeQuery", {
      data: {
        modification: "success",
      },
    });
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
        id: 123,
        credentials: { token: 123, username: 123 },
        is_curator: true,
      };
    };
    let reviewRecord = vi.spyOn(wrapper.vm, "reviewRecord");

    await wrapper.vm.getData();
    record.state.currentRecord.fairsharingRecord["reviews"] = [
      { user: { id: 123, username: "123" }, createdAt: "1950-01-01T123456" },
    ];
    expect(wrapper.vm.reviewSuccess).toBe(false);
    wrapper.vm.error = false;
    expect(wrapper.vm.needsReviewing()).toBe(true);
    await wrapper.vm.getMenuButtons();
    expect(wrapper.vm.buttons[6].name()).toEqual("Review this record");
    expect(wrapper.vm.buttons[6].isDisabled()).toBe(false);
    await wrapper.vm.buttons[6].method();
    expect(reviewRecord).toHaveBeenCalled();
    record.state.currentRecord.fairsharingRecord["reviews"] = [
      { user: { id: 123, username: "123" }, createdAt: "2050-01-01T123456" },
    ];
    expect(wrapper.vm.needsReviewing()).toBe(false);
    expect(wrapper.vm.reviewSuccess).toBe(true);
    expect(wrapper.vm.buttons[6].name()).toEqual("Review this record");
  });

  it("returns correct answer if no reviews present", async () => {
    record.state.currentRecord.fairsharingRecord = {
      maintainers: [{ username: 123 }],
      metadata: {},
    };
    wrapper = await shallowMount(Record, {
      mocks: { $route, $store, $router },
      vuetify,
    });
    expect(wrapper.vm.reviewsPresent()).toBe(false);
  });

  it("can delete a record", async () => {
    // The button appears
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
        id: 123,
        is_super_curator: true,
        credentials: { token: 123, username: 123 },
        watchedRecords: [],
      };
    };
    await wrapper.vm.getMenuButtons();
    expect(wrapper.vm.buttons[6].name()).toEqual("Delete this record");
    expect(wrapper.vm.buttons[6].isDisabled()).toBe(false);

    //There is an error in the Client query
    wrapper.vm.dialogs.recordID = 102;
    mocks.setMock("deleteMock", RESTClient.prototype, "deleteRecord", {
      error: {
        response: { data: "error" },
      },
    });
    await wrapper.vm.confirmDelete();
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);

    //Correct deleted
    wrapper.vm.dialogs.recordID = 102;
    mocks.restore("deleteMock");
    mocks.setMock("deleteMock", RESTClient.prototype, "deleteRecord", {
      data: {
        error: {
          response: { data: { error: false } },
        },
      },
    });
    await wrapper.vm.confirmDelete();
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
    expect($router.go).toHaveBeenCalled();

    // Other functions
    wrapper.vm.closeDeleteMenu();
    expect(wrapper.vm.dialogs.disableButton).toBe(true);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);

    wrapper.vm.deleteRecordMenu("one", 1);
    expect(wrapper.vm.dialogs.disableButton).toBe(false);
    expect(wrapper.vm.dialogs.disableDelButton).toBe(true);
    expect(wrapper.vm.dialogs.recordName).toEqual("one");
    expect(wrapper.vm.dialogs.recordID).toEqual(1);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(true);
  });

  it("returns correct background color based on registry types", async () => {
    record.state.currentRecord.fairsharingRecord = {
      maintainers: [{ username: 123 }],
      metadata: {},
      registry: "Database",
      doi: "abc123",
    };
    wrapper = await shallowMount(Record, {
      mocks: { $route, $store, $router },
      vuetify,
    });

    record.state.currentRecord.fairsharingRecord = {
      maintainers: [{ username: 123 }],
      metadata: {},
      registry: "Policy",
    };

    record.state.currentRecord.fairsharingRecord = {
      maintainers: [{ username: 123 }],
      metadata: {},
      registry: "Collection",
    };
    expect(wrapper.vm.getRecordCardBackground).toBe("#f0f5f9");
  });

  it("returns state of record maintenance correctly", async () => {
    $store.state.users.user = function () {
      return {
        isLoggedIn: true,
        id: 123,
        credentials: { token: 123, username: 123 },
      };
    };
    record.state.currentRecord.fairsharingRecord = {
      metadata: {},
      registry: "Policy",
    };
    expect(wrapper.vm.maintainsRecord).toBe(false);
    record.state.currentRecord.fairsharingRecord = {
      maintainers: [],
      metadata: {},
      registry: "Policy",
    };
    expect(wrapper.vm.maintainsRecord).toBe(false);
    record.state.currentRecord.fairsharingRecord = {
      maintainers: [{ id: 321 }],
      metadata: {},
      registry: "Policy",
    };
    expect(wrapper.vm.maintainsRecord).toBe(false);
    record.state.currentRecord.fairsharingRecord = {
      maintainers: [{ id: 123 }, { id: 321 }],
      metadata: {},
      registry: "Policy",
    };
    const maintainsRecord = wrapper.vm.$options.computed.maintainsRecord.call(
      wrapper.vm,
    );
    expect(maintainsRecord).toBe(true);

    const stopReview = vi.spyOn(wrapper.vm, "stopMaintainRecordMenu");
    wrapper.vm.stopMaintainRecordMenu("record", 980190962);
    expect(stopReview).toHaveBeenCalledWith("record", 980190962);
  });

  it("can remove a maintainer from a record", async () => {
    wrapper.vm.stopMaintainRecordMenu("test record", 100);
    expect(wrapper.vm.dialogs.recordName).toEqual("test record");
    expect(wrapper.vm.dialogs.recordID).toEqual(100);
    expect(wrapper.vm.dialogs.stopMaintainRecord).toBe(true);
    await wrapper.vm.removeMaintainer();
    wrapper.vm.closeMaintainMenu();
    expect(wrapper.vm.stopMaintainSuccess).toBe(true);

    expect(wrapper.vm.dialogs.disableButton).toBe(true);
    expect(wrapper.vm.dialogs.stopMaintainRecord).toBe(false);

    mocks.restore("removeMaintainer");
    mocks.setMock(
      "removeMaintainer",
      RESTClient.prototype,
      "removeMaintainer",
      { error: "fail!" },
    );
    await wrapper.vm.removeMaintainer();
    expect(wrapper.vm.stopMaintainFailure).toBe(true);
  });

  it("can respond to being loaded with a route query", async () => {
    $route.query = { history: "hide" };
    let wrapper = await shallowMount(Record, {
      mocks: { $route, $store, $router },
      vuetify,
    });
    wrapper.vm.history.show = true;
    wrapper.vm.closeHistory();
    expect(wrapper.vm.history.show).toBe(false);
    wrapper.unmount();
  });

  const prepareRecord = async (fields = {}, account = {}) => {
    await flushPromises();
    wrapper.unmount();
    $route = reactive({ params: { id: "42" }, query: {}, hash: "" });
    const currentUser = {
      id: 123,
      isLoggedIn: true,
      is_curator: false,
      is_super_curator: false,
      credentials: { token: 123, username: 123 },
      watchedRecords: [],
      ...account,
    };
    $store.state.users.user = () => currentUser;
    const currentRecord = {
      ...structuredClone(graphMockValue.fairsharingRecord),
      id: 42,
      name: "Test resource",
      abbreviation: "TR",
      doi: "10.25504/FAIRsharing.test",
      isHidden: false,
      type: "terminology_artifact",
      objectTypes: [],
      isApproved: true,
      maintainers: [],
      hasGraph: true,
      ...fields,
    };
    record.state.currentRecord.fairsharingRecord = currentRecord;
    mocks.setMock("graphMock", GraphClient.prototype, "executeQuery", {
      fairsharingRecord: currentRecord,
    });
    mocks.setMock("canEditStub", RESTClient.prototype, "canEdit", {});
    mocks.setMock("canClaimStub", RESTClient.prototype, "canClaim", {
      existing: false,
    });
    mocks.setMock("deleteMock", RESTClient.prototype, "deleteRecord", {});
    mocks.setMock("claimRecord", RESTClient.prototype, "claimRecord", {});
    mocks.setMock(
      "removeMaintainer",
      RESTClient.prototype,
      "removeMaintainer",
      {},
    );
    $router.push.mockClear();
    $router.replace.mockClear();
    $router.go.mockClear();
    wrapper = shallowMount(Record, {
      mocks: { $route, $store, $router, $scrollTo: vi.fn() },
      vuetify,
      stubs: { VBtn: VBtnStub, VDialog: VDialogStub, VOverlay: VOverlayStub },
    });
    await flushPromises();
    vi.spyOn(wrapper.vm, "getField").mockImplementation(
      (field) => wrapper.vm.currentRecord.fairsharingRecord[field],
    );
  };

  const findDialog = (text) =>
    wrapper
      .findAllComponents({ name: "VDialog" })
      .find((item) => item.text().includes(text));
  const findButton = (container, text) =>
    container.findAll("button").find((item) => item.text().trim() === text);
  const useCountdownTimers = () =>
    vi.useFakeTimers({
      toFake: [
        "setTimeout",
        "clearTimeout",
        "setInterval",
        "clearInterval",
        "Date",
      ],
    });

  it("emits page-ready events and renders the loaded record", async () => {
    await prepareRecord();
    expect(wrapper.emitted("updateHead")).toHaveLength(1);
    expect(wrapper.emitted("showDialog")).toEqual([[true]]);
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.recordID).toBe(42);
    expect(wrapper.findComponent({ name: "GeneralInfo" }).exists()).toBe(true);
  });

  it("passes the introspection read-only state to the record menu", async () => {
    await prepareRecord();
    const menu = wrapper.findComponent({ name: "RecordMenu" });
    expect(menu.props("readOnlyMode")).toBe(false);
    try {
      $store.commit("introspection/setReadOnlyMode");
      await wrapper.vm.$nextTick();
      expect(menu.props("readOnlyMode")).toBe(true);
    }
    finally {
      $store.state.introspection.readOnlyMode = false;
    }
  });

  it.each([
    [false, false, true],
    [true, false, true],
    [true, true, false],
  ])(
    "restricts hidden content for loggedIn=%s and canEdit=%s",
    async (loggedIn, canEdit, hidden) => {
      await prepareRecord({ isHidden: true }, { isLoggedIn: loggedIn });
      mocks.canEditStub.returns(canEdit ? {} : { error: "forbidden" });
      await wrapper.vm.canEditRecord();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.recordHidden).toBe(hidden);
      expect(wrapper.findComponent({ name: "Hidden" }).exists()).toBe(hidden);
      expect(wrapper.findComponent({ name: "GeneralInfo" }).exists()).toBe(
        !hidden,
      );
    },
  );

  it("renders tombstones instead of resource content", async () => {
    await prepareRecord({ metadata: { tombstone: true } });
    expect(wrapper.findComponent({ name: "Tombstone" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "GeneralInfo" }).exists()).toBe(false);
  });

  it("renders collection search instead of resource-only sections", async () => {
    await prepareRecord({ registry: "Collection" });
    expect(wrapper.findComponent({ name: "SearchCollection" }).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent({ name: "AdditionalInfo" }).exists()).toBe(
      false,
    );
    expect(wrapper.findComponent({ name: "Collections" }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: "Publications" }).exists()).toBe(true);
  });

  it("refreshes on route changes and displays fetch errors", async () => {
    await prepareRecord();
    const fetch = vi.spyOn(wrapper.vm, "fetchRecord");
    $route.params.id = "43";
    await flushPromises();
    expect(fetch).toHaveBeenLastCalledWith({ id: "43", token: 123 });
    fetch.mockRejectedValueOnce(new Error("Record unavailable"));
    $route.params.id = "44";
    await flushPromises();
    expect(wrapper.vm.error).toBe("Record unavailable");
    expect(wrapper.findComponent({ name: "NotFound" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "GeneralInfo" }).exists()).toBe(false);
  });

  it("refreshes preview targets and handles failure without showing the menu", async () => {
    await prepareRecord();
    const fetch = vi.spyOn(wrapper.vm, "fetchPreviewRecord");
    $route.hash = "#publications";
    await wrapper.setProps({ target: 50 });
    await flushPromises();
    expect(fetch).toHaveBeenLastCalledWith(50);
    expect(wrapper.findComponent({ name: "RecordMenu" }).exists()).toBe(false);
    expect(wrapper.vm.$scrollTo).toHaveBeenLastCalledWith("#publications");
    fetch.mockRejectedValueOnce(new Error("Preview unavailable"));
    await wrapper.setProps({ target: 51 });
    await flushPromises();
    expect(wrapper.vm.error).toBe("Preview unavailable");
  });

  it("shows a history loader until the request completes and closes through its button", async () => {
    await prepareRecord();
    let resolveHistory;
    vi.spyOn(wrapper.vm, "getHistory").mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveHistory = resolve;
        }),
    );
    const pending = wrapper.vm.buttons
      .find((item) => item.name() === "View record history")
      .method();
    await wrapper.vm.$nextTick();
    expect(
      findDialog("history logs").findComponent({ name: "Loaders" }).exists(),
    ).toBe(true);
    resolveHistory();
    await pending;
    await wrapper.vm.$nextTick();
    const history = findDialog("history logs");
    expect(history.findComponent({ name: "RecordHistory" }).exists()).toBe(
      true,
    );
    await history.find("button").trigger("click");
    expect(wrapper.vm.history.show).toBe(false);
    expect($router.replace).toHaveBeenCalledWith({ query: {} });
  });

  it("enables deletion only after the countdown and reloads after success", async () => {
    await prepareRecord({}, { is_super_curator: true });
    useCountdownTimers();
    await wrapper.vm.buttons
      .find((item) => item.name() === "Delete this record")
      .method();
    await wrapper.vm.$nextTick();
    expect(
      findButton(findDialog("Delete record"), "DELETE (5)").attributes(
        "disabled",
      ),
    ).toBeDefined();
    await vi.advanceTimersByTimeAsync(4000);
    expect(wrapper.vm.deleteCountdown).toBe(1);
    expect(mocks.deleteMock.called).toBe(false);
    await vi.advanceTimersByTimeAsync(1000);
    expect(wrapper.vm.deleteTimer).toBe(null);
    await findButton(findDialog("Delete record"), "DELETE").trigger("click");
    await flushPromises();
    expect(mocks.deleteMock.calledOnceWithExactly(42, 123)).toBe(true);
    expect($router.go).toHaveBeenCalledWith(0);
  });

  it("renders and dismisses deletion errors without reloading", async () => {
    await prepareRecord();
    useCountdownTimers();
    mocks.deleteMock.returns({ error: "Deletion failed" });
    wrapper.vm.deleteRecordMenu("Test resource", 42);
    await vi.advanceTimersByTimeAsync(5000);
    await findButton(findDialog("Delete record"), "DELETE").trigger("click");
    await flushPromises();
    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
    const alert = wrapper.findComponent({ name: "VAlert" });
    expect(alert.text()).toContain("This record could not be deleted");
    expect(alert.find("a").attributes("href")).toContain("recordID%3A%2042");
    alert.vm.$emit("click:close");
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: "VAlert" }).exists()).toBe(false);
    expect($router.go).not.toHaveBeenCalled();
  });

  it("cleans up deletion timers on cancel, restart and unmount", async () => {
    await prepareRecord();
    useCountdownTimers();
    wrapper.vm.deleteRecordMenu("Test resource", 42);
    await wrapper.vm.$nextTick();
    await findButton(findDialog("Delete record"), "Cancel").trigger("click");
    expect(wrapper.vm.deleteTimer).toBe(null);
    expect(wrapper.vm.dialogs.deleteRecord).toBe(false);
    wrapper.vm.deleteRecordMenu("Test resource", 42);
    await vi.advanceTimersByTimeAsync(2000);
    wrapper.vm.startDeleteCountdown();
    expect(wrapper.vm.deleteCountdown).toBe(5);
    expect(vi.getTimerCount()).toBe(1);
    wrapper.unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(mocks.deleteMock.called).toBe(false);
  });

  it("requests ownership through its confirmation button", async () => {
    await prepareRecord();
    useCountdownTimers();
    await wrapper.vm.buttons
      .find((item) => item.name() === "Request ownership")
      .method();
    await wrapper.vm.$nextTick();
    const claim = findDialog("request ownership of this record");
    expect(findButton(claim, "OK").attributes("disabled")).toBeDefined();
    await vi.advanceTimersByTimeAsync(5000);
    await findButton(claim, "OK").trigger("click");
    await flushPromises();
    expect(mocks.claimRecord.calledOnceWithExactly(42, 123)).toBe(true);
    expect(wrapper.vm.claimedTriggered).toBe(true);
    expect(wrapper.vm.dialogs.claimRecord).toBe(false);
    expect(wrapper.vm.alerts.isAlreadyClaimed).toBeDefined();
  });

  it("removes only the current maintainer through its confirmation button", async () => {
    await prepareRecord({ maintainers: [{ id: 123 }, { id: 456 }] });
    useCountdownTimers();
    const stop = wrapper.vm.buttons.find(
      (item) => item.name() === "Stop maintaining",
    );
    expect(stop.isDisabled()).toBe(false);
    await stop.method();
    await wrapper.vm.$nextTick();
    const maintain = findDialog("stop maintaining this record");
    await vi.advanceTimersByTimeAsync(5000);
    await findButton(maintain, "OK").trigger("click");
    await flushPromises();
    expect(mocks.removeMaintainer.calledOnceWithExactly(42, 123)).toBe(true);
    expect(wrapper.vm.currentRecord.fairsharingRecord.maintainers).toEqual([
      { id: 456 },
    ]);
    expect(wrapper.vm.stopMaintainSuccess).toBe(true);
    expect(wrapper.vm.dialogs.stopMaintainRecord).toBe(false);
  });

  it.each(["claim", "maintain"])(
    "cancels the %s dialog without an API request",
    async (kind) => {
      await prepareRecord();
      useCountdownTimers();
      if (kind === "claim") wrapper.vm.claimRecordMenu("Test resource", 42);
      else wrapper.vm.stopMaintainRecordMenu("Test resource", 42);
      await wrapper.vm.$nextTick();
      await findButton(
        findDialog(
          kind === "claim"
            ? "request ownership of this record"
            : "stop maintaining this record",
        ),
        "Cancel",
      ).trigger("click");
      expect(wrapper.vm.dialogs.claimRecord).toBe(false);
      expect(wrapper.vm.dialogs.stopMaintainRecord).toBe(false);
      expect(mocks.claimRecord.called).toBe(false);
      expect(mocks.removeMaintainer.called).toBe(false);
    },
  );

  it("builds citation links and metadata with and without a DOI", async () => {
    await prepareRecord();
    expect(Record.head.link.call(wrapper.vm)).toEqual([
      {
        rel: "cite-as",
        type: "application/html",
        href: "https://doi.org/10.25504/FAIRsharing.test",
      },
      {
        rel: "describedby",
        type: "application/json",
        href: wrapper.vm.getHostname() + "FAIRsharing.test",
      },
      {
        rel: "describedby",
        type: "application/ld+json",
        href: wrapper.vm.getHostname() + "FAIRsharing.test",
      },
    ]);
    const metadata = Record.metaInfo.call(wrapper.vm);
    expect(metadata.title).toBe("FAIRsharing | TR");
    expect(metadata.meta).toContainEqual({
      name: "description",
      content: "FAIRsharing record for Test resource (TR)",
    });
    expect(metadata.meta).toContainEqual({
      name: "link",
      rel: "canonical",
      content: `${import.meta.env.VITE_HOSTNAME}FAIRsharing.test`,
    });
    delete wrapper.vm.currentRecord.fairsharingRecord.doi;
    delete wrapper.vm.currentRecord.fairsharingRecord.abbreviation;
    const withoutDoi = Record.metaInfo.call(wrapper.vm);
    expect(withoutDoi.title).toBe("FAIRsharing | Test resource");
    expect(withoutDoi.meta).toContainEqual({
      name: "link",
      rel: "canonical",
      content: `${import.meta.env.VITE_HOSTNAME}42`,
    });
    wrapper.vm.recordID = null;
    expect(Record.head.link.call(wrapper.vm)).toBeUndefined();
  });

  it("preserves banner creation dates and detects expired banners", async () => {
    await prepareRecord();
    useCountdownTimers();
    vi.setSystemTime(new Date("2026-11-09T12:00:00Z"));
    const previous = localStorage.getItem("bannerExpiryDate");
    try {
      localStorage.removeItem("bannerExpiryDate");
      expect(wrapper.vm.isBannerExpired()).toBe(true);
      wrapper.vm.setBannerExpiry();
      const saved = localStorage.getItem("bannerExpiryDate");
      expect(JSON.parse(saved)[42]).toBe("2026-11-09T12:00:00.000Z");
      vi.advanceTimersByTime(24 * 60 * 60 * 1000);
      wrapper.vm.setBannerExpiry();
      expect(localStorage.getItem("bannerExpiryDate")).toBe(saved);
      expect(wrapper.vm.isBannerExpired()).toBe(true);
      vi.advanceTimersByTime(2 * 24 * 60 * 60 * 1000);
      expect(wrapper.vm.isBannerExpired()).toBe(false);
    }
    finally {
      if (previous === null) localStorage.removeItem("bannerExpiryDate");
      else localStorage.setItem("bannerExpiryDate", previous);
    }
  });
});
