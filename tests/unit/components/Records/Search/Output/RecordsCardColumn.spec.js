import { shallowMount  } from "@vue/test-utils";
import VueRouter from "vue-router";
import { createVuetify } from "vuetify";

import RecordsCardStack from "@/components/Records/Search/Output/RecordsCardColumn.vue";

import getRecord from "../../../../../fixtures/getRecord.json";

const vuetify = createVuetify();

describe("RecordsCardColumn.vue", function () {
  let wrapper;
  let record = getRecord;

  wrapper = shallowMount(RecordsCardStack, {
    vuetify,
    props: {
      record: record,
    },
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RecordsCardColumn");
  });
});
