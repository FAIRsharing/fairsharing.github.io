import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import DataContactInformation from "@/components/Records/Search/Input/AdvancedSearch/QueryBuilderComponents/DatabaseComponents/DataContactInformation.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
let vuetify = new Vuetify();

describe("DataContactInformation.vue", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(DataContactInformation, {
      localVue,
      vuetify,
    });
  });

  it("can mount", () => {
    expect(wrapper.vm.$options.name).toBe("DataContactInformation");
  });
});
