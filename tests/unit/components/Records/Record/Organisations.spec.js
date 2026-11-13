import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";
import Organisations from "@/components/Records/Record/Organisations.vue";
import Record from "@/store/recordData.js";
import { VIconStub, VSlotStub, VTooltipStub } from "../../../../stubs/index.js";

const vuetify = createVuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      organisations: "description tooltip.",
    },
  },
};

Record.state.currentRecord["fairsharingRecord"] = {
  organisationLinks: [
    {
      relation: "funds",
      organisation: {
        id: 1,
        name: "Organisation One",
        types: ["exciting", "thrilling"],
      },
      grant: {
        name: "generous grant",
        id: 1,
      },
    },
    {
      relation: "maintains",
      organisation: {
        id: 2,
        name: "Organisation Two",
        types: [],
      },
    },
    {
      relation: "funds",
      organisation: {
        id: 1,
        name: "Organisation One",
        types: ["exciting", "thrilling"],
      },
      grant: {
        name: "generous grant 2",
        id: 2,
      },
    },
  ],
  subjects: [],
  domains: [],
  taxonomies: [],
  userDefinedTags: [],
  organisations: [{ id: 1119 }],
};
const initialRecord = structuredClone(
  Record.state.currentRecord.fairsharingRecord,
);
const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor,
  },
});

describe("Organisations.vue", function () {
  let wrapper;

  beforeEach(() => {
    $store.state.record.currentRecord.fairsharingRecord =
      structuredClone(initialRecord);
    wrapper = shallowMount(Organisations, {
      global: {
        plugins: [vuetify, $store],
        stubs: {
          VCard: VSlotStub,
          VCardTitle: VSlotStub,
          VCardText: VSlotStub,
          VChip: VSlotStub,
          VTooltip: VTooltipStub,
          VIcon: VIconStub,
        },
      },
      props: { inlineStyle: true },
    });
  });

  afterEach(() => wrapper.unmount());

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Organisations");
    expect(
      wrapper.vm.getField("organisationLinks")[0].organisation.name,
    ).toMatch("Organisation One");
    expect(wrapper.vm.getField("organisationLinks")[0].grant.name).toMatch(
      "generous grant",
    );
    expect(
      wrapper.vm.getField("organisationLinks")[1].organisation.name,
    ).toMatch("Organisation Two");
    expect(wrapper.vm.getField("organisationLinks")[1].grant).toBe(undefined);
  });

  it("counts relations correctly", () => {
    expect(wrapper.vm.getRelations("funds").length).toEqual(1);
  });

  it("groups grants by organisation ID while preserving different organisations", () => {
    const links = wrapper.vm.getField("organisationLinks");
    links.push({
      relation: "funds",
      organisation: { id: 3, name: "Third", types: [] },
      grant: { id: 3, name: "Third grant" },
    });
    const groups = wrapper.vm.getRelations("funds");
    expect(groups.map((g) => g.organisation.id)).toEqual([1, 3]);
    expect(groups[0].grants.map((g) => g.name)).toEqual([
      "generous grant",
      "generous grant 2",
    ]);
    expect(groups[1].grants).toEqual([{ id: 3, name: "Third grant" }]);
    expect(links[0]).not.toHaveProperty("grants");
    expect(wrapper.vm.getRelations("missing")).toEqual([]);
  });

  it("combines maintaining, collaborating and associated organisations in inline order", async () => {
    wrapper.vm.getField("organisationLinks").push(
      {
        relation: "associated_with",
        organisation: { id: 4, name: "Associated", types: [] },
      },
      {
        relation: "collaborates_on",
        organisation: { id: 3, name: "Collaborator", types: [] },
      },
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.jointOrganisations.map((g) => g.organisation.id)).toEqual(
      [2, 3, 4],
    );
    expect(wrapper.findAll("a").map((a) => a.attributes("href"))).toEqual([
      "/organisations/2",
      "/organisations/3",
      "/organisations/4",
    ]);
    expect(wrapper.findAll("a").map((a) => a.text())).toEqual([
      "Organisation Two ,",
      "Collaborator ,",
      "Associated",
    ]);
    expect(wrapper.text()).toContain("description tooltip.");
  });

  it.each([[], null, undefined])(
    "shows N/A for inline records with organisations=%j",
    async (organisations) => {
      $store.state.record.currentRecord.fairsharingRecord.organisations =
        organisations;
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("Organisations");
      expect(wrapper.text()).toContain("N/A");
      expect(wrapper.findAll("a")).toHaveLength(0);
    },
  );

  it("shows N/A when an inline record only has funding links", async () => {
    $store.state.record.currentRecord.fairsharingRecord.organisationLinks =
      wrapper.vm
        .getField("organisationLinks")
        .filter((l) => l.relation === "funds");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.jointOrganisations).toEqual([]);
    expect(wrapper.text()).toContain("N/A");
  });

  it("renders relation cards, lead and ROR links, types and multiple grants", async () => {
    const links = wrapper.vm.getField("organisationLinks");
    links[0].isLead = true;
    links[0].organisation.rorLink = "https://ror.org/example";
    await wrapper.setProps({ inlineStyle: false, backColor: "grey" });
    expect(wrapper.findComponent({ name: "SectionTitle" }).props("title")).toBe(
      "Organisations",
    );
    expect(wrapper.attributes("color")).toBe("grey");
    expect(wrapper.text()).toContain("Organisations funding this resource");
    expect(wrapper.text()).toContain("Organisations maintaining this resource");
    expect(wrapper.text()).not.toContain("Collaborating organisations");
    expect(wrapper.find('a[href="/organisations/1"]').text()).toContain("Lead");
    expect(
      wrapper.find('a[href="https://ror.org/example"] img').attributes("alt"),
    ).toContain("Research Organisation Registry");
    expect(wrapper.text()).toContain("(exciting, thrilling)");
    expect(wrapper.text()).toContain("Grants:");
    expect(wrapper.text()).toMatch(/generous grant\s*,\s*generous grant 2/);
    expect(wrapper.findAll("strong")).toHaveLength(2);
  });

  it("renders a single grant while omitting Undefined organisation types", async () => {
    $store.state.record.currentRecord.fairsharingRecord.organisationLinks = [
      {
        relation: "funds",
        organisation: { id: 1, name: "Funder", types: ["Undefined"] },
        grant: { id: 1, name: "Single grant" },
      },
    ];
    await wrapper.setProps({ inlineStyle: false });
    expect(wrapper.text()).toMatch(/Grant:\s*Single grant/);
    expect(wrapper.text()).not.toContain("Grants:");
    expect(wrapper.text()).not.toContain("(Undefined)");
    expect(wrapper.text()).not.toContain("Lead");
  });

  it("renders N/A for an empty non-inline record", async () => {
    $store.state.record.currentRecord.fairsharingRecord.organisations = [];
    await wrapper.setProps({ inlineStyle: false });
    expect(wrapper.text()).toContain("N/A");
    expect(wrapper.findComponent({ name: "SectionTitle" }).exists()).toBe(
      false,
    );
  });
});
