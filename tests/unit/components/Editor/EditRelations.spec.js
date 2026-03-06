import { shallowMount } from "@vue/test-utils";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "vuex";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import EditRelationships from "@/components/Editor/EditRelationships.vue";

const vuetify = createVuetify({ components, directives });

describe("EditRelationships.vue", () => {
  let wrapper;
  let store;
  let actions;
  let mutations;

  beforeAll(() => {
    Object.defineProperty(window, "visualViewport", {
      writable: true,
      configurable: true,
      value: {
        height: 768,
        width: 1024,
        scale: 1,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      },
    });
  });

  beforeEach(() => {
    actions = {
      "editor/getAvailableRecords": vi.fn(),
      "editor/getAvailableRelationsTypes": vi.fn(),
      "record/updateRelations": vi.fn(),
    };

    mutations = {
      "record/setChanges": vi.fn(),
    };

    store = createStore({
      modules: {
        record: {
          namespaced: true,
          state: {
            currentID: "current-id",
            currentRecord: { fairsharingRecord: { type: "database" } },
            sections: {
              relations: {
                data: {
                  name: "Source Name",
                  registry: "standard",
                  type: "standard",
                  recordAssociations: [],
                },
                initialData: { recordAssociations: [] },
              },
            },
          },
          getters: {
            getSection: () => () => ({ error: false, message: "Success" }),

            allowedRelations: () => () => [
              { relation: "part_of", target: "database" }, // Hits the IF block
              { relation: "is_related_to", target: "metric" }, // Hits the ELSE block
            ],
            allowedTargets: () => () => ["database", "standard", "metric"],
          },
          actions: { updateRelations: actions["record/updateRelations"] },
          mutations,
        },
        users: {
          namespaced: true,
          state: { user: () => ({ credentials: { token: "abc" } }) },
        },
        editor: {
          namespaced: true,
          state: { availableRecords: [], relationsTypes: [] },
          getters: {
            allowedRelations: () => () => [
              { relation: "part_of", target: "database" },
            ],
            allowedTargets: () => () => ["database", "standard"],
          },
          actions: {
            getAvailableRecords: actions["editor/getAvailableRecords"],
            getAvailableRelationsTypes:
              actions["editor/getAvailableRelationsTypes"],
          },
        },
      },
    });

    wrapper = shallowMount(EditRelationships, {
      global: {
        plugins: [store, vuetify],
        stubs: {
          VDialog: { template: '<div class="v-dialog-stub"><slot /></div>' },
          VCard: { template: '<div class="v-card-stub"><slot /></div>' },
          VCardActions: {
            template: '<div class="v-card-actions-stub"><slot /></div>',
          },
          VForm: { template: '<div class="v-form-stub"><slot /></div>' },
          // Stub children components to isolate the test
          Alerts: true,
          Icon: true,
          RecordStatus: true,
          Loaders: true,
          VIcon: true,
          VBtn: true, // We verify the VBtn component wrapper
        },
        mocks: {
          $route: { params: { id: "current-id" } },
          $router: { push: vi.fn() },
          $scrollTo: vi.fn(),
        },
      },
    });
  });

  // --- RENDERING & INITIALIZATION ---
  it("can be mount", async () => {
    expect(wrapper.vm.$options.name).toMatch("EditRelationships");
    wrapper.vm.rules.isRequired();
  });

  it("handles duplicateRelationship snackbar v-model updates", async () => {
    await wrapper.setData({ duplicateRelationship: true });
    const snackbar = wrapper.findComponent({ name: "v-snackbar" });
    expect(snackbar.props("modelValue")).toBe(true);
    await snackbar.vm.$emit("update:modelValue", false);
    expect(wrapper.vm.duplicateRelationship).toBe(false);
  });

  it("handles multipleRelationship snackbar v-model updates", async () => {
    await wrapper.setData({ multipleRelationship: true });
    const snackbar = wrapper.findAllComponents({ name: "v-snackbar" }).at(1);
    expect(snackbar.props("modelValue")).toBe(true);
    await snackbar.vm.$emit("update:modelValue", false);
    expect(wrapper.vm.multipleRelationship).toBe(false);
  });

  it("closes the relations panel when Cancel button is clicked", async () => {
    await wrapper.setData({
      showRelationsPanel: true,
      addingRelation: { id: 1, name: "Test" },
    });
    await wrapper.vm.$nextTick();
    await wrapper.vm.$nextTick();
    const buttons = wrapper.findAllComponents({ name: "v-btn" });
    const cancelButton = buttons.find((b) => b.text().trim() === "Cancel");
    await cancelButton.vm.$emit("click");
    expect(wrapper.vm.showRelationsPanel).toBe(false);
  });

  it("prevents duplicate relationships in addItem method", async () => {
    const existing = {
      linkedRecord: { name: "Test" },
      recordAssocLabel: { relation: "part_of" },
    };
    wrapper.vm.sections.relations.data.recordAssociations = [existing];
    wrapper.vm.addingRelation = {
      linkedRecord: { name: "Test" },
      recordAssocLabel: { relation: "part_of" },
    };

    wrapper.vm.addItem();
    expect(wrapper.vm.duplicateRelationship).toBe(true);
  });

  it("can check for label filter in addItem method", async () => {
    wrapper.vm.labelsFilter = {
      database: false,
      standard: false,
      collection: true,
    };
    wrapper.vm.addItem();

    Object.keys(wrapper.vm.labelsFilter).forEach((key) => {
      expect(wrapper.vm.labelsFilter[key]).toBe(true);
    });
  });

  it("handles save and continue", async () => {
    const btn = { textContent: "Save and continue" };
    const applyFilterButton = wrapper.get("[data-testid='continue-button']");
    applyFilterButton.trigger("click");
    await wrapper.vm.saveRecord(false, btn);
    expect(wrapper.vm.continueLoader).toBe(false);
    expect(mutations["record/setChanges"]).toHaveBeenCalled();
  });

  it("handles save and exit with redirect", async () => {
    const btn = { textContent: "Save and exit" };
    const applyFilterButton = wrapper.get("[data-testid='exit-button']");
    applyFilterButton.trigger("click");
    await wrapper.vm.saveRecord(true, btn);
    expect(wrapper.vm.$router.push).toHaveBeenCalled();
  });

  it("prepares filter names correctly", () => {
    expect(wrapper.vm.prepareFilterName("fairassist")).toBe("FAIRassist");
    expect(wrapper.vm.prepareFilterName("database")).toBe("Database(s)");
  });

  it("opens record in new window", () => {
    const spy = vi.spyOn(window, "open").mockImplementation(() => {});
    wrapper.vm.viewRecord({ id: "test-id" });
    expect(spy).toHaveBeenCalledWith("/test-id", "_blank");
  });

  it("can check runSearch() method", async () => {
    wrapper.vm.searchFilters = {
      standard: true,
      database: true,
    };
    wrapper.vm.fairsharingRegistries = ["test"];
    wrapper.vm.availableRecords = [
      {
        description: "test",
        id: 4349,
        isActive: true,
        name: "Provisional Cell Ontology",
        registry: "Standard",
        status: "ready",
        type: "terminology_artefact",
      },
    ];
    await wrapper.vm.runSearch();
    expect(wrapper.vm.getAvailableRecords()).toHaveBeenCalled;
  });

  it("watches associations and commits 0 changes when equal to initialData", async () => {
    wrapper.vm.sections.relations.initialData.recordAssociations = [{ id: 1 }];
    wrapper.vm.sections.relations.data.recordAssociations = [{ id: 1 }];

    await wrapper.vm.$options.watch.associations.handler.call(wrapper.vm);

    expect(mutations["record/setChanges"]).toHaveBeenCalledWith(
      expect.anything(),
      { section: "relations", value: 0 },
    );
  });

  it("addItem handles string-based recordAssocLabel (undefined relation property)", async () => {
    wrapper.vm.$scrollTo = vi.fn();

    const existing = {
      linkedRecord: { name: "Test" },
      recordAssocLabel: "part_of",
    };
    wrapper.vm.sections.relations.data.recordAssociations = [existing];

    // addingRelation with a string label instead of an object
    wrapper.vm.addingRelation = {
      id: 99,
      linkedRecord: { name: "New Record" },
      recordAssocLabel: "is_related_to",
    };

    wrapper.vm.addItem();

    expect(wrapper.vm.duplicateRelationship).toBe(false);
    expect(wrapper.vm.sections.relations.data.recordAssociations[0].new).toBe(
      true,
    );

    // Wait for nextTick to cover the $scrollTo call
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.$scrollTo).toHaveBeenCalled();
  });

  it("getRelations handles targets that are not in the default registries array", () => {
    store.getters["editor/allowedRelations"] = () => [
      { target: "custom_type" },
    ];
    wrapper.vm.getRelations();

    expect(wrapper.vm.labelsFilter["custom_type"]).toBe(true);
  });

  it("runSearch ignores search strings shorter than 3 characters", async () => {
    await wrapper.setData({
      search: "ab",
      searchFilters: { database: true, custom_type: true },
    });
    await wrapper.vm.runSearch();

    // q should be null because 'ab' is less than 3 chars
    expect(actions["editor/getAvailableRecords"]).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        q: null,
        fairsharingRegistry: ["database"],
        recordType: ["custom_type"],
      }),
    );
  });

  it("runSearch sets isActive correctly on availableRecords", async () => {
    store.state.editor.availableRecords = new Array(20)
      .fill({})
      .map((_, i) => ({ id: i }));
    await wrapper.setData({ search: "valid_search" }); // triggers runSearch watcher

    expect(store.state.editor.availableRecords[0].isActive).toBe(true);
    expect(store.state.editor.availableRecords[19].isActive).toBe(false); // i < 15 logic
  });

  it("removeItem correctly filters out the selected association", () => {
    const itemToKeep = { linkedRecord: { id: 1 }, recordAssocLabelId: 10 };
    const itemToRemove = { linkedRecord: { id: 2 }, recordAssocLabelId: 20 };

    wrapper.vm.sections.relations.data.recordAssociations = [
      itemToKeep,
      itemToRemove,
    ];
    wrapper.vm.removeItem(itemToRemove);

    expect(wrapper.vm.sections.relations.data.recordAssociations.length).toBe(
      1,
    );
    expect(
      wrapper.vm.sections.relations.data.recordAssociations[0].linkedRecord.id,
    ).toBe(1);
  });

  it("can check showOverlay method", () => {
    let record = {
      id: 4349,
      name: "Provisional Cell Ontology",
      description: "Dummy",
      status: "ready",
      type: "terminology_artefact",
      registry: "Standard",
      isActive: true,
    };
    wrapper.vm.showOverlay(record);
    expect(wrapper.vm.showRelationsPanel).toBe(true);
  });

  describe("getAssociations", () => {
    it("returns all associations if labelsFilter is null", () => {
      wrapper.vm.labelsFilter = null;
      wrapper.vm.searchAssociations = "ignored";
      const assoc = [{ id: 1 }, { id: 2 }];
      vi.spyOn(wrapper.vm, "associations", "get").mockReturnValue(assoc);
      expect(wrapper.vm.getAssociations).toEqual(assoc);
    });

    it("filters by NAME only when abbreviation is null", () => {
      wrapper.vm.labelsFilter = { database: true };
      wrapper.vm.searchAssociations = "Test";

      const match = {
        linkedRecord: {
          name: "My Test Record",
          abbreviation: null,
          registry: "database",
          type: "database",
        },
      };
      const noMatch = {
        linkedRecord: {
          name: "Other Record",
          abbreviation: null,
          registry: "database",
          type: "database",
        },
      };

      vi.spyOn(wrapper.vm, "associations", "get").mockReturnValue([
        match,
        noMatch,
      ]);

      const result = wrapper.vm.getAssociations;
      expect(result).toHaveLength(1);
      expect(result[0].linkedRecord.name).toBe("My Test Record");
    });

    it("filters associations correctly when abbreviation is NOT null", async () => {
      wrapper.vm.sections.relations.data.recordAssociations = [
        {
          linkedRecord: {
            name: "Full Name",
            abbreviation: "FN",
            registry: "database",
            type: "database",
          },
          recordAssocLabel: "REL",
        },
      ];
      // Search by abbreviation
      await wrapper.setData({
        searchAssociations: "FN",
        labelsFilter: { database: true },
      });

      expect(wrapper.vm.getAssociations.length).toBe(1);
    });

    it("treats null searchAssociations as an empty string (prevents crash)", async () => {
      wrapper.vm.sections.relations.data.recordAssociations = [
        {
          linkedRecord: {
            name: "Full Name",
            abbreviation: "FN",
            registry: "database",
            type: "database",
          },
          recordAssocLabel: "REL",
        },
      ];
      await wrapper.setData({
        searchAssociations: null, // <--- The specific condition you are testing (|| "")
        labelsFilter: { database: true },
      });
      const result = wrapper.vm.getAssociations;
      expect(result).toHaveLength(1);
      expect(result[0].linkedRecord.name).toBe("Full Name");
    });

    it("returns unfiltered associations if labelsFilter is null", () => {
      wrapper.vm.labelsFilter = null;
      wrapper.vm.sections.relations.data.recordAssociations = [{ id: 1 }];
      expect(wrapper.vm.getAssociations.length).toBe(1);
    });
  });
});
