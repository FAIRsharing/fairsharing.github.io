import GraphClient from "@/lib/GraphClient/GraphClient.js";
import RESTClient from "@/lib/Client/RESTClient.js";
import recordStore from "@/store/recordData.js";

const makeState = () => ({
  currentRecord: { fairsharingRecord: { id: 42 } },
  currentRecordHistory: { old: true },
  recordUpdate: {},
  editOrganisationLink: { data: {} },
  newRecord: false,
  sections: {
    generalInformation: {
      data: {
        type: { id: 1 },
        metadata: { contacts: [], support_links: [] },
      },
      initialData: { type: { name: "Standard" }, metadata: {} },
      changes: 1,
      message: null,
      error: false,
    },
    publications: { data: [], changes: 2, message: null },
    organisations: {
      data: [],
      initialData: [],
      changes: 3,
      message: null,
    },
    additionalInformation: {
      data: {},
      initialData: {},
      changes: 4,
      message: null,
    },
    dataAccess: {
      data: { exhaustiveLicences: false, licences: [], support_links: [] },
      initialData: { licences: [] },
      changes: 5,
      message: null,
    },
    relations: {
      data: { recordAssociations: [] },
      initialData: { recordAssociations: [] },
      changes: 6,
      message: null,
      error: false,
    },
  },
});

