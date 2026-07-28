import { beforeEach, describe, expect, it, vi } from "vitest";

const fixtures = vi.hoisted(() => ({
  records: [
    {
      id: 1,
      doi: "10.1234/example",
      name: "Example record",
      description: "Record description",
    },
    { id: 2, doi: "", name: "Second record", description: "" },
    { id: "invalid", doi: "10.1234/other", name: "Other record" },
  ],
  organisations: [
    { id: 1, name: "First organisation" },
    { id: 2, name: "Second organisation" },
  ],
  schemaOrg: { "@type": "Dataset" },
}));

vi.mock("@/lib/Prerender/build-context.json", () => ({
  default: { skipFull: false, batch: 1, batchSize: 2 },
}));
vi.mock("@/lib/Prerender/prerenderUtils.server.js", () => ({
  readGeneratedRecords: vi.fn(async () => fixtures.records),
  readGeneratedOrganisations: vi.fn(async () => fixtures.organisations),
  readGeneratedSchemaOrg: vi.fn(() => fixtures.schemaOrg),
}));

import { data as recordData } from "@/pages/all/+data.js";
import { onBeforePrerenderStart } from "@/pages/all/+onBeforePrerenderStart.js";
import { data as organisationsData } from "@/pages/organisations/+data.js";
import { data as organisationData } from "@/pages/organisations/@id/+data.js";

describe("prerender page data", () => {
  beforeEach(() => {
    vi.stubEnv("SSR", true);
  });

  it("returns empty metadata for empty and unknown record routes", async () => {
    await expect(
      recordData({ routeParams: { "*": "index" } }),
    ).resolves.toMatchObject({ record: null, schemaOrg: null });
    await expect(
      recordData({ routeParams: { "*": "not-found" } }),
    ).resolves.toMatchObject({ record: null, canonicalUrl: null });
  });

  it("finds numeric and DOI record routes and builds canonical metadata", async () => {
    const numeric = await recordData({ routeParams: { "*": "1" } });
    const doiAlias = await recordData({ routeParams: { "*": "example" } });

    expect(numeric).toMatchObject({
      record: fixtures.records[0],
      schemaOrg: fixtures.schemaOrg,
      canonicalUrl: "https://fairsharing.org/10.1234/example",
      seoTitle: "Example record | FAIRsharing",
      seoDescription: "Record description",
    });
    expect(doiAlias.record).toEqual(fixtures.records[0]);
  });

  it("returns record-only data in the browser", async () => {
    vi.stubEnv("SSR", false);

    await expect(recordData({ routeParams: { "*": "2" } })).resolves.toEqual({
      record: fixtures.records[1],
      schemaOrg: null,
    });
  });

  it("builds unique static, record, DOI, and organisation prerender routes", async () => {
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    const routes = await onBeforePrerenderStart();

    expect(routes).toContain("/");
    expect(routes).toContain("/1");
    expect(routes).toContain("/10.1234/example");
    expect(routes).toContain("/example");
    expect(routes).toContain("/2");
    expect(routes).toContain("/organisations/2");
    expect(new Set(routes).size).toBe(routes.length);
    expect(log).toHaveBeenCalledWith(expect.stringContaining("Building Batch #1"));

    log.mockRestore();
  });

  it("logs when a batch contains no record routes", async () => {
    const records = [...fixtures.records];
    const organisations = [...fixtures.organisations];
    fixtures.records.splice(0);
    fixtures.organisations.splice(0);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    const routes = await onBeforePrerenderStart();

    expect(routes).toContain("/");
    expect(log).toHaveBeenCalledWith("No records found for batch #1.");

    fixtures.records.push(...records);
    fixtures.organisations.push(...organisations);
    log.mockRestore();
  });

  it("returns organisation collections and selects an organisation by ID", async () => {
    await expect(organisationsData()).resolves.toEqual({
      organisations: fixtures.organisations,
    });
    await expect(
      organisationData({ routeParams: { id: "2" } }),
    ).resolves.toEqual({ organisation: fixtures.organisations[1] });
    await expect(
      organisationData({ routeParams: {} }),
    ).resolves.toEqual({ organisation: null });
    await expect(
      organisationData({ routeParams: { id: "99" } }),
    ).resolves.toEqual({ organisation: null });
  });
});
