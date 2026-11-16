import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { h, nextTick } from "vue";
import Vuex from "vuex";
import editPublications from "@/components/Editor/EditPublications.vue";
import ExternalClient from "@/lib/Client/ExternalClients.js";
import RestClient from "@/lib/Client/RESTClient.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import editorStore from "@/store/editor.js";
import recordStore from "@/store/recordData.js";
import userStore from "@/store/users.js";
import {
  VBtnStub,
  VFormStub,
  VTextFieldStub,
  VTooltipStub,
} from "../../../stubs/index.js";

const sinon = require("sinon");

let pubs = [
  {
    title: "Hello",
    id: 1,
  },
  {
    title: "World",
    id: 2,
  },
];

recordStore.state.sections = {
  publications: {
    data: JSON.parse(JSON.stringify(pubs)),
    error: false,
    changes: 0,
    initialData: JSON.parse(JSON.stringify(pubs)),
  },
  generalInformation: {
    data: {
      metadata: {
        citations: [{ publication_id: 2 }],
      },
    },
  },
  record: { fairsharingRecord: { id: 1243 } },
};
recordStore.state.sections.publications.data[0].tablePosition = 123;
editorStore.state.availablePublications = [
  {
    title: "World",
    id: 2,
  },
];
userStore.state.user().credentials.token = "thisisatoken";
const $store = new Vuex.Store({
  modules: {
    users: userStore,
    record: recordStore,
    editor: editorStore,
  },
});
let $route = { path: "/123/edit", params: { id: 123 } };

const $router = { push: vi.fn() };
const $scrollTo = vi.fn();

let graphStub;
let restStub;
let fetchStub;

const article = {
  "container-title-short": "Science",
  "container-title": "Very Science Indeed",
  DOI: "10.1126/science.2781282",
  title:
    "Contragestion and other clinical applications of {RU} 486, an antiprogesterone at the receptor",
  URL: "https://doi.org/10.1126%2Fscience.2781282",
  created: {
    "date-parts": [1989, 3, 2],
  },
  author: [
    {
      given: "E.",
      family: "Baulieu",
    },
  ],
};
const article_zenodo_4 = {
  metadata: {
    publication_date: "1989-3-12",
    title:
      "Contragestion and other clinical applications of {RU} 486, an antiprogesterone at the receptor",
    creators: [
      {
        name: "Baulieu, E.",
      },
    ],
    upload_type: "no_publication",
  },
  doi: "10.1126/science.2781282",
  links: {
    doi: "https://doi.org/10.1126%2Fscience.2781282",
  },
};
const article_zenodo_api = {
  created: "2026-06-29T16:45:25.276360+00:00",
  doi: "10.5281/zenodo.20703770",
  doi_url: "https://doi.org/10.5281/zenodo.20703770",
  metadata: {
    title: "FAIR Assessment – ESRF-PaNOSC Pilot - Conceptual Requirements",
    doi: "10.5281/zenodo.20703770",
    publication_date: "2026-06-29",
    creators: [
      {
        name: "Duyme, Renaud",
      },
    ],
    resource_type: {
      title: "Publication",
      type: "publication",
    },
  },
  links: {
    doi: "https://doi.org/10.5281/zenodo.20703770",
  },
};

