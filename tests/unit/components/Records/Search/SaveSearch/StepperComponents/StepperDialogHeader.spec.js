import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import saveSearch from "@/store";
import StepperDialogHeader from "@/components/Records/Search/SaveSearch/StepperComponents/StepperDialogHeader.vue";

vi.mock("@/store", () => ({
  default: {
    commit: vi.fn(),
  },
}));

describe("StepperDialogHeader.vue", () => {
  let actions;
  let getters;
  let store;

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
        },
      },
    });

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
    expect(saveSearch.commit).toHaveBeenCalledWith(
      "saveSearch/setSaveSearchStepperDialog",
      false,
    );
  });
});
