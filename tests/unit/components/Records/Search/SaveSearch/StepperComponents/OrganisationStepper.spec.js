import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";
import { defineComponent, h } from "vue";

import OrganisationStepper from "@/components/Records/Search/SaveSearch/StepperComponents/OrganisationStepper.vue";

let vuetify = createVuetify();

const autoCompleteStub = defineComponent({
  name: "VAutoComplete",
  setup(_, { slots }) {
    return () => h("div", slots.default?.());
  },
});

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
            getUser: vi.fn(),
          },
        },
        organisationSearch: {
          namespaced: true,
          getters: {
            getSearchOrganisations: () => [{ id: 1, name: "Organisation1" }],
            getLoadingStatus: () => true,
          },
          actions: {
            fetchSearchOrganisations: vi.fn(),
          },
        },
      },
    });

    wrapper = shallowMount(OrganisationStepper, {
      vuetify,
      store,
      stubs: {
        "v-autocomplete": autoCompleteStub,
        VAutoComplete: autoCompleteStub,
      },
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("OrganisationStepper");
  });
});
