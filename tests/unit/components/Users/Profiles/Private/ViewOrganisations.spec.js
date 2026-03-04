import { shallowMount  } from "@vue/test-utils";

import OrganisationsTable from "@/components/Users/Profiles/Private/ViewOrganisations";

describe("ViewOrganisations", () => {
  let wrapper;

  it("can be mounted", () => {
    wrapper = shallowMount(OrganisationsTable, {
      props: {
        organisations: [],
      },
    });
    const title = "ViewOrganisations";
    expect(wrapper.vm.$options.name).toMatch(title);
    expect(wrapper.vm.perPage).toBe(5);
  });

  it("can process organisation types", () => {
    wrapper = shallowMount(OrganisationsTable, {
      props: {
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
