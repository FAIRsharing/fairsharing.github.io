import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import ResultCard from "@/components/Records/Search/SaveSearch/StepperComponents/ResultCard.vue";
import saveSearchStore from "@/store/saveSearch";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("ResultCard.vue", () => {
  let wrapper, store, actions;
  beforeEach(() => {
    saveSearchStore.getter = {
      getSaveSearchStatus: () => {
        return [true];
      },
    };
    actions = {
      resetSaveSearchDialog: jest.fn(),
    };

    store = new Vuex.Store({
      modules: {
        namespaced: true,
        actions,
        saveSearch: saveSearchStore,
      },
    });

    wrapper = shallowMount(ResultCard, {
      localVue,
      vuetify,
      store,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("ResultCard");
  });
});
