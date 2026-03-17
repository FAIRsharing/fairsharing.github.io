import { shallowMount } from "@vue/test-utils";

import SectionTitle from "@/components/Records/Record/SectionTitle.vue";

describe("SectionTitle.vue", function () {
  let wrapper;

  // TODO: Mock properties in options {}.
  beforeEach(() => {
    wrapper = shallowMount(SectionTitle, {
      props: {
        title: "Exciting Title",
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SectionTitle");
    expect(wrapper.vm.title).toMatch("Exciting Title");
  });
});
