import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import SaveSearchButton from "@/components/Records/Search/SaveSearch/SaveSearchButton.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("SaveSearchButton.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(SaveSearchButton, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("SaveSearchButton");
  });
});
