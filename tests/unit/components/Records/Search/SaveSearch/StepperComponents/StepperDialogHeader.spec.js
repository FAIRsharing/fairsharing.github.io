import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import StepperDialogHeader from "@/components/Records/Search/SaveSearch/StepperComponents/StepperDialogHeader.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("StepperDialogHeader.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(StepperDialogHeader, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("StepperDialogHeader");
  });
});
