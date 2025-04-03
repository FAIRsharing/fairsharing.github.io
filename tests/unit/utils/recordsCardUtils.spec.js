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
      { id: 1, label: "one", type: "subjects" },
      { id: 2, label: "two", type: "domains" },
      { id: 3, label: "three", type: "domains" },
    ];
    expect(utils.methods.chips).toStrictEqual(result);
  });

  it("truncates strings", function () {
    expect(utils.methods.truncateString(null, 1)).toBe(null);
    expect(utils.methods.truncateString("", 1)).toEqual("");
    expect(utils.methods.truncateString("pox on you", 3)).toEqual("pox...");
    expect(utils.methods.truncateString("banana", 6)).toEqual("banana");
  });
});
