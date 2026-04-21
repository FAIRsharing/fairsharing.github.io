import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createStore } from "vuex";
import saveSearch from "@/store";
import ResultCard from "@/components/Records/Search/SaveSearch/StepperComponents/ResultCard.vue";

vi.mock("@/store", () => ({
  default: {
    commit: vi.fn(),
  },
}));

describe("ResultCard.vue", () => {
  let actions;
  let getters;
  let store;

  const createWrapper = (searchStatus = true) => {
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

    return shallowMount(ResultCard, {
      global: {
        plugins: [store],
        mocks: {
          $vuetify: { display: { smAndDown: false } },
        },
        stubs: {
          "v-card": { template: "<div><slot /></div>" },
          "v-card-title": { template: "<div><slot /></div>" },
          "v-card-text": { template: "<div><slot /></div>" },
          "v-card-actions": { template: "<div><slot /></div>" },
          "v-btn": {
            template: "<button @click=\"$emit('click')\"><slot /></button>",
          },
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Method", () => {
    it("restartStepper method performs full reset and re-opens stepper", async () => {
      const wrapper = createWrapper(false); // Usually restarts from error state
      wrapper.vm.restartStepper();
      expect(actions.resetSaveSearchDialog).toHaveBeenCalled();
      expect(wrapper.emitted("restartStepper")[0]).toEqual([1]);
      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setShowStepper",
        true,
      );
      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchStepperDialog",
        true,
      );
    });

    it("closeStepperDialog method cleans up and emits 0 when closing", async () => {
      const wrapper = createWrapper(true);
      wrapper.vm.closeStepperDialog();
      expect(actions.resetSaveSearchDialog).toHaveBeenCalled();
      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setSaveSearchStepperDialog",
        false,
      );
      expect(wrapper.emitted("restartStepper")[0]).toEqual([0]);
    });
  });

  describe("Button Interactions", () => {
    it("calls restartStepper when 'Start Again' is clicked", async () => {
      const wrapper = createWrapper(false);
      const startAgainBtn = wrapper.find('[data-test="restart-btn"]');
      expect(startAgainBtn.exists()).toBe(true);
      await startAgainBtn.trigger("click");
      expect(actions.resetSaveSearchDialog).toHaveBeenCalled();
      expect(saveSearch.commit).toHaveBeenCalledWith(
        "saveSearch/setShowStepper",
        true,
      );
    });

    it("calls closeStepperDialog when 'Close' is clicked in Success mode", async () => {
      const wrapper = createWrapper(false);
      const closeBtn = wrapper.find('[data-test="close-btn"]');
      expect(closeBtn.exists()).toBe(true);
      await closeBtn.trigger("click");
      expect(wrapper.emitted("restartStepper")[0]).toEqual([0]);
    });
  });
});
