import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import StepperDialogHeader from "@/components/Records/Search/SaveSearch/StepperComponents/StepperDialogHeader.vue";

describe("StepperDialogHeader.vue", () => {
  let actions;
  let getters;
  let store; // Track the active Vuex store instance locally

  const createWrapper = (searchStatus = false) => {
    actions = {
      resetSaveSearchDialog: vi.fn(),
    };

    getters = {
      getSaveSearchStatus: () => searchStatus,
    };

    store = createStore({
      modules: {
        saveSearch: {
          namespaced: true,
          getters,
          actions,
          mutations: { setSaveSearchStepperDialog: vi.fn() }, // Safe placeholder for the commit
        },
      },
    });

    // Directly spy on the commit method of the generated store instance
    vi.spyOn(store, "commit");

    return shallowMount(StepperDialogHeader, {
      global: {
        plugins: [store],
        stubs: {
          "v-btn": {
            template: '<button class="v-btn-stub"><slot /></button>',
          },
          "v-icon": {
            name: "v-icon",
            template:
              '<div class="v-icon-stub" @click="$emit(\'click\')"></div>',
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("can be instantiated", () => {
    const wrapper = createWrapper(true);
    expect(wrapper.vm.$options.name).toMatch("StepperDialogHeader");
  });

  it("can check closeStepperDialog method resets and emits restartStepper when search status is SUCCESS (true)", async () => {
    const wrapper = createWrapper(true);
    await wrapper.find(".v-icon-stub").trigger("click");

    expect(actions.resetSaveSearchDialog).toHaveBeenCalled();
    expect(wrapper.emitted()).toHaveProperty("restartStepper");
    expect(wrapper.emitted("restartStepper")[0]).toEqual([0]);

    // Assert against the actual store spy instance instead of the removed global import mock
    expect(store.commit).toHaveBeenCalledWith(
      "saveSearch/setSaveSearchStepperDialog",
      false,
    );
  });
});
