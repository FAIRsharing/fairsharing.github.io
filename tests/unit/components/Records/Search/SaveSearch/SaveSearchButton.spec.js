import { shallowMount  } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import SaveSearchButton from "@/components/Records/Search/SaveSearch/SaveSearchButton.vue";

let vuetify = createVuetify();

describe("SaveSearchButton.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(SaveSearchButton, {
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("SaveSearchButton");
  });
});
