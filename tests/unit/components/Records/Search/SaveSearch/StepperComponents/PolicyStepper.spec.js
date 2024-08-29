import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import PolicyStepper from "@/components/Records/Search/SaveSearch/StepperComponents/PolicyStepper.vue";
import saveSearchStore from "@/store/saveSearch";
import userStore from "@/store/users.js";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("PolicyStepper.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    userStore.getters = {
      getUserRecords: () => {
        return [
          {
            user: {
              savedSearches: [
                {
                  id: 206,
                  name: "Test",
                  url: "http://www.example.com",
                  comments: "",
                  createdAt: "2024-06-19T14:52:28Z",
                  creator: { id: 1, username: "dummy" },
                  fairsharingRecords: [],
                  organisations: [],
                },
              ],
            },
          },
        ];
      },
    };
    saveSearchStore.getters = {
      getPolicyRecords: () => {
        return [
          {
            id: 1,
            name: "Policy1",
          },
        ];
      },

      getLoadingStatus: () => {
        return [true];
      },
    };
    actions = {
      getUser: jest.fn(),
      fetchPolicyRecords: jest.fn(),
    };

    userStore.state.user().is_super_curator = true;

    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        saveSearch: saveSearchStore,
        users: userStore,
      },
    });

    wrapper = shallowMount(PolicyStepper, {
      localVue,
      vuetify,
      store,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("PolicyStepper");
  });
});
