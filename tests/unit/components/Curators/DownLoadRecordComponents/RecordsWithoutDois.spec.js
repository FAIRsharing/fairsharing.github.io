import { createLocalVue, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import VueRouter from "vue-router";
import Vuex from "vuex";

import RecordsWithoutDois from "@/components/Curators/DownLoadRecordsComponents/RecordsWithoutDois.vue";
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

describe("RecordsWithoutDois", () => {
  let restStub, wrapper;
  beforeAll(() => {
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: {
        error: false,
      },
    });
    wrapper = shallowMount(RecordsWithoutDois, {
      localVue,
      router,
      mocks: { $store },
    });
  });
  afterEach(() => {
    restStub.restore();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("RecordsWithoutDois");
    expect(wrapper.vm.obtainFileRecordsWODois).toHaveBeenCalled;
  });

  it("can download a file with records without DOIs", async () => {
    restStub.restore();
    restStub = sinon.stub(Client.prototype, "executeQuery").returns({
      data: "[El1|f1_1|f1_2|f1_3,El2|f2_1|f2_2|f2_3]",
    });
    await wrapper.vm.obtainFileRecordsWODois();
    expect(wrapper.vm.downloadContent).toBe(
      "data:text/json;charset=utf-8,%5BEl1%7Cf1_1%7Cf1_2%7Cf1_3%2CEl2%7Cf2_1%7Cf2_2%7Cf2_3%5D",
    );
  });
});
