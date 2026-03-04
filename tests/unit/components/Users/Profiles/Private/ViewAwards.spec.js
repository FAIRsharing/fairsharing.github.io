import { shallowMount  } from "@vue/test-utils";

import AwardsTable from "@/components/Users/Profiles/Private/ViewAwards";

describe("ViewAwards", () => {
  let wrapper;

  it("can be mounted", () => {
    wrapper = shallowMount(AwardsTable, {
      propsData: {
        organisations: [],
      },
    });
    const title = "ViewAwards";
    expect(wrapper.vm.$options.name).toMatch(title);
    expect(wrapper.vm.perPage).toBe(5);
  });

  // No other functions exist to be tested...
});
