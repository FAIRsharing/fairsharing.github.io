import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import SearchOrganisationRecords from "@/components/Organisations/SearchOrganisationRecords.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

const vuetify = new Vuetify();

let organisation = {
  id: 1,
  name: "4DN Data Coordination and Integration Center",
  alternativeNames: [],
  homepage: "http://dcic.4dnucleome.org/",
  rorLink: "https://roro.roror.ror",
  types: ["Consortium"],
  urlForLogo: "/logo12345678",
  childOrganisations: [],
  parentOrganisations: [],
  organisationLinks: [
    {
      id: 6057,
      isLead: true,
      relation: "maintains",
      fairsharingRecord: {
        id: 872,
        name: "Pairs file format",
        abbreviation: ".pairs",
        type: "model_and_format",
        registry: "Standard",
        status: "ready",
      },
      grant: null,
    },
  ],
  users: [],
  countries: [],
};

describe("SearchOrganisationRecords.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(SearchOrganisationRecords, {
      localVue,
      vuetify,
      propsData: { organisation: organisation },
      stubs: ["router-link", "router-view"],
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SearchOrganisationRecords");
  });

  it("gets abbreviations", () => {
    let record = {
      name: "name",
    };
    expect(wrapper.vm.getAbbr(record)).toBe("");
    record.abbreviation = "n";
    expect(wrapper.vm.getAbbr(record)).toEqual("(n)");
  });

  it("reformats links", () => {
    let before = [
      {
        isLead: true,
        relation: true,
        fairsharingRecord: {
          name: "test",
        },
      },
    ];
    let after = [
      {
        isLead: true,
        relation: true,
        name: "test",
      },
    ];
    expect(wrapper.vm.reformatLinks(before)).toStrictEqual(after);
  });
});
