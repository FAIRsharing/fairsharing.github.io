import { beforeEach, describe, expect, it, vi } from "vitest";

const pageData = vi.hoisted(() => ({ current: {} }));

vi.mock("vike-vue/useData", () => ({
  useData: () => pageData.current,
}));
vi.mock("vike-vue/config", () => ({ default: { name: "vike-vue" } }));
vi.mock("@/pages/+Layout.vue", () => ({ default: { name: "Layout" } }));

import config from "@/pages/+config.js";
import Head from "@/pages/all/+Head.js";
import description from "@/pages/all/+description.js";
import route from "@/pages/all/+route.js";
import title from "@/pages/all/+title.js";
import organisationDescription from "@/pages/organisations/@id/+description.js";
import organisationTitle from "@/pages/organisations/@id/+title.js";

describe("page metadata", () => {
  beforeEach(() => {
    pageData.current = {};
  });

  it("exports the root Vike configuration and catch-all route", () => {
    expect(config.extends).toEqual([{ name: "vike-vue" }]);
    expect(config.Layout).toEqual({ name: "Layout" });
    expect(config.ssr).toBe(true);
    expect(config.prerender).toMatchObject({ partial: true, parallel: false });
    expect(route).toBe("/*");
  });

  it("does not create record head elements without a record", () => {
    expect(Head()).toBeNull();
  });

  it("creates canonical, Open Graph, and escaped schema.org head elements", () => {
    pageData.current = {
      record: {
        doi: "10.1234/example",
        name: "Example record",
        description: "Description <unsafe>",
      },
      schemaOrg: { "@context": "https://schema.org", ignoredName: "old" },
      canonicalUrl: "https://fairsharing.org/10.1234/example",
      seoTitle: "Example record | FAIRsharing",
      seoDescription: "Example description",
    };

    const elements = Head();
    const script = elements.find((element) => element.type === "script");

    expect(elements).toHaveLength(7);
    expect(elements.find((element) => element.type === "title").children).toBe(
      "Example record | FAIRsharing",
    );
    expect(script.props.innerHTML).toContain("\\u003cunsafe>");
    expect(script.props.innerHTML).toContain(
      '"url":"https://fairsharing.org/10.1234/example"',
    );
  });

  it("filters optional head elements and schema when values are absent", () => {
    pageData.current = { record: { name: "Minimal" } };

    expect(Head()).toEqual([]);
  });

  it("uses schema.org fallbacks when DOI and description are absent", () => {
    pageData.current = {
      record: { name: "Minimal" },
      schemaOrg: { "@context": "https://schema.org" },
      canonicalUrl: "https://fairsharing.org/1",
    };

    const script = Head().find((element) => element.type === "script");
    const schema = JSON.parse(script.props.innerHTML);

    expect(schema.identifier).toEqual([]);
    expect(schema.description).toBe("");
  });

  it("returns record, static, search, and fallback titles", () => {
    expect(
      title({ urlPathname: "/anything", data: { record: { name: "Record" } } }),
    ).toBe("Record | FAIRsharing");
    expect(title({ urlPathname: "/privacy" })).toBe(
      "Privacy Policy | FAIRsharing",
    );
    expect(
      title({
        urlPathname: "/search",
        urlParsed: { search: "?fairsharingRegistry=DATABASE" },
      }),
    ).toBe("Databases | FAIRsharing");
    expect(
      title({
        urlPathname: "/search",
        urlParsed: { search: "?fairsharingRegistry=unknown" },
      }),
    ).toBe("Search | FAIRsharing");
    expect(title({ urlPathname: "/unknown" })).toBe("FAIRsharing");
  });

  it("returns record, static, search, and fallback descriptions", () => {
    expect(
      description({
        urlPathname: "/anything",
        data: { record: { name: "Record", description: "Record description" } },
      }),
    ).toBe("Record description");
    expect(
      description({
        urlPathname: "/anything",
        data: { record: { name: "Record" } },
      }),
    ).toContain("Record");
    expect(description({ urlPathname: "/organisations" })).toBe(
      "List of Organisations",
    );
    expect(
      description({
        urlPathname: "/search",
        urlParsed: { search: "?fairsharingRegistry=POLICY" },
      }),
    ).toContain("data preservation");
    expect(description({ urlPathname: "/search" })).toContain(
      "advanced filtering",
    );
    expect(
      description({
        urlPathname: "/search",
        urlParsed: { search: "?fairsharingRegistry=unknown" },
      }),
    ).toContain("advanced filtering");
    expect(description({ urlPathname: "/unknown" })).toContain(
      "A curated, informative",
    );
  });

  it("creates organisation titles and descriptions with fallbacks", () => {
    const context = {
      data: {
        organisation: {
          name: "Example Organisation",
          homepage: "https://example.org",
        },
      },
    };

    expect(organisationTitle(context)).toBe(
      "Example Organisation | FAIRsharing",
    );
    expect(organisationDescription(context)).toBe("https://example.org");
    expect(
      organisationDescription({
        data: { organisation: { name: "No homepage", length: 1 } },
      }),
    ).toContain("1 organisations available");
    expect(organisationTitle({})).toBe("Organisations | FAIRsharing");
    expect(organisationDescription({})).toContain("A curated, informative");
  });
});
