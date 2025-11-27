import { createLocalVue, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import VueRouter from "vue-router";
import Vuetify from "vuetify";
import Vuex from "vuex";

import GraphClient from "@/lib/GraphClient/GraphClient";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import userStore from "@/store/users.js";
import NewRecord from "@/views/CreateRecord/NewRecord.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

recordStore.state.newRecord = false;
userStore.state.user().is_curator = false;
userStore.state.user().credentials.token = "a token";

const recordTypeData = {
  fairsharingRegistries: {
    records: [
      {
        id: 1,
        name: "Database",
      },
      {
        id: 2,
        name: "FAIRassist",
      },
    ],
  },
};

const $store = new Vuex.Store({
  modules: {
    editor: editorStore,
    record: recordStore,
    users: userStore,
  },
});

const $route = {
  path: "/create-fairassist",
};
const router = new VueRouter();
const $router = {
  push: jest.fn(),
  currentRoute: {
    path: "/create-fairassist",
  },
};

let wrapper;
let graphStub;

describe("NewRecord", () => {
  beforeAll(() => {
    graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
    graphStub.withArgs(sinon.match.any).returns(recordTypeData);

    wrapper = shallowMount(NewRecord, {
      localVue,
      vuetify,
      router,
      mocks: { $store, $route, $router },
      propsData: {
        fairassistOnly: true,
      },
    });
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("NewRecord");
    expect(wrapper.vm.$route.path).toEqual("/create-fairassist");
    expect(wrapper.vm.fairassistOnly).toBe(true);
  });
});
