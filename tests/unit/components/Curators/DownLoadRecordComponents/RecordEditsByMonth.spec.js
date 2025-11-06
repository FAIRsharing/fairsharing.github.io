import { createLocalVue, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import VueRouter from "vue-router";
import Vuex from "vuex";

import RecordEditsByMonth from "@/components/Curators/DownLoadRecordsComponents/RecordEditsByMonth.vue";
import Client from "@/lib/Client/RESTClient.js";
import usersStore from "@/store/users";

const localVue = createLocalVue();
localVue.use(Vuex);

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

const router = new VueRouter();

describe("RecordEditsByMonth", () => {
  let restStub, wrapper;
  beforeAll(() => {
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: {
        error: false,
      },
    });
    wrapper = shallowMount(RecordEditsByMonth, {
      localVue,
      router,
      mocks: { $store },
    });
  });
  afterEach(() => {
    restStub.restore();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("RecordEditsByMonth");
    expect(wrapper.vm.obtainFileEditByMonth).toHaveBeenCalled;
  });
});
