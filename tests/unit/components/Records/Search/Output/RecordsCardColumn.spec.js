import { createLocalVue, shallowMount } from "@vue/test-utils";
import VueRouter from "vue-router";
import Vuetify from "vuetify";

import RecordsCardStack from "@/components/Records/Search/Output/RecordsCardColumn.vue";

import getRecord from "../../../../../fixtures/getRecord.json";

const localVue = createLocalVue();
localVue.use(VueRouter);
const vuetify = new Vuetify();

describe("RecordsCardColumn.vue", function () {
  let wrapper;
  let record = getRecord;

  wrapper = shallowMount(RecordsCardStack, {
    localVue,
    vuetify,
    propsData: {
      record: record,
    },
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RecordsCardColumn");
  });
});
