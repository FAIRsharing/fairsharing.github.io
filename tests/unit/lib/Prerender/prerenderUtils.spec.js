// @vitest-environment node

import fs from "node:fs";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const mockPaths = vi.hoisted(() => {
  const root = "/tmp/fairsharing-prerender-utils-tests";
  return {
    root,
    records: `${root}/records.json`,
    organisations: `${root}/organisations.json`,
    jsonld: `${root}/jsonld`,
  };
});

vi.mock("@/lib/Prerender/build-context.json", () => ({
  default: {
    recordsFile: mockPaths.records,
    organisationsFile: mockPaths.organisations,
    jsonldDir: mockPaths.jsonld,
  },
}));

import {
  readGeneratedOrganisations,
  readGeneratedRecords,
  readGeneratedSchemaOrg,
} from "@/lib/Prerender/prerenderUtils.server.js";
import { normalizeDoi } from "@/lib/Prerender/prerenderUtils.shared.js";

describe("prerender utilities", () => {
  beforeAll(() => {
    fs.mkdirSync(mockPaths.jsonld, { recursive: true });
    fs.writeFileSync(mockPaths.records, JSON.stringify([{ id: 1 }]));
    fs.writeFileSync(
      mockPaths.organisations,
      JSON.stringify([{ id: 2, name: "Example" }]),
    );
    fs.writeFileSync(
      path.join(mockPaths.jsonld, "1.jsonld"),
      JSON.stringify({ "@type": "Dataset" }),
    );
  });

  afterAll(() => {
    fs.rmSync(mockPaths.root, { recursive: true, force: true });
  });

  it("reads generated records, organisations, and schema.org data", () => {
    expect(readGeneratedRecords()).toEqual([{ id: 1 }]);
    expect(readGeneratedOrganisations()).toEqual([{ id: 2, name: "Example" }]);
    expect(readGeneratedSchemaOrg(1)).toEqual({ "@type": "Dataset" });
  });

  it("returns the schema fallback when a generated file is absent", () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(readGeneratedSchemaOrg("missing")).toBeNull();
    expect(warning).toHaveBeenCalledWith(
      expect.stringContaining("missing.jsonld"),
    );

    warning.mockRestore();
  });

  it.each([
    [" https://doi.org/10.1234/example/ ", "10.1234/example"],
    ["http://dx.doi.org/10.1234%2Fencoded", "10.1234/encoded"],
    ["doi:/10.1234/example/", "10.1234/example"],
  ])("normalizes DOI value %s", (input, expected) => {
    expect(normalizeDoi(input)).toBe(expected);
  });
});
