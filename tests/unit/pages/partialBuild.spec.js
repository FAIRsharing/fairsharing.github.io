import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/Prerender/build-context.json", () => ({
  default: { skipFull: true },
}));

import { data as recordData } from "@/pages/all/+data.js";
import { onBeforePrerenderStart } from "@/pages/all/+onBeforePrerenderStart.js";
import { data as organisationsData } from "@/pages/organisations/+data.js";
import { data as organisationData } from "@/pages/organisations/@id/+data.js";

describe("partial-build page data", () => {
  it("skips generated record and organisation data", async () => {
    await expect(
      recordData({ routeParams: { "*": "1" } }),
    ).resolves.toMatchObject({ record: null, schemaOrg: null });
    await expect(organisationsData()).resolves.toEqual({ organisation: null });
    await expect(
      organisationData({ routeParams: { id: "1" } }),
    ).resolves.toEqual({ organisation: null });
  });

  it("returns only static routes", async () => {
    const routes = await onBeforePrerenderStart();

    expect(routes).toContain("/");
    expect(routes).toContain("/search");
    expect(routes.some((route) => /^\/\d+$/.test(route))).toBe(false);
  });
});
