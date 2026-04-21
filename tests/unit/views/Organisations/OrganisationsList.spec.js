import { shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import { createVuetify } from "vuetify";

import GraphClient from "@/lib/GraphClient/GraphClient";
import allOrganisationsQuery from "@/lib/GraphClient/queries/getAllOrganisations.json";
import OrganisationsList from "@/views/Organisations/OrganisationsList";

const vuetify = createVuetify();

describe("OrganisationsList.vue", () => {
  let wrapper;

  const organisationsDataList = [
    {
      id: 1,
      name: "one",
      homepage: "http://abc.com",
      rorLink: "http://ror.link12",
    },
  ];

  let graphStub;

  graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
  graphStub.withArgs(allOrganisationsQuery).returns({
    allOrganisations: organisationsDataList,
  });

  afterAll(() => {
    graphStub.restore();
  });

  beforeEach(async () => {
    wrapper = await shallowMount(OrganisationsList, {
      vuetify,
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  afterAll(() => {
    graphStub.restore();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("OrganisationsList");
    expect(wrapper.vm.organisations).toStrictEqual(organisationsDataList);
  });
});
