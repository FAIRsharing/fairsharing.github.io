import GraphClient from "@/lib/GraphClient/GraphClient.js";
import RESTClient from "@/lib/Client/RESTClient.js";
import editorStore from "@/store/editor.js";

describe("editor store", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates the most recent 100 years", () => {
    const years = editorStore.state.years();

    expect(years).toHaveLength(100);
    expect(years[0]).toBe(new Date().getFullYear());
    expect(years[99]).toBe(new Date().getFullYear() - 99);
  });

  it("updates and cleans its state", () => {
    const state = {
      countries: ["old"],
      recordTypes: ["old"],
      allTags: false,
      tags: [],
      objectTypes: ["old"],
      organisations: ["old"],
      organisationsTypes: ["old"],
      grants: ["old"],
      availablePublications: ["old"],
      availableLicences: [],
      availableRecords: [],
      relationsTypes: [],
      allowedFields: {},
      possibleDuplicates: ["old"],
    };
    const { mutations } = editorStore;

    mutations.setCountries(state, ["UK"]);
    mutations.setRecordTypes(state, ["standard"]);
    mutations.setObjectTypes(state, ["dataset"]);
    mutations.setTags(state, { data: ["tag"], firstTime: true });
    mutations.setTags(state, { data: ["filtered"], firstTime: false });
    mutations.setOrganisations(state, ["org"]);
    mutations.setOrganisationsTypes(state, ["type"]);
    mutations.setGrants(state, ["grant"]);
    mutations.setAvailablePublications(state, ["publication"]);
    mutations.setAvailableLicences(state, ["licence"]);
    mutations.setAvailableRecords(state, ["record"]);
    mutations.setAvailableRelationsTypes(state, { standard: [] });
    mutations.setAllowedFields(state, { field: true });
    mutations.setPossibleDuplicates(state, ["duplicate"]);

    expect(state.allTags).toEqual(["tag"]);
    expect(state.tags).toEqual(["filtered"]);
    expect(state.availableLicences).toEqual(["licence"]);
    expect(state.availableRecords).toEqual(["record"]);
    expect(state.relationsTypes).toEqual({ standard: [] });
    expect(state.allowedFields).toEqual({ field: true });

    mutations.clearPossibleDuplicates(state);
    expect(state.possibleDuplicates).toEqual([]);

    mutations.cleanEditorStore(state);
    expect(state).toMatchObject({
      countries: null,
      recordTypes: null,
      allTags: [],
      tags: [],
      objectTypes: [],
      organisations: null,
      organisationsTypes: null,
      grants: null,
      availablePublications: [],
      possibleDuplicates: [],
    });
  });

  it("loads editor lookup data", async () => {
    const executeQuery = vi
      .spyOn(GraphClient.prototype, "executeQuery")
      .mockResolvedValueOnce({ searchCountries: [{ id: 1 }] })
      .mockResolvedValueOnce({
        fairsharingRegistries: {
          records: [
            null,
            { name: "", recordTypes: [] },
            {
              name: "Standard",
              recordTypes: [{ id: 2, name: "Model", description: "A model" }],
            },
            { name: "Database" },
          ],
        },
      })
      .mockResolvedValueOnce({
        fairsharingRegistries: {
          records: [
            { name: "Standard", recordTypes: [] },
            {
              name: "FAIRassist",
              recordTypes: [{ id: 3, name: "Assessment" }],
            },
          ],
        },
      })
      .mockResolvedValueOnce({ objectTypes: { records: [{ id: 4 }] } })
      .mockResolvedValueOnce({ searchTags: [{ id: 5 }] })
      .mockResolvedValueOnce({ searchOrganisations: [{ id: 6 }] })
      .mockResolvedValueOnce({ searchOrganisationTypes: [{ id: 7 }] })
      .mockResolvedValueOnce({ searchGrants: [{ id: 8 }] })
      .mockResolvedValueOnce({
        searchPublications: [{ id: 9 }, { id: 10 }],
      })
      .mockResolvedValueOnce({ searchLicences: [{ id: 11 }] })
      .mockResolvedValueOnce({
        searchFairsharingRecords: { records: [{ id: 12 }] },
      })
      .mockResolvedValueOnce({ duplicateCheck: [{ id: 13 }] });
    const commit = vi.fn();
    const context = { commit, state: { allTags: false } };

    await editorStore.actions.getCountries(context);
    await editorStore.actions.getRecordTypes(context);
    await editorStore.actions.getRecordTypes(context, true);
    await editorStore.actions.getObjectTypes(context);
    await editorStore.actions.getTags(context, "genomics");
    await editorStore.actions.getOrganisations(context);
    await editorStore.actions.getOrganisationsTypes(context);
    await editorStore.actions.getGrants(context);

    const publications = [{ id: 10 }];
    await editorStore.actions.getAvailablePublications(context, publications);
    await editorStore.actions.getLicences(context);
    await editorStore.actions.getAvailableRecords(context, {
      q: "record",
      fairsharingRegistry: "Standard",
      recordType: "Model",
      excludeId: 1,
    });
    await editorStore.actions.getPossibleDuplicates(context, {
      fields: ["name"],
    });

    expect(executeQuery).toHaveBeenCalledTimes(12);
    expect(commit).toHaveBeenCalledWith("setCountries", [{ id: 1 }]);
    expect(commit).toHaveBeenCalledWith("setRecordTypes", [
      { header: "Standard" },
      { name: "Model", group: "Standard", id: 2, description: "A model" },
      { divider: true },
      { header: "Database" },
    ]);
    expect(commit).toHaveBeenCalledWith("setRecordTypes", [
      { header: "FAIRassist" },
      {
        name: "Assessment",
        group: "FAIRassist",
        id: 3,
        description: undefined,
      },
    ]);
    expect(commit).toHaveBeenCalledWith("setTags", {
      data: [{ id: 5 }],
      firstTime: true,
    });
    expect(publications[0].tablePosition).toBe(1);
    expect(commit).toHaveBeenCalledWith(
      "setAvailablePublications",
      expect.arrayContaining([
        expect.objectContaining({ id: 9, isCitation: false }),
        expect.objectContaining({
          id: 10,
          isCitation: false,
          tablePosition: 1,
        }),
      ]),
    );
    expect(commit).toHaveBeenCalledWith("setAvailableRecords", [{ id: 12 }]);
    expect(commit).toHaveBeenCalledWith("setPossibleDuplicates", [{ id: 13 }]);
  });

  it("uses empty lookup values when GraphQL requests fail", async () => {
    vi.spyOn(GraphClient.prototype, "executeQuery").mockRejectedValue(
      new Error("network error"),
    );
    const commit = vi.fn();
    const context = { commit, state: { allTags: false } };

    await editorStore.actions.getCountries(context);
    await editorStore.actions.getRecordTypes(context);
    await editorStore.actions.getObjectTypes(context);
    await editorStore.actions.getTags(context);

    expect(commit).toHaveBeenCalledWith("setCountries", []);
    expect(commit).toHaveBeenCalledWith("setRecordTypes", []);
    expect(commit).toHaveBeenCalledWith("setObjectTypes", []);
    expect(commit).toHaveBeenCalledWith("setTags", {
      data: [],
      firstTime: true,
    });
  });

  it("builds relation rules and loads allowed metadata fields", async () => {
    vi.spyOn(RESTClient.prototype, "getRelationsTypes").mockResolvedValue([
      {
        id: 1,
        name: "maintains",
        allowed_associations: [
          { from: "standard", to: "database" },
          { from: "standard", to: "policy" },
        ],
      },
      { id: 2, name: "related_to", allowed_associations: [] },
    ]);
    vi.spyOn(RESTClient.prototype, "extraMetadataFields").mockResolvedValue({
      field: true,
    });
    const commit = vi.fn();

    await editorStore.actions.getAvailableRelationsTypes({ commit });
    await editorStore.actions.getAllowedFields(
      { commit },
      { type: "standard", token: "token" },
    );

    const relationCommit = commit.mock.calls.find(
      ([name]) => name === "setAvailableRelationsTypes",
    );
    expect(relationCommit[1].standard).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          relation: "maintains",
          target: "database",
        }),
        expect.objectContaining({
          relation: "maintains",
          target: "policy",
        }),
        expect.objectContaining({
          relation: "related_to",
          target: "standard",
        }),
      ]),
    );
    expect(commit).toHaveBeenCalledWith("setAllowedFields", { field: true });
  });

  it("filters tags, relations, and relation targets", () => {
    const relation = { relation: "maintains", target: "database" };
    const duplicate = { ...relation };
    const other = { relation: "funds", target: "policy" };
    const state = {
      tags: [
        { id: 1, model: "subject" },
        { id: 2, model: "domain" },
      ],
      relationsTypes: {
        standard: [relation, other],
        Standards: [relation],
        database: [duplicate, { relation: "invalid", target: "not_a_type" }],
      },
    };

    expect(editorStore.getters.getPartialTags(state)(["subject"])).toEqual([
      { id: 1, model: "subject" },
    ]);
    expect(
      editorStore.getters.allowedRelations(state)({
        sourceType: "standard",
        sourceRegistry: "Standards",
        target: null,
      }),
    ).toEqual([relation, other]);
    expect(
      editorStore.getters.allowedRelations(state)({
        sourceType: "standard",
        sourceRegistry: "Standards",
        target: { registry: "Policies", type: "database" },
      }),
    ).toEqual([relation]);
    expect(editorStore.getters.allowedTargets(state)("DATABASE")).toEqual([
      "database",
    ]);
  });
});