describe("EditPublications.vue", function () {
  let wrapper;
  beforeEach(async () => {
    $store.state.users.user = () => ({
      is_curator: false,
      credentials: { token: "thisisatoken" },
    });
    VFormStub.methods.validate.mockClear();
    $store.state.record.sections.publications = {
      data: JSON.parse(JSON.stringify(pubs)),
      error: false,
      message: null,
      changes: 0,
      initialData: JSON.parse(JSON.stringify(pubs)),
    };
    $store.state.record.sections.publications.data[0].tablePosition = 123;
    $store.state.record.sections.generalInformation = {
      data: {
        metadata: {
          citations: [{ publication_id: 2 }],
        },
      },
    };
    $store.state.editor.availablePublications = [{ title: "World", id: 2 }];
    graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
    graphStub.returns({
      searchPublications: [
        { title: "Hello", id: 1 },
        { title: "title", doi: "123" },
        { title: "title" },
      ],
    });
    wrapper = shallowMount(editPublications, {
      global: {
        plugins: [$store],
        mocks: { $route, $router, $scrollTo },
        renderStubDefaultSlot: true,
        stubs: {
          VBtn: VBtnStub,
          VForm: VFormStub,
          VDialog: {
            name: "VDialog",
            props: ["modelValue"],
            emits: ["update:modelValue"],
            render() {
              return h("div", this.$slots.default?.());
            },
          },
          VTextField: {
            ...VTextFieldStub,
            props: {
              ...VTextFieldStub.props,
              modelValue: {
                type: [String, Number],
                default: "",
              },
            },
          },
          VTooltip: VTooltipStub,
        },
      },
    });
    await flushPromises();
  });
  afterEach(async () => {
    await flushPromises();
    wrapper.unmount();
    graphStub.restore();
    restStub?.restore();
    fetchStub?.restore();
    restStub = null;
    fetchStub = null;
    vi.restoreAllMocks();
    $router.push.mockClear();
    $scrollTo.mockClear();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("EditPublications");
    expect(wrapper.vm.section.data).toStrictEqual(
      $store.state.record.sections.publications.data,
    );
    expect(wrapper.vm.metadata).toStrictEqual(
      $store.state.record.sections.generalInformation.data.metadata,
    );
  });

  it("can check computed message() when error is true", () => {
    $store.state.record.sections.publications.error = true;
    expect(wrapper.vm.message.type()).toBe("error");
  });

  it("can check computed message() when error is false", () => {
    $store.state.record.sections.publications.error = false;
    expect(wrapper.vm.message.type()).toBe("success");
  });

  it("can get a DOI from https://dx.doi.org/", async () => {
    fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
    fetchStub.returns({ data: article });
    const expectedArticle = {
      authors: "Baulieu, E.; ",
      doi: "10.1126/science.2781282",
      title:
        "Contragestion and other clinical applications of {RU} 486, an antiprogesterone at the receptor",
      journal: "Science",
      url: "https://doi.org/10.1126%2Fscience.2781282",
      year: 1989,
      isCitation: false,
    };
    wrapper.vm.search = "amIaDoi?";
    const getDOIButton = wrapper.get("[data-testid='getDOI-button']");
    await getDOIButton.trigger("click");
    await flushPromises();
    expect(fetchStub.calledOnce).toBe(true);
    expect(wrapper.vm.newPublication).toStrictEqual(expectedArticle);
    fetchStub.restore();
  });

  it("can get a Zenodo DOI from the DOI endpoint", async () => {
    fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
    fetchStub.returns({ data: article_zenodo_api });
    const expectedArticle = {
      authors: "Duyme, Renaud; ",
      doi: "10.5281/zenodo.20703770",
      title: "FAIR Assessment – ESRF-PaNOSC Pilot - Conceptual Requirements",
      journal: null,
      url: "https://doi.org/10.5281/zenodo.20703770",
      year: 2026,
      isCitation: false,
    };
    wrapper.vm.search = "10.5281/zenodo.20703770";
    await wrapper.vm.getDOI();
    expect(wrapper.vm.errors.doi).toBe(null);
    expect(wrapper.vm.newPublication).toStrictEqual(expectedArticle);
    fetchStub.restore();
  });

  it("When getting a DOI can process errors from calls 2", async () => {
    fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
    fetchStub.returns({
      data: { error: { response: { data: "Im an error" } } },
    });
    wrapper.vm.search = "amIaDoi?";
    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({ data: { message: "this is a message" } });
    await wrapper.vm.getDOI();
    expect(wrapper.vm.errors.doi).toBe(true);
    fetchStub.restore();
    restStub.restore();

    fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
    fetchStub.returns({
      data: { error: { response: { data: "Im an error" } } },
    });
    wrapper.vm.search = "amIaDoi?";
    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({ data: [] });
    await wrapper.vm.getDOI();
    expect(wrapper.vm.errors.doi).toBe(true);
    fetchStub.restore();
    restStub.restore();

    fetchStub = sinon.stub(ExternalClient.prototype, "executeQuery");
    fetchStub.returns({
      data: { error: { response: { data: "Im an error" } } },
    });
    wrapper.vm.search = "amIaDoi?";
    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({ data: article_zenodo_4 });
    await wrapper.vm.getDOI();
    expect(wrapper.vm.errors.doi).toBe(true);
    fetchStub.restore();
    restStub.restore();
  });

  it("can check for showEmptySearch in getDOI method", async () => {
    wrapper.vm.search = null;
    await wrapper.vm.getDOI();
    expect(wrapper.vm.showEmptySearch).toBe(true);
  });

  it("can check for showEmptySearch in getPMID method", async () => {
    wrapper.vm.search = null;
    await wrapper.vm.getPMID();
    expect(wrapper.vm.showEmptySearch).toBe(true);
  });

  it("can edit an added publication", () => {
    let newPub = {};
    wrapper.vm.editPublication(newPub, 0);
    expect(wrapper.vm.newPublication).toStrictEqual({});
  });

  it("can update a record", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    $store.state.record.sections.publications.changes = 0;
    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({ data: { id: 123 } });
    wrapper.vm.publications = [];
    wrapper.vm.publications.push({ id: 3, isCitation: true });
    wrapper.vm.publications.push({ id: 4, isCitation: false });
    await wrapper.vm.saveRecord(true, { textContent: "Save and exit" });
    expect($router.push).toHaveBeenCalledWith({ path: "/123" });
    expect($router.push).toHaveBeenCalledTimes(1);

    const saveRecordContinueButton = wrapper.get(
      "[data-testid='saveRecordContinue-button']",
    );
    await saveRecordContinueButton.trigger("click");
    await flushPromises();
    expect($store.state.record.sections.publications.changes).toEqual(0);
    restStub.returns({ data: { error: { response: { data: "error" } } } });

    const saveRecordExitButton = wrapper.get(
      "[data-testid='saveRecordExit-button']",
    );
    await saveRecordExitButton.trigger("click");
    await flushPromises();
    expect($store.state.record.sections.publications.error).toBe(true);
    expect($store.state.record.sections.publications.message).toStrictEqual({
      response: { data: "error" },
    });
    restStub.restore();
    vi.clearAllMocks();
  });

  it("can toggle a citation", () => {
    $store.state.record.sections = {
      publications: {
        data: JSON.parse(JSON.stringify(pubs)),
        error: false,
        changes: 0,
        initialData: JSON.parse(JSON.stringify(pubs)),
      },
      generalInformation: {
        data: {
          metadata: {
            citations: [{ publication_id: 2 }],
          },
        },
      },
      record: { fairsharingRecord: { id: 1243 } },
    };
    wrapper.vm.publications[0].isCitation = true;
    wrapper.vm.toggleCitation(0);
    expect(wrapper.vm.publications[0].isCitation).toBe(false);
    wrapper.vm.toggleCitation(0);
    expect(wrapper.vm.publications[0].isCitation).toBe(true);
  });

  it("can check for saveRecord method when saves record changes and stays on page", async () => {
    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({ data: { id: 123 } });
    const mockEvent = { target: { textContent: "Save and continue" } };
    await wrapper.vm.saveRecord(false, mockEvent.target);
    expect(wrapper.vm.continueLoader).toBe(false);
    expect(wrapper.vm.exitLoader).toBe(false);
    expect($scrollTo).toHaveBeenCalledWith("#mainHeader");
    restStub.restore();
  });

  it("can check for saveRecord method when saves record changes and exits", async () => {
    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.returns({ data: { id: 123 } });
    const mockEvent = { target: { textContent: "Save and exit" } };
    await wrapper.vm.saveRecord(true, mockEvent.target);
    expect(wrapper.vm.exitLoader).toBe(false);
    expect($router.push).toHaveBeenCalledWith({ path: "/123" });
    restStub.restore();
  });

  it("handles search text-field v-model updates", async () => {
    await wrapper.setData({ search: "initial search" });
    const form = wrapper.findComponent({ name: "v-text-field" });
    expect(form.props("modelValue")).toBe("initial search");
    await form.vm.$emit("update:modelValue", "updated search");
    expect(wrapper.vm.search).toBe("updated search");
  });

  it("handles publications data-table v-model updates", async () => {
    let output = [
      {
        id: 1,
        tablePosition: 0,
        title: "Hello",
      },
      {
        id: 2,
        title: "World",
      },
    ];
    await nextTick();
    const form = wrapper.findComponent({ name: "v-data-table" });
    expect(form.props("modelValue")).toStrictEqual(output);
    await form.vm.$emit("update:modelValue", [output[1]]);
    expect(wrapper.vm.publications).toStrictEqual([output[1]]);
  });

  it("handles subFormValid form v-model updates", async () => {
    await wrapper.setData({ subFormValid: false });
    const form = wrapper.findComponent({ name: "v-form" });
    expect(form.props("modelValue")).toBe(false);
    await form.vm.$emit("update:modelValue", true);
    expect(wrapper.vm.subFormValid).toBe(true);
  });

  it("handles newPublication.doi text-field v-model updates", async () => {
    wrapper.vm.createNewPublication();
    await nextTick();
    //Find all stubbed text fields and filter for the DOI one
    const textFields = wrapper.findAllComponents({ name: "VTextField" });
    const doiField = textFields.find((field) => field.props("label") === "DOI");

    // Safety check to ensure VTU found the field
    expect(doiField.exists()).toBe(true);
    expect(doiField.props("modelValue")).toBe("");
    await doiField.vm.$emit("update:modelValue", "10.1038/nature12345");
    expect(wrapper.vm.newPublication.doi).toBe("10.1038/nature12345");
  });

  it("handles newPublication.pubmed_id text-field v-model updates", async () => {
    wrapper.vm.createNewPublication();
    await nextTick();
    const textFields = wrapper.findAllComponents({ name: "VTextField" });
    const pubmedField = textFields.find(
      (field) => field.props("label") === "PubMed ID",
    );
    expect(pubmedField.exists()).toBe(true);
    expect(pubmedField.props("modelValue")).toBe("");
    await pubmedField.vm.$emit("update:modelValue", "12345678");
    expect(wrapper.vm.newPublication.pubmed_id).toBe("12345678");
  });

  it("handles newPublication.title text-field v-model updates", async () => {
    wrapper.vm.createNewPublication();
    await nextTick();
    const textFields = wrapper.findAllComponents({ name: "VTextField" });
    const titleField = textFields.find(
      (field) => field.props("label") === "Title",
    );
    expect(titleField.exists()).toBe(true);
    expect(titleField.props("modelValue")).toBe("");
    await titleField.vm.$emit("update:modelValue", "dummytitle");
    expect(wrapper.vm.newPublication.title).toBe("dummytitle");
  });

  it("handles newPublication.authors text-field v-model updates", async () => {
    wrapper.vm.createNewPublication();
    await nextTick();
    const textFields = wrapper.findAllComponents({ name: "VTextField" });
    const authorsField = textFields.find(
      (field) => field.props("label") === "Authors",
    );
    expect(authorsField.exists()).toBe(true);
    expect(authorsField.props("modelValue")).toBe("");
    await authorsField.vm.$emit("update:modelValue", "Doe, J., Smith, A.");
    expect(wrapper.vm.newPublication.authors).toBe("Doe, J., Smith, A.");
  });

  it("handles newPublication.journal text-field v-model updates", async () => {
    wrapper.vm.createNewPublication();
    await nextTick();
    const textFields = wrapper.findAllComponents({ name: "VTextField" });
    const journalField = textFields.find(
      (field) => field.props("label") === "Journal",
    );
    expect(journalField.exists()).toBe(true);
    expect(journalField.props("modelValue")).toBe("");
    await journalField.vm.$emit("update:modelValue", "DummyJournal");
    expect(wrapper.vm.newPublication.journal).toBe("DummyJournal");
  });

  it("handles newPublication.year text-field v-model updates", async () => {
    wrapper.vm.createNewPublication();
    await nextTick();
    const textFields = wrapper.findAllComponents({ name: "VTextField" });
    const yearField = textFields.find(
      (field) => field.props("label") === "Publication Year",
    );
    expect(yearField.exists()).toBe(true);
    expect(yearField.props("modelValue")).toBe("");
    await yearField.vm.$emit("update:modelValue", 2000);
    expect(wrapper.vm.newPublication.year).toBe(2000);
  });

  it("handles newPublication.url text-field v-model updates", async () => {
    wrapper.vm.createNewPublication();
    await nextTick();
    const textFields = wrapper.findAllComponents({ name: "VTextField" });
    const urlField = textFields.find((field) => field.props("label") === "URL");
    expect(urlField.exists()).toBe(true);
    await urlField.vm.$emit("update:modelValue", "www.test.com");
    expect(wrapper.vm.newPublication.url).toBe("www.test.com");
  });

  it("closes the editor when the Cancel button is clicked", async () => {
    await wrapper.setData({ openEditor: true });
    expect(wrapper.vm.openEditor).toBe(true);
    const buttons = wrapper.findAllComponents({ name: "VBtn" });
    const cancelButton = buttons.find((btn) => btn.text().trim() === "Cancel");
    expect(cancelButton.exists()).toBe(true);
    await cancelButton.trigger("click");
    expect(wrapper.vm.openEditor).toBe(false);
  });

  it("handles showEmptySearch dialog v-model updates", async () => {
    await wrapper.setData({ showEmptySearch: false });
    const dialogs = wrapper.findAllComponents({ name: "VDialog" });
    const searchDialog = dialogs.find((dialog) =>
      dialog.text().includes("Search Term Missing"),
    );
    expect(searchDialog.exists()).toBe(true);
    await searchDialog.vm.$emit("update:modelValue", true);
    expect(wrapper.vm.showEmptySearch).toBe(true);
  });

  it("closes showEmptySearch dialog when the OK button is clicked", async () => {
    await wrapper.setData({ showEmptySearch: true });
    expect(wrapper.vm.showEmptySearch).toBe(true);
    const buttons = wrapper.findAllComponents({ name: "VBtn" });
    const okButton = buttons.find((btn) => btn.text().trim() === "OK");
    expect(okButton.exists()).toBe(true);
    await okButton.trigger("click");
    expect(wrapper.vm.showEmptySearch).toBe(false);
  });

  it.each([
    [undefined, null],
    [null, null],
    [2020, 2020],
    ["2021-03-12", 2021],
    ["not-a-date", null],
    [[2022, 3, 12], 2022],
    [{ "date-parts": [[2023, 4, 5]] }, 2023],
    [{ unexpected: true }, null],
  ])("extracts a year from %j", (input, expected) => {
    expect(wrapper.vm.extractPublicationYear(input)).toBe(expected);
  });

  it("recognises supported Zenodo publication types", () => {
    expect(wrapper.vm.isZenodoPublication({})).toBe(false);
    expect(wrapper.vm.isZenodoPublication({ metadata: {} })).toBeFalsy();
    expect(
      wrapper.vm.isZenodoPublication({
        metadata: { upload_type: "publication" },
      }),
    ).toBe(true);
    expect(
      wrapper.vm.isZenodoPublication({
        metadata: { resource_type: { type: "publication" } },
      }),
    ).toBe(true);
    expect(
      wrapper.vm.isZenodoPublication({
        metadata: { resource_type: { type: "dataset" } },
      }),
    ).toBe(false);
    expect(wrapper.vm.setZenodoPublication({ metadata: {} })).toBe(false);
  });

  it("uses Zenodo fallback fields and its creation date", () => {
    expect(
      wrapper.vm.setZenodoPublication({
        created: "2020-01-02",
        title: "Fallback title",
        doi_url: "https://example.org/publication",
        metadata: {
          upload_type: "publication",
          creators: [{ name: "Author" }, {}],
          meeting: { title: "Conference" },
        },
      }),
    ).toBe(true);
    expect(wrapper.vm.newPublication).toEqual({
      journal: "Conference",
      doi: null,
      title: "Fallback title",
      url: "https://example.org/publication",
      year: 2020,
      authors: "Author; ",
      isCitation: false,
    });
  });

  it("uses Crossref date, author, and journal fallbacks", () => {
    wrapper.vm.setCrossrefPublication({
      "published-online": { "date-parts": [[2021]] },
      "container-title": "Journal",
      title: "Paper",
      author: [{ name: "Organisation" }, {}, { family: "Doe" }],
    });
    expect(wrapper.vm.newPublication.year).toBe(2021);
    expect(wrapper.vm.newPublication.journal).toBe("Journal");
    expect(wrapper.vm.newPublication.authors).toBe("Organisation; Doe; ");

    wrapper.vm.setCrossrefPublication({
      published: { "date-parts": [[2022]] },
      title: "Title as journal",
    });
    expect(wrapper.vm.newPublication.year).toBe(2022);
    expect(wrapper.vm.newPublication.journal).toBe("Title as journal");
    expect(wrapper.vm.newPublication.authors).toBe("");

    wrapper.vm.setCrossrefPublication({
      "published-print": { "date-parts": [[2023]] },
      title: "Print",
    });
    expect(wrapper.vm.newPublication.year).toBe(2023);

    wrapper.vm.setCrossrefPublication({
      issued: { "date-parts": [[2024]] },
      title: "Issued",
    });
    expect(wrapper.vm.newPublication.year).toBe(2024);
  });

  it("extracts a DOI from PubMed identifiers", () => {
    expect(wrapper.vm.processIDs(null)).toBe(null);
    expect(wrapper.vm.processIDs("pmid: 123")).toBe(null);
    expect(wrapper.vm.processIDs("pmid: 123. doi: 10.1000/example")).toBe(
      "10.1000/example",
    );
  });

  it("imports a PubMed result with a DOI", async () => {
    const getPMID = vi
      .spyOn(ExternalClient.prototype, "getPMID")
      .mockResolvedValue({
        result: {
          123: {
            title: "Paper",
            fulljournalname: "Journal",
            sortpubdate: "2020/01/01",
            authors: [{ name: "A" }, { name: "B" }],
            uid: "123",
            elocationid: "doi: 10.1000/example",
          },
        },
      });

    try {
      wrapper.vm.search = " 123 ";
      await wrapper.vm.getPMID();
      expect(getPMID).toHaveBeenCalledWith("123");
      expect(wrapper.vm.newPublication).toMatchObject({
        title: "Paper",
        journal: "Journal",
        year: 2020,
        authors: "A, B",
        pubmed_id: "123",
        doi: "10.1000/example",
        url: "https://doi.org/10.1000/example",
        isCitation: false,
      });
      expect(wrapper.vm.openEditor).toBe(true);
      expect(wrapper.vm.loadingPub).toBe(false);
    } finally {
      getPMID.mockRestore();
    }
  });

  it("imports a PubMed result without a DOI", async () => {
    const getPMID = vi
      .spyOn(ExternalClient.prototype, "getPMID")
      .mockResolvedValue({
        result: {
          123: {
            title: "Paper",
            fulljournalname: "Journal",
            sortpubdate: "2020/01/01",
            authors: [],
            uid: "123",
            elocationid: "",
          },
        },
      });

    try {
      wrapper.vm.search = "123";
      await wrapper.vm.getPMID();
      expect(wrapper.vm.newPublication.doi).toBeUndefined();
      expect(wrapper.vm.newPublication.url).toBe(
        "https://pubmed.ncbi.nlm.nih.gov/123",
      );
    } finally {
      getPMID.mockRestore();
    }
  });

  it("handles publication creation success and failure", async () => {
    const initialAvailableCount = wrapper.vm.availablePublications.length;
    restStub = sinon.stub(RestClient.prototype, "executeQuery");
    restStub.onFirstCall().resolves({
      data: { id: 3, title: "New paper" },
    });
    restStub.onSecondCall().resolves({
      data: { error: { response: { data: "Failed" } } },
    });

    try {
      wrapper.vm.newPublication = { title: "New paper", isCitation: false };
      await wrapper.vm.addPublication();
      expect(wrapper.vm.publications.find((pub) => pub.id === 3)).toMatchObject(
        {
          title: "New paper",
          tablePosition: initialAvailableCount,
        },
      );
      expect(wrapper.vm.search).toBe("New paper");
      expect(wrapper.vm.openEditor).toBe(false);

      wrapper.vm.newPublication = { title: "Failed paper" };
      await wrapper.vm.addPublication();
      expect(wrapper.vm.errors.general.response.data).toBe("Failed");
    } finally {
      restStub.restore();
      restStub = null;
    }
  });

  it("handles publication editing success and failure", async () => {
    const edit = vi
      .spyOn(RestClient.prototype, "editPublication")
      .mockResolvedValueOnce({ id: 1, title: "Edited paper" })
      .mockResolvedValueOnce({ error: { response: { data: "Failed" } } });

    try {
      wrapper.vm.currentPublicationIndex = 0;
      wrapper.vm.newPublication = {
        id: 1,
        title: "Edited paper",
        doi: "10.1000/edited",
        isCitation: true,
      };
      await wrapper.vm.addPublication();
      expect(wrapper.vm.publications[0]).toMatchObject({
        title: "Edited paper",
        isCitation: true,
      });
      expect(wrapper.vm.search).toBe("10.1000/edited");

      wrapper.vm.currentPublicationIndex = 0;
      wrapper.vm.newPublication = { id: 1, title: "Failed edit" };
      await wrapper.vm.addPublication();
      expect(wrapper.vm.errors.general.response.data).toBe("Failed");
    } finally {
      edit.mockRestore();
    }
  });

  it("edits and removes publications through their buttons", async () => {
    const edit = vi.spyOn(wrapper.vm, "editPublication");
    const remove = vi.spyOn(wrapper.vm, "removePublication");

    // Render the curator-only edit control.
    $store.state.users.user = () => ({
      is_curator: true,
      credentials: { token: "thisisatoken" },
    });
    await nextTick();

    const buttons = wrapper.findAllComponents({ name: "VBtn" });
    const editButton = buttons.find((button) =>
      button.text().includes("fas fa-pen"),
    );
    const removeButton = buttons.find((button) =>
      button.text().includes("fas fa-trash"),
    );

    expect(editButton).toBeDefined();
    expect(removeButton).toBeDefined();

    await editButton.trigger("click");
    expect(edit).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }), 0);

    await removeButton.trigger("click");
    expect(remove).toHaveBeenCalledWith(0);
    expect(
      wrapper.vm.publications.some((publication) => publication.id === 1),
    ).toBe(false);
  });

  it("toggles a citation through its switch", async () => {
    const toggle = vi.spyOn(wrapper.vm, "toggleCitation");
    const citationSwitch = wrapper.findAllComponents({ name: "v-switch" })[0];

    expect(citationSwitch.exists()).toBe(true);
    await citationSwitch.vm.$emit("update:modelValue", true);

    expect(toggle).toHaveBeenCalledWith(0);
    expect(wrapper.vm.publications[0].isCitation).toBe(true);
  });

  it("opens a blank publication through the create button", async () => {
    await wrapper
      .get("[data-testid='createNewPublication-button']")
      .trigger("click");

    expect(wrapper.vm.openEditor).toBe(true);
    expect(wrapper.vm.newPublication).toMatchObject({
      doi: "",
      title: "",
      isCitation: false,
    });
  });

  it("shows a PubMed error returned by the client", async () => {
    const getPMID = vi
      .spyOn(ExternalClient.prototype, "getPMID")
      .mockResolvedValue({ error: "Not found" });

    try {
      wrapper.vm.search = "123";
      await wrapper.vm.getPMID();

      expect(wrapper.vm.errors.pmid).toBe(true);
      expect(wrapper.vm.loadingPub).toBe(false);
      await nextTick();
      expect(wrapper.text()).toContain("PubMed ID not found");
    } finally {
      getPMID.mockRestore();
    }
  });

  it("imports an array result from the Zenodo fallback", async () => {
    const getDOI = vi
      .spyOn(ExternalClient.prototype, "getDOI")
      .mockResolvedValue({ error: "Not found" });
    const getZenodoSearch = vi
      .spyOn(RestClient.prototype, "getZenodoSearch")
      .mockResolvedValue([
        {
          metadata: {
            upload_type: "publication",
            title: "Zenodo paper",
            publication_date: "2022-01-01",
          },
          doi: "10.5281/zenodo.123",
        },
      ]);

    try {
      wrapper.vm.search = "10.5281/zenodo.123";
      await wrapper.vm.getDOI();

      expect(wrapper.vm.errors.doi).toBe(null);
      expect(wrapper.vm.newPublication.title).toBe("Zenodo paper");
      expect(wrapper.vm.newPublication.year).toBe(2022);
      expect(wrapper.vm.doiLoader).toBe(false);
    } finally {
      getDOI.mockRestore();
      getZenodoSearch.mockRestore();
    }
  });

  it("imports PubMed through its button and shows loading until the response arrives", async () => {
    let resolvePublication;
    fetchStub = sinon.stub(ExternalClient.prototype, "getPMID").callsFake(
      () =>
        new Promise((resolve) => {
          resolvePublication = resolve;
        }),
    );
    await wrapper
      .find('input[aria-label="Search existing publications"]')
      .setValue(" 123 ");
    await wrapper.get('[data-testid="getPMID-button"]').trigger("click");
    expect(fetchStub.calledOnceWithExactly("123")).toBe(true);
    expect(wrapper.vm.loadingPub).toBe(true);
    expect(
      wrapper
        .findAllComponents({ name: "VBtn" })
        .find((button) => button.text().includes("Import from PUBMED ID"))
        .props("loading"),
    ).toBe(true);
    resolvePublication({
      result: {
        123: {
          title: article.title,
          fulljournalname: article["container-title-short"],
          sortpubdate: "1989/03/02",
          authors: [{ name: "Baulieu, E." }],
          uid: "123",
          elocationid: `doi: ${article.DOI}`,
        },
      },
    });
    await flushPromises();
    expect(wrapper.vm.newPublication).toMatchObject({
      title: article.title,
      journal: "Science",
      year: 1989,
      authors: "Baulieu, E.",
      pubmed_id: "123",
      doi: article.DOI,
      url: `https://doi.org/${article.DOI}`,
      isCitation: false,
    });
    expect(wrapper.vm.loadingPub).toBe(false);
    expect(wrapper.vm.openEditor).toBe(true);
    expect(VFormStub.methods.validate).toHaveBeenCalled();
  });

  it.each([false, true])(
    "submits the publication form through its button with error=%s",
    async (error) => {
      restStub = sinon.stub(RestClient.prototype, "createPublication").resolves(
        error
          ? { error: { response: { data: "Title already exists" } } }
          : {
              id: 3,
              title: "New paper",
              doi: "10.1000/new",
              isCitation: false,
            },
      );
      const initialCount = wrapper.vm.publications.length;
      await wrapper
        .get('[data-testid="createNewPublication-button"]')
        .trigger("click");
      const submit = wrapper
        .findAllComponents({ name: "VBtn" })
        .find((button) =>
          button.text().includes("Edit or add a new publication"),
        );
      expect(submit.props("disabled")).toBe(true);
      for (const [label, value] of [
        ["DOI", "10.1000/new"],
        ["Title", "New paper"],
        ["Authors", "Test Author"],
        ["Journal", "Test Journal"],
        ["Publication Year", "2026"],
        ["URL", "https://example.org/paper"],
      ]) {
        await wrapper.find(`input[aria-label="${label}"]`).setValue(value);
      }
      wrapper
        .findComponent({ name: "VForm" })
        .vm.$emit("update:modelValue", true);
      await nextTick();
      expect(submit.props("disabled")).toBe(false);
      await submit.trigger("click");
      await flushPromises();
      expect(
        restStub.calledOnceWithExactly(
          {
            doi: "10.1000/new",
            title: "New paper",
            authors: "Test Author",
            journal: "Test Journal",
            year: "2026",
            url: "https://example.org/paper",
            pubmed_id: "",
            isCitation: false,
          },
          "thisisatoken",
        ),
      ).toBe(true);
      if (error) {
        expect(wrapper.text()).toContain("Title already exists");
        expect(wrapper.vm.openEditor).toBe(true);
        expect(wrapper.vm.newPublication.title).toBe("New paper");
        expect(wrapper.vm.publications).toHaveLength(initialCount);
      } else {
        expect(wrapper.vm.publications).toHaveLength(initialCount + 1);
        expect(
          wrapper.vm.availablePublications.filter((pub) => pub.id === 3),
        ).toHaveLength(1);
        expect(wrapper.vm.search).toBe("10.1000/new");
        expect(wrapper.vm.openEditor).toBe(false);
        expect(wrapper.vm.newPublication).toEqual({});
      }
    },
  );

  it("rejects unsupported DOI fallback results without opening the editor", async () => {
    fetchStub = sinon
      .stub(ExternalClient.prototype, "getDOI")
      .resolves({ error: "Not found" });
    restStub = sinon
      .stub(RestClient.prototype, "getZenodoSearch")
      .resolves({ title: "Unsupported record without metadata" });
    await wrapper
      .find('input[aria-label="Search existing publications"]')
      .setValue(" 10.1000/missing ");
    await wrapper.get('[data-testid="getDOI-button"]').trigger("click");
    await flushPromises();
    expect(fetchStub.calledOnceWithExactly("10.1000/missing")).toBe(true);
    expect(
      restStub.calledOnceWithExactly("10.1000/missing", "thisisatoken"),
    ).toBe(true);
    expect(wrapper.vm.errors.doi).toBe(true);
    expect(wrapper.vm.doiLoader).toBe(false);
    expect(wrapper.vm.openEditor).toBe(false);
    expect(wrapper.text()).toContain("DOI not found");
  });

  it("replaces an available publication with the edited version without duplicating it", async () => {
    restStub = sinon
      .stub(RestClient.prototype, "editPublication")
      .resolves({ id: 1, title: "Hello", journal: "Updated journal" });
    $store.state.editor.availablePublications = [
      { id: 1, title: "Hello", journal: "Old journal" },
      { id: 9, title: "Unrelated paper" },
    ];
    wrapper.vm.editPublication(wrapper.vm.publications[0], 0);
    wrapper.vm.newPublication.journal = "Updated journal";
    wrapper.vm.newPublication.isCitation = true;
    await wrapper.vm.addPublication();
    expect(restStub.calledOnce).toBe(true);
    expect(wrapper.vm.availablePublications).toEqual([
      { id: 9, title: "Unrelated paper" },
      {
        id: 1,
        title: "Hello",
        journal: "Updated journal",
        isCitation: true,
        tablePosition: 1,
      },
    ]);
    expect(wrapper.vm.publications[0]).toMatchObject({
      id: 1,
      journal: "Updated journal",
      isCitation: true,
    });
    expect(wrapper.vm.currentPublicationIndex).toBe(false);
    expect(wrapper.vm.openEditor).toBe(false);
  });

  it("renders DOI labels, citation styling, and curator-only editing controls", async () => {
    wrapper.vm.publications[0].doi = article.DOI;
    wrapper.vm.publications[0].isCitation = true;
    await nextTick();
    const title = wrapper
      .findAllComponents({ name: "VCardTitle" })
      .find((item) => item.text().includes(article.DOI));
    expect(title.text().replace(/\s+/g, " ")).toContain(
      `Publication - ${article.DOI}`,
    );
    expect(title.classes()).toContain("bg-green");
    expect(
      wrapper
        .findAllComponents({ name: "VBtn" })
        .some((button) => button.text().includes("fa-pen")),
    ).toBe(false);
    $store.state.users.user = () => ({
      is_curator: true,
      credentials: { token: "thisisatoken" },
    });
    await nextTick();
    expect(
      wrapper
        .findAllComponents({ name: "VBtn" })
        .filter((button) => button.text().includes("fa-pen")),
    ).toHaveLength(2);
  });

  it.each([false, true])(
    "shows the correct save loader until completion with redirect=%s",
    async (redirect) => {
      let resolveSave;
      restStub = sinon.stub(RestClient.prototype, "updateRecord").callsFake(
        () =>
          new Promise((resolve) => {
            resolveSave = resolve;
          }),
      );
      const selector = redirect
        ? "saveRecordExit-button"
        : "saveRecordContinue-button";
      await wrapper.get(`[data-testid="${selector}"]`).trigger("click");
      expect(wrapper.vm.exitLoader).toBe(redirect);
      expect(wrapper.vm.continueLoader).toBe(!redirect);
      expect($router.push).not.toHaveBeenCalled();
      expect(restStub.firstCall.args[0]).toEqual({
        record: { publication_ids: [1, 2], citation_ids: [] },
        token: "thisisatoken",
        id: 123,
      });
      resolveSave({});
      await flushPromises();
      expect(wrapper.vm.exitLoader).toBe(false);
      expect(wrapper.vm.continueLoader).toBe(false);
      expect(wrapper.vm.getChanges.publications).toBe(0);
      if (redirect) expect($router.push).toHaveBeenCalledWith({ path: "/123" });
      else expect($scrollTo).toHaveBeenCalledWith("#mainHeader");
    },
  );

  it("counts added and removed publications and ignores changes before initialization", async () => {
    wrapper.vm.publications = [
      { ...pubs[0], tablePosition: 0 },
      { id: 3, title: "New paper" },
    ];
    await nextTick();
    expect(wrapper.vm.getChanges.publications).toBe(2);
    wrapper.vm.initialized = false;
    wrapper.vm.publications = [];
    await nextTick();
    expect(wrapper.vm.getChanges.publications).toBe(2);
  });
});
