import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import OrganisationStepper from "@/components/Records/Search/SaveSearch/StepperComponents/OrganisationStepper.vue";
import organisationSearchStore from "@/store/AdvancedSearchComponents/organisationSearch";
import userStore from "@/store/users.js";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("OrganisationStepper.vue", () => {
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
    organisationSearchStore.getters = {
      getSearchOrganisations: () => {
        return [
          {
            id: 1,
            name: "Organisation1",
          },
        ];
      },

      getLoadingStatus: () => {
        return [true];
      },
    };
    actions = {
      getUser: jest.fn(),
      fetchSearchOrganisations: jest.fn(),
    };

    userStore.state.user().is_super_curator = true;

    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        organisationSearch: organisationSearchStore,
        users: userStore,
      },
    });

    wrapper = shallowMount(OrganisationStepper, {
      localVue,
      vuetify,
      store,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("OrganisationStepper");
  });
});
