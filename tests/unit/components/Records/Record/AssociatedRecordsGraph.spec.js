import { shallowMount } from "@vue/test-utils"
import AssociatedRecordsGraph from "@/components/Records/Record/AssociatedRecordsGraph"
import recordAssociations from "@/../tests/fixtures/recordAssociations.json"

describe("AssociatedRecordsGraph.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(AssociatedRecordsGraph, {
      propsData: recordAssociations.propsData
    });
  });

  it("can be mounted", () => {
      expect(wrapper.name()).toMatch("AssociatedRecordsGraph");
  });

});
