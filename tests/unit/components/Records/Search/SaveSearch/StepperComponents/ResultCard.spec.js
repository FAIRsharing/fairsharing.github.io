import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import ResultCard from "@/components/Records/Search/SaveSearch/StepperComponents/ResultCard.vue";
import saveSearchStore from "@/store/saveSearch";

let vuetify = createVuetify();

describe("ResultCard.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    saveSearchStore.getter = {
      getSaveSearchStatus: () => {
        return [true];
      },
    };
    actions = {
      resetSaveSearchDialog: vi.fn(),
    };

    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        saveSearch: saveSearchStore,
      },
    });

    wrapper = shallowMount(ResultCard, {
      vuetify,
      store,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("ResultCard");
  });
});
