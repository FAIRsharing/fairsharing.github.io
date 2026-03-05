import { shallowMount  } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import PolicyStepper from "@/components/Records/Search/SaveSearch/StepperComponents/PolicyStepper.vue";

let vuetify = createVuetify();

describe("PolicyStepper.vue", () => {
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
              user: { maintainedRecords: [] },
            }),
          },
          actions: {
            getUser: vi.fn(),
          },
        },
        saveSearch: {
          namespaced: true,
          getters: {
            getPolicyRecords: () => [{ id: 1, name: "Policy1" }],
            getLoadingStatus: () => true,
          },
          actions: {
            fetchPolicyRecords: vi.fn(),
          },
        },
      },
    });

    wrapper = shallowMount(PolicyStepper, {
      vuetify,
      store,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("PolicyStepper");
  });
});
