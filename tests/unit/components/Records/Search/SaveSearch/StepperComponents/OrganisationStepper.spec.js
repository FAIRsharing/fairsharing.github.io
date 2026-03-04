import { shallowMount  } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import OrganisationStepper from "@/components/Records/Search/SaveSearch/StepperComponents/OrganisationStepper.vue";

let vuetify = createVuetify();

describe("OrganisationStepper.vue", () => {
  let wrapper, store;
  beforeEach(() => {
    store = new Vuex.Store({
      modules: {
        users: {
          namespaced: true,
          state: {
            user: () => ({ is_super_curator: true }),
          },
          getters: {
            getUserRecords: () => ({
              user: { organisations: [] },
            }),
          },
          actions: {
            getUser: jest.fn(),
          },
        },
        organisationSearch: {
          namespaced: true,
          getters: {
            getSearchOrganisations: () => [{ id: 1, name: "Organisation1" }],
            getLoadingStatus: () => true,
          },
          actions: {
            fetchSearchOrganisations: jest.fn(),
          },
        },
      },
    });

    wrapper = shallowMount(OrganisationStepper, {
      vuetify,
      store,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("OrganisationStepper");
  });
});
