import { shallowMount  } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import StepperDialogHeader from "@/components/Records/Search/SaveSearch/StepperComponents/StepperDialogHeader.vue";

let vuetify = createVuetify();

describe("StepperDialogHeader.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(StepperDialogHeader, {
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("StepperDialogHeader");
  });
});
