import { createLocalVue, shallowMount } from "@vue/test-utils";

import OrganisationsTable from "@/components/Users/Profiles/Private/ViewOrganisations";
const localVue = createLocalVue();

describe("ViewOrganisations", () => {
  let wrapper;

  it("can be mounted", () => {
    wrapper = shallowMount(OrganisationsTable, {
      localVue,
      propsData: {
        organisations: [],
      },
    });
    const title = "ViewOrganisations";
    expect(wrapper.vm.$options.name).toMatch(title);
    expect(wrapper.vm.perPage).toBe(5);
  });

  it("can process organisation types", () => {
    wrapper = shallowMount(OrganisationsTable, {
      localVue,
      propsData: {
        organisations: [],
      },
    });
    let obj = [
      {
        name: "one",
      },
      {
        name: "two",
      },
    ];
    expect(wrapper.vm.objToList(obj)).toEqual("one, two");
  });
});
