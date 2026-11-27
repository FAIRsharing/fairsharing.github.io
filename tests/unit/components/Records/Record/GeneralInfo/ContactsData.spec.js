import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import ContactsData from "@/components/Records/Record/GeneralInfo/ContactsData";
import Record from "@/store/recordData.js";
import { VIconStub, VTooltipStub } from "../../../../../stubs/index.js";

const vuetify = createVuetify();

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      contacts: "contacts tooltip.",
    },
  },
};

Record.state.currentRecord["fairsharingRecord"] = {
  doi: "FAIRsharing.wibble",
  subjects: [],
  domains: [],
  taxonomies: [],
  userDefinedTags: [{ label: "a" }],
  metadata: { contacts: {} },
};
const initialRecord = structuredClone(Record.state.currentRecord);
const $store = new Vuex.Store({
  modules: {
    record: Record,
    editor: editor,
  },
});

describe("ContactsData.vue", function () {
  let wrapper;

  beforeEach(() => {
    $store.commit("record/setCurrentRecord", structuredClone(initialRecord));
    wrapper = shallowMount(ContactsData, {
      vuetify,
      mocks: { $store },
      stubs: { VIcon: VIconStub, VTooltip: VTooltipStub },
    });
  });

  afterEach(() => wrapper?.unmount());

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ContactsData");
  });

  it.each([[undefined], [null], [[]]])(
    "shows None when contacts are %s",
    async (contacts) => {
      $store.state.record.currentRecord.fairsharingRecord.metadata.contacts =
        contacts;
      await wrapper.vm.$nextTick();
      expect(wrapper.text()).toContain("Contacts");
      expect(wrapper.text()).toContain("None");
      expect(wrapper.text()).toContain("contacts tooltip.");
      expect(wrapper.find("a").exists()).toBe(false);
      expect(wrapper.find('[data-test="v-icon"]').exists()).toBe(true);
    },
  );

  it("renders contact email links, web links and ORCID links with separators", async () => {
    $store.state.record.currentRecord.fairsharingRecord.metadata.contacts = [
      {
        contact_name: "Support",
        contact_email: "support@example.org",
        contact_orcid: "0000-0001-2345-6789",
      },
      { contact_name: "Help desk", contact_email: "https://example.org/help" },
      { contact_orcid: "0000-0002-2345-6789" },
    ];
    await wrapper.vm.$nextTick();
    const links = wrapper.findAll("a");
    expect(links.map((link) => link.attributes("href"))).toEqual([
      "mailto:support@example.org",
      "https://orcid.org/0000-0001-2345-6789",
      "https://example.org/help",
      "https://orcid.org/0000-0002-2345-6789",
    ]);
    expect(links.every((link) => link.attributes("target") === "_blank")).toBe(
      true,
    );
    expect(links[0].text()).toBe("Support");
    expect(links[0].classes()).not.toContain("ml-1");
    expect(links[2].text()).toBe("Help desk");
    expect(links[2].classes()).toContain("ml-1");
    expect(
      wrapper.findAll("span").filter((span) => span.text() === ","),
    ).toHaveLength(2);
    expect(
      wrapper
        .findAllComponents({ name: "Icon" })
        .map((icon) => icon.props("item")),
    ).toEqual(["Orcid", "Orcid"]);
    expect(wrapper.text()).toContain("contacts tooltip.");
    expect(wrapper.text()).not.toContain("None");
  });

  it("reacts to replacing the record and removing its only contact", async () => {
    $store.commit("record/setCurrentRecord", {
      fairsharingRecord: {
        ...structuredClone(initialRecord.fairsharingRecord),
        metadata: {
          contacts: [
            { contact_name: "Team", contact_email: "team@example.org" },
          ],
        },
      },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.get("a").attributes("href")).toBe("mailto:team@example.org");
    expect(wrapper.findAll("span").some((span) => span.text() === ",")).toBe(
      false,
    );
    $store.state.record.currentRecord.fairsharingRecord.metadata.contacts.splice(
      0,
      1,
    );
    await wrapper.vm.$nextTick();
    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.text()).toContain("None");
  });
});
