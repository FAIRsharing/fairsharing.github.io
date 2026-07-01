import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };
import { normalizeDoi } from "@/lib/Prerender/prerenderUtils.shared.js";

export async function data(pageContext) {
  if (buildContext.skipFull) {
    return {
      record: null,
      schemaOrg: null,
      canonicalUrl: null,
      seoTitle: null,
      seoDescription: null,
    };
  }

  const { readGeneratedRecords, readGeneratedSchemaOrg } = await import(
    "@/lib/Prerender/prerenderUtils.server.js"
  );

  const records = await readGeneratedRecords();
  const paramURL = pageContext.routeParams["*"];

  if (!paramURL || paramURL.trim() === "" || paramURL === "index") {
    return {
      record: null,
      schemaOrg: null,
      canonicalUrl: null,
      seoTitle: null,
      seoDescription: null,
    };
  }

  const routeValue = normalizeDoi(paramURL);
  const isNumericRoute = /^\d+$/.test(routeValue);

  const record = records.find((r) => {
    if (isNumericRoute) {
      return String(r.id) === routeValue;
    }

    const recordDoi = normalizeDoi(r.doi || "");
    const recordDoiAlias = recordDoi.replace(/^10\.\d{4,9}\//i, "");
    return recordDoi === routeValue || routeValue === recordDoiAlias;
  });

  if (!record) {
    return {
      record: null,
      schemaOrg: null,
      canonicalUrl: null,
      seoTitle: null,
      seoDescription: null,
    };
  }

  if (!import.meta.env.SSR) {
    return { record, schemaOrg: null };
  }
  const schemaOrg = readGeneratedSchemaOrg(record.id);
  const doi = normalizeDoi(record.doi || "");
  const doiAlias = doi.replace(/^10\.\d{4,9}\//i, "");
  const canonicalPath = doi || doiAlias || String(record.id);
  const canonicalUrl = `https://fairsharing.org/${canonicalPath}`;
  const seoTitle = `${record.name} | FAIRsharing`;
  const seoDescription = record.description || "";

  return {
    record,
    schemaOrg,
    canonicalUrl,
    seoTitle,
    seoDescription,
  };
}
