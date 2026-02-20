import { describe, expect, it } from "vitest";
import recordsCardUtils from "@/utils/recordsCardUtils";

const utils = recordsCardUtils;

describe("recordsCardsUtils.js", function () {
  it("gets a record link", function () {
    let record = {
      doi: "123456/FAIRsharing.123456",
    };
    expect(utils.methods.getRecordLink(record)).toEqual("FAIRsharing.123456");
    record = {
      id: "1",
    };
    expect(utils.methods.getRecordLink(record)).toEqual("1");
  });

  it("gets chip colour", function () {
    let chip = {
      type: "subjects",
    };
    expect(utils.methods.getChipColor(chip)).toEqual("subject_color");
    chip = {
      type: "domains",
    };
    expect(utils.methods.getChipColor(chip)).toEqual("domain_color");
    chip = {
      type: "taxonomies",
    };
    expect(utils.methods.getChipColor(chip)).toEqual("taxonomic_color");
    chip = {
      type: "userDefinedTags",
    };
    expect(utils.methods.getChipColor(chip)).toEqual("tags_color");
    chip = {
      type: "objectTypes",
    };
    expect(utils.methods.getChipColor(chip)).toEqual("object_type_color");
    chip = {
      type: "xyz",
    };
    expect(utils.methods.getChipColor(chip)).toEqual("object_type_color");
  });

  it("capitalizes text", () => {
    expect(utils.methods.capitaliseText("exciting thing", "taxonomy")).toEqual(
      "Exciting thing",
    );
    expect(utils.methods.capitaliseText("exciting thing", "other")).toEqual(
      "Exciting Thing",
    );
  });

  it("returns associated records", () => {
    const record = {
      registry: "Standard",
      recordAssociations: [
        {
          linkedRecord: {
            registry: "Database",
            id: 1,
          },
        },
        {
          linkedRecord: {
            registry: "Collection",
            id: 2,
          },
        },
      ],
      reverseRecordAssociations: [
        {
          fairsharingRecord: {
            registry: "Policy",
            id: 3,
          },
        },
        {
          fairsharingRecord: {
            registry: "Collection",
            id: 4,
          },
        },
      ],
    };
    let result = {
      registryNumber: {
        standard: { val: 0, label: "standards" },
        database: { val: 1, label: "databases" },
        policy: { val: 1, label: "policies" },
      },
      registry: "standard",
    };
    expect(utils.methods.associatedRecords(record)).toStrictEqual(result);
  });

  it("sets and organises chips", () => {
    utils.methods.getMaxItemShown = 2;
    const record = {
      objectTypes: [
        {
          id: 1,
          label: "one",
        },
      ],
      subjects: [
        {
          id: 1,
          label: "one",
        },
      ],
      domains: [
        {
          id: 2,
          label: "two",
        },
        {
          id: 3,
          label: "three",
        },
      ],
      taxonomies: [],
    };
    expect(utils.methods.chips).toBe(undefined);
    utils.methods.setChips(record);
    let result = [
      { id: 1, label: "one", type: "objectTypes" },
      { id: 1, label: "one", type: "subjects" },
      { id: 2, label: "two", type: "domains" },
      { id: 3, label: "three", type: "domains" },
    ];
    expect(utils.methods.chips).toStrictEqual(result);
  });

  describe("setChips", () => {
    let context = {
      chips: [],
      remainTagCount: 0,
      getMaxItemShown: 2,
    };
    it("aggregates chips from multiple categories in the correct order", () => {
      context.getMaxItemShown = 5;
      const record = {
        subjects: [{ name: "S1" }],
        domains: [{ name: "D1" }],
      };

      context.setChips(record);

      expect(context.chips).toHaveLength(2);
      expect(context.chips[0].type).toBe("subjects");
      expect(context.chips[1].type).toBe("domains");
    });

    it("calculates the global remainTagCount correctly", () => {
      // Setup: Limit is 1 per category
      context.getMaxItemShown = 1;

      const record = {
        objectTypes: [{ name: "O1" }, { name: "O2" }],
        subjects: [{ name: "S1" }, { name: "S2" }, { name: "S3" }],
      };

      utils.methods.setChips(record);
      expect(context.remainTagCount).toBe(3);
      expect(context.chips).toHaveLength(2);
    });

    it("resets chips and counts before processing", () => {
      // Setup: Dirty state
      context.chips = ["old_garbage"];
      context.remainTagCount = 999;

      const record = { objectTypes: [{ name: "New" }] };
      context.getMaxItemShown = 5;

      context.setChips(record);

      expect(context.chips).toHaveLength(1);
      expect(context.chips[0].name).toBe("New");
      expect(context.remainTagCount).toBe(0);
    });
  });

  describe("organizeChips", () => {
    let context = {
      // Data properties
      chips: [],
      remainTagCount: 0,
      getMaxItemShown: 2, // Arbitrary limit for testing
    };
    it("pushes items to chips array if they are within the limit", () => {
      const record = {
        subjects: [{ name: "Math" }, { name: "Science" }],
      };
      const result = utils.methods.organizeChips(record, "subjects", 2);

      expect(result).toBe(true);
      expect(context.chips).toHaveLength(2);
      expect(context.chips[0]).toMatchObject({
        name: "Math",
        type: "subjects",
      });
      expect(context.chips[1]).toMatchObject({
        name: "Science",
        type: "subjects",
      });
    });

    it("increments remainTagCount on the record if items exceed limit", () => {
      const record = {
        subjects: [{ name: "1" }, { name: "2" }, { name: "3" }, { name: "4" }],
      };
      record.subjects.remainTagCount = 0;

      utils.methods.organizeChips(record, "subjects", 2);

      expect(context.chips).toHaveLength(2);
      expect(record.subjects.remainTagCount).toBe(2);
    });

    it("returns false if the node does not exist in record", () => {
      const record = {};
      const result = utils.methods.organizeChips(record, "missing_node", 5);

      expect(result).toBe(false);
      expect(context.chips).toHaveLength(0);
    });
  });

  it("truncates strings", function () {
    expect(utils.methods.truncateString(null, 1)).toBe(null);
    expect(utils.methods.truncateString("", 1)).toEqual("");
    expect(utils.methods.truncateString("pox on you", 3)).toEqual("pox...");
    expect(utils.methods.truncateString("banana", 6)).toEqual("banana");
  });
});
