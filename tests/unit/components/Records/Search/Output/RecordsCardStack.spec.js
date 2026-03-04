import { shallowMount  } from "@vue/test-utils";
import VueRouter from "vue-router";
import { createVuetify } from "vuetify";

import RecordsCardStack from "@/components/Records/Search/Output/RecordsCardStack.vue";

import getRecord from "../../../../../fixtures/getRecord.json";

const vuetify = createVuetify();

describe("RecordsCardStack.vue", function () {
  const getWrapper = () =>
    shallowMount(RecordsCardStack, {
      vuetify,
      props: {
        record: getRecord,
      },
      global: {
        stubs: {
          "router-link": true,
        },
      },
    });

  let wrapper = getWrapper();
  let record = getRecord;

  it("can be instantiated", () => {
    wrapper = getWrapper();
    expect(wrapper.vm.$options.name).toMatch("RecordsCardStack");
  });

  it("can generate correct link depending on doi presence", () => {
    wrapper = getWrapper();
    expect(wrapper.vm.getRecordLink(wrapper.vm.record)).toEqual(
      wrapper.vm.record.id,
    );
    let doi = "FAIRsharing.wibble";
    wrapper.vm.record.doi = doi;
    expect(wrapper.vm.getRecordLink(wrapper.vm.record)).toEqual(doi);
  });

  it("can check getMaxItemShow computed property", () => {
    wrapper = getWrapper();
    wrapper.vm.$vuetify.display.lg = true;
    wrapper.vm.$vuetify.display.mdAndDown = false;
    wrapper.vm.$vuetify.display.xl = false;
    expect(wrapper.vm.getMaxItemShown).toBe(2);
    wrapper.vm.$vuetify.display.lg = false;
    wrapper.vm.$vuetify.display.xl = true;
    expect(wrapper.vm.getMaxItemShown).toBe(3);
  });

  it("can check organizeChips method", () => {
    wrapper = getWrapper();
    record["subjects"] = undefined;
    expect(wrapper.vm.organizeChips(record, "subjects", 3)).toBe(false);
    expect(wrapper.vm.organizeChips(record, "userDefinedTags", 3)).toBe(true);
  });

  it("can truncate long text", () => {
    wrapper = getWrapper();
    expect(wrapper.vm.truncateString("testes", 10)).toEqual("testes");
    expect(wrapper.vm.truncateString("testes", 4)).toEqual("test...");
    expect(wrapper.vm.truncateString("", 10)).toEqual("");
  });
});
