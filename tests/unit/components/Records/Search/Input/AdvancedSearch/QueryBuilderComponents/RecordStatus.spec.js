import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import RecordStatus from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/RecordStatus.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("RecordStatus.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(RecordStatus, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("RecordStatus");
  });
});
