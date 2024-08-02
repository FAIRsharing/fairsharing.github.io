import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import UserStepper from "@/components/Records/Search/SaveSearch/StepperComponents/UserStepper.vue";
import userStore from "@/store/users.js";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("UserStepper.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    actions = {
      getUsersList: jest.fn(),
    };

    userStore.state.usersList = [
      {
        id: 1,
        name: "User1",
      },
    ];

    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        users: userStore,
      },
    });

    wrapper = shallowMount(UserStepper, {
      localVue,
      vuetify,
      store,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("UserStepper");
  });
});
