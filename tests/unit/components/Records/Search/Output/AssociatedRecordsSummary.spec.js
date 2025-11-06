import { shallowMount } from "@vue/test-utils";

import AssociatedRecordsSummary from "@/components/Records/Search/Output/AssociatedRecordsSummary.vue";

import associatedRecords from "../../../../../fixtures/associatedRecords.json";

describe("AssociatedRecordsSummary.vue", function () {
  let wrapper;
  beforeEach(() => {
    wrapper = shallowMount(AssociatedRecordsSummary, {
      propsData: associatedRecords.propsData,
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("AssociatedRecordsSummary");
    expect(wrapper.vm.associatedRecords.registry).toMatch("standard");
  });

  it("can check setRecordLabels method", () => {
    expect(wrapper.vm.setRecordLabels("standard")).toBe("Linked Standards");
    expect(wrapper.vm.setRecordLabels("database")).toBe("Linked Databases");
    expect(wrapper.vm.setRecordLabels("policy")).toBe("Linked Policies");
    expect(wrapper.vm.setRecordLabels("collection")).toBe("Linked Collections");
  });
});