describe("record data store", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("updates the simple record state", () => {
    const state = makeState();
    const { mutations } = recordStore;

    mutations.setRecordHistory(state, { version: 1 });
    mutations.resetCurrentRecordHistory(state);
    mutations.resetMessage(state, "publications");
    mutations.setSectionError(state, {
      section: "publications",
      value: "failed",
    });
    mutations.setChanges(state, { section: "publications", value: 7 });
    mutations.setContacts(state, [{ name: "Contact" }]);
    mutations.setTags(state, { target: "domains", value: [{ id: 1 }] });
    mutations.resetRegistry(state);
    mutations.setPublications(state, [{ id: 2 }]);
    mutations.setEditOrganisationLink(state, { data: {} });
    mutations.setEditOrganisationLinkOrganisation(state, { id: 3 });
    mutations.setEditOrganisationLinkGrant(state, { id: 4 });
    mutations.setCreatingNewRecord(state);
    mutations.setEditingRecord(state);
    mutations.setMessage(state, { target: "organisations", value: "saved" });
    mutations.setNewRecord(state, 5);

    expect(state.currentRecordHistory).toEqual({});
    expect(state.sections.publications).toMatchObject({
      data: [{ id: 2 }],
      changes: 7,
      message: "failed",
      error: true,
    });
    expect(state.sections.generalInformation.data).toMatchObject({
      type: "",
      domains: [{ id: 1 }],
      metadata: { contacts: [{ name: "Contact" }] },
    });
    expect(state.editOrganisationLink.data).toEqual({
      organisation: { id: 3 },
      grant: { id: 4 },
    });
    expect(state.newRecord).toBe(false);
    expect(state.recordUpdate).toEqual({
      error: false,
      message: "success",
      id: 5,
    });

    mutations.setError(state, "nope");
    expect(state.recordUpdate).toEqual({
      error: true,
      message: "nope",
      id: null,
    });
  });

  it("sets tag types on the current record", () => {
    const state = makeState();
    const fairsharingRecord = {
      subjects: [{ id: 1 }],
      domains: [],
      taxonomies: [{ id: 2 }],
      userDefinedTags: [{ id: 3 }],
    };

    recordStore.mutations.setCurrentRecord(state, { fairsharingRecord });

    expect(fairsharingRecord.subjects[0].type).toBe("subjects");
    expect(fairsharingRecord.taxonomies[0].type).toBe("taxonomies");
    expect(fairsharingRecord.userDefinedTags[0].type).toBe("userDefinedTags");
  });

  it("edits additional-information fields", () => {
    const state = makeState();
    const { mutations } = recordStore;

    mutations.setAdditionalInformation(state, {
      fieldName: "single",
      fieldValue: "value",
    });
    state.sections.additionalInformation.data.nested = {};
    mutations.setAdditionalInformation(state, {
      fieldName: "nested",
      subfieldName: "child",
      fieldValue: "nested value",
    });
    mutations.setAdditionalInformationSubField(state, {
      fieldName: "items",
      id: null,
      fieldValue: "first",
    });
    mutations.setAdditionalInformationSubField(state, {
      fieldName: "items",
      id: 0,
      fieldValue: "updated",
    });
    mutations.setAdditionalInformationSubField(state, {
      fieldName: "items",
      id: null,
      fieldValue: "second",
    });
    mutations.removeAdditionalInformationSubField(state, {
      fieldName: "items",
      id: 0,
    });

    expect(state.sections.additionalInformation.data).toMatchObject({
      single: "value",
      nested: { child: "nested value" },
      items: ["second"],
    });
  });

  it("refreshes organisation, data-access, additional-info and relation sections", () => {
    const state = makeState();
    const { mutations } = recordStore;

    mutations.updateOrganisationsLinks(state, [{ id: 1 }]);
    mutations.setDataAccess(state, {
      exhaustiveLicences: true,
      licenceLinks: [{ id: 2 }],
      metadata: {
        support_links: [
          { name: "API", url: "https://example.com/api" },
          { url: "https://example.com/help" },
        ],
      },
    });
    mutations.updateAdditionalInformation(state, {
      record: { included: { value: true }, excluded: "no" },
      fields: ["included"],
    });
    mutations.setRelations(state, [{ id: 3 }]);

    expect(state.sections.organisations).toMatchObject({
      data: [{ id: 1 }],
      initialData: [{ id: 1 }],
      changes: 0,
      message: "Record successfully updated!",
    });
    expect(state.sections.dataAccess.data).toMatchObject({
      exhaustiveLicences: true,
      licences: [{ id: 2 }],
      support_links: [
        {
          name: "API",
          url: {
            title: "API",
            url: "https://example.com/api",
          },
        },
        { url: "https://example.com/help" },
      ],
    });
    expect(state.sections.additionalInformation.data).toEqual({
      included: { value: true },
    });
    expect(state.sections.relations).toMatchObject({
      data: { recordAssociations: [{ id: 3 }] },
      initialData: { recordAssociations: [{ id: 3 }] },
      changes: 0,
      message: "Record successfully updated!",
      error: false,
    });
  });

  it("fetches records, previews, and history", async () => {
    const fetchedRecord = {
      id: 42,
      metadata: {},
      subjects: [],
      domains: [],
      taxonomies: [],
      userDefinedTags: [],
    };
    vi.spyOn(GraphClient.prototype, "executeQuery")
      .mockResolvedValueOnce({ fairsharingRecord: fetchedRecord })
      .mockResolvedValueOnce({ fairsharingRecord: { id: 43 } })
      .mockResolvedValueOnce({ fairsharingRecord: { versions: [] } });
    const setHeader = vi.spyOn(GraphClient.prototype, "setHeader");
    const initializeHeader = vi.spyOn(GraphClient.prototype, "initalizeHeader");
    const commit = vi.fn();

    await recordStore.actions.fetchRecord(
      { commit },
      { id: 42, token: "token" },
    );
    await recordStore.actions.fetchPreviewRecord({ commit }, 43);
    await recordStore.actions.fetchRecordHistory(
      { commit },
      { id: 42, token: "token" },
    );

    expect(setHeader).toHaveBeenCalledWith("token");
    expect(initializeHeader).toHaveBeenCalled();
    expect(fetchedRecord.metadata).toEqual({ contacts: [], citations: [] });
    expect(commit).toHaveBeenCalledWith("setCurrentRecord", {
      fairsharingRecord: expect.objectContaining({
        id: 42,
        metadata: { contacts: [], citations: [] },
      }),
    });
    expect(commit).toHaveBeenCalledWith("setRecordHistory", { versions: [] });
  });

  it("updates publications and handles errors", async () => {
    const state = makeState();
    state.sections.publications.data = [
      { id: 1, isCitation: true },
      { id: 2, isCitation: false },
    ];
    const updateRecord = vi
      .spyOn(RESTClient.prototype, "updateRecord")
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ error: "failed" });
    const commit = vi.fn();

    await recordStore.actions.updatePublications(
      { state, commit },
      { id: 42, token: "token" },
    );
    const error = await recordStore.actions.updatePublications(
      { state, commit },
      { id: 42, token: "token" },
    );

    expect(updateRecord).toHaveBeenCalledWith({
      record: { publication_ids: [1, 2], citation_ids: [1] },
      id: 42,
      token: "token",
    });
    expect(commit).toHaveBeenCalledWith("setMessage", {
      target: "publications",
      value: "Record successfully updated!",
    });
    expect(error).toBe("failed");
  });

  it("creates, updates, and deletes organisation links", async () => {
    const state = makeState();
    state.sections.organisations.initialData = [{ id: 1 }];
    state.sections.organisations.data = [
      {
        organisation: { id: 2 },
        relation: "maintains",
        grant: null,
        isLead: true,
      },
      {
        id: 3,
        organisation: { id: 4 },
        relation: "funds",
        grant: { id: 5 },
        isLead: false,
      },
    ];
    const deleteLink = vi
      .spyOn(RESTClient.prototype, "deleteOrganisationLink")
      .mockResolvedValue({});
    const createLink = vi
      .spyOn(RESTClient.prototype, "createOrganisationLink")
      .mockResolvedValue({});
    const updateLink = vi
      .spyOn(RESTClient.prototype, "updateOrganisationLink")
      .mockResolvedValue({ error: "link warning" });
    vi.spyOn(GraphClient.prototype, "setHeader");
    vi.spyOn(GraphClient.prototype, "executeQuery").mockResolvedValue({
      fairsharingRecord: { organisationLinks: [{ id: 6 }] },
    });
    const commit = vi.fn();

    await recordStore.actions.updateOrganisations({ state, commit }, "token");

    expect(deleteLink).toHaveBeenCalledWith(1, "token");
    expect(createLink).toHaveBeenCalledWith(
      {
        fairsharing_record_id: 42,
        organisation_id: 2,
        relation: "maintains",
        grant_id: null,
        is_lead: true,
      },
      "token",
    );
    expect(updateLink).toHaveBeenCalledWith(
      {
        fairsharing_record_id: 42,
        organisation_id: 4,
        relation: "funds",
        grant_id: 5,
        is_lead: false,
      },
      3,
      "token",
    );
    expect(commit).toHaveBeenCalledWith("setSectionError", {
      section: "organisations",
      value: "link warning",
    });
    expect(commit).toHaveBeenCalledWith("updateOrganisationsLinks", [
      { id: 6 },
    ]);
  });

  it("saves new relations, removes stale relations, and refreshes the section", async () => {
    const state = makeState();
    state.sections.relations.data.recordAssociations = [
      {
        new: true,
        linkedRecord: { id: 2 },
        recordAssocLabel: { id: 10 },
      },
      {
        linkedRecord: { id: 3 },
        recordAssocLabelId: 11,
      },
    ];
    state.sections.relations.initialData.recordAssociations = [
      {
        id: 1,
        linkedRecord: { id: 3 },
        recordAssocLabelId: 11,
      },
      {
        id: 2,
        linkedRecord: { id: 4 },
        recordAssocLabelId: 12,
      },
    ];
    const saveRelations = vi
      .spyOn(RESTClient.prototype, "saveRelations")
      .mockResolvedValue({});
    const deleteRelations = vi
      .spyOn(RESTClient.prototype, "deleteRelations")
      .mockResolvedValue({});
    vi.spyOn(GraphClient.prototype, "setHeader");
    vi.spyOn(GraphClient.prototype, "executeQuery").mockResolvedValue({
      fairsharingRecord: { recordAssociations: [{ id: 20 }] },
    });
    const commit = vi.fn();

    await recordStore.actions.updateRelations(
      { state, commit },
      { source: 42, token: "token" },
    );

    expect(saveRelations).toHaveBeenCalledWith({
      token: "token",
      relations: [
        {
          fairsharing_record_id: 42,
          linked_record_id: 2,
          record_assoc_label_id: 10,
        },
      ],
      target: 42,
    });
    expect(deleteRelations).toHaveBeenCalledWith({
      token: "token",
      relations: [{ id: 2, _destroy: 1 }],
      target: 42,
    });
    expect(commit).toHaveBeenCalledWith("setRelations", [{ id: 20 }]);
  });

  it("does not refresh relations when saving fails", async () => {
    const state = makeState();
    vi.spyOn(RESTClient.prototype, "saveRelations").mockResolvedValue({
      error: "save failed",
    });
    vi.spyOn(RESTClient.prototype, "deleteRelations").mockResolvedValue({});
    const executeQuery = vi.spyOn(GraphClient.prototype, "executeQuery");
    const commit = vi.fn();

    await recordStore.actions.updateRelations(
      { state, commit },
      { source: 42, token: "token" },
    );

    expect(commit).toHaveBeenCalledWith("setSectionError", {
      section: "relations",
      value: "save failed",
    });
    expect(executeQuery).not.toHaveBeenCalled();
  });

  it("updates a new record and exposes record getters", async () => {
    const state = makeState();
    state.currentRecord.fairsharingRecord.name = "Example";
    const commit = vi.fn();
    vi.spyOn(RESTClient.prototype, "updateRecord")
      .mockResolvedValueOnce(99)
      .mockResolvedValueOnce({ error: { response: "bad record" } });

    recordStore.actions.resetRecord({ commit });
    await recordStore.actions.updateRecord({ commit }, { record: {} });
    await recordStore.actions.updateRecord({ commit }, { record: {} });

    expect(commit).toHaveBeenCalledWith("setGeneralInformation", {
      fairsharingRecord: false,
    });
    expect(commit).toHaveBeenCalledWith("setNewRecord", 99);
    expect(commit).toHaveBeenCalledWith("setError", "bad record");
    expect(recordStore.getters.getField(state)("name")).toBe("Example");
    expect(recordStore.getters.getSection(state)("publications")).toBe(
      state.sections.publications,
    );
    expect(recordStore.getters.getChanges(state)).toMatchObject({
      generalInformation: 1,
      publications: 2,
      relations: 6,
    });
    expect(recordStore.getters.getAllChanges(state)).toBe(21);
    expect(recordStore.getters.getCreatingNewRecord(state)).toBe(false);
    expect(recordStore.getters.getRecordType(state)).toEqual({
      name: "Standard",
    });
  });
});
