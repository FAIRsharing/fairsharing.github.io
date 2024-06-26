import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import SaveSearchStepper from "@/components/Records/Search/SaveSearch/SaveSearchStepper.vue";
import advancedSearchStore from "@/store/AdvancedSearchComponents/advancedSearch";
import saveSearchStore from "@/store/saveSearch";
import userStore from "@/store/users.js";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("SaveSearchStepper.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    saveSearchStore.getters = {
      getSaveSearchStepperDialog: () => {
        return [true];
      },
      getOrganisationSelected: () => {
        return [
          {
            id: 1,
            name: "Organisation1",
          },
        ];
      },
      getPolicySelected: () => {
        return [
          {
            id: 1,
            name: "Policy1",
          },
        ];
      },
      getUserSelected: () => {
        return [
          {
            id: 1,
            name: "User1",
          },
        ];
      },
      getShowStepper: () => {
        return [true];
      },
    };
    advancedSearchStore.getters = {
      getAdvancedSearchQuery: () => {
        return [
          {
            operator: "_and",
            fields: [{ operator: "_and", type: ["repository"] }],
          },
        ];
      },
    };
    actions = {
      getUser: jest.fn(),
    };
    userStore.state.user().is_super_curator = true;

    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        saveSearch: saveSearchStore,
        advancedSearch: advancedSearchStore,
        users: userStore,
      },
    });

    wrapper = shallowMount(SaveSearchStepper, {
      localVue,
      vuetify,
      store,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("SaveSearchStepper");
  });
});
