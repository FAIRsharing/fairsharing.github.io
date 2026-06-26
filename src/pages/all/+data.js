import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };
import { normalizeDoi } from "@/lib/Prerender/prerenderUtils.shared.js";

export async function data(pageContext) {
  if (buildContext.skipFull) {
    return { record: null, schemaOrg: null };
  }

  const { readGeneratedRecords, readGeneratedSchemaOrg } = await import(
    "@/lib/Prerender/prerenderUtils.server.js"
  );

  const records = await readGeneratedRecords();
  const paramURL = pageContext.routeParams["*"];

  if (!paramURL || paramURL.trim() === "" || paramURL === "index") {
    return { record: null, schemaOrg: null };
  }

  const routeValue = normalizeDoi(paramURL);

  const record = records.find((r) => {
    const recordDoi = normalizeDoi(r.doi || "");
    return (
      String(r.id) === routeValue ||
      recordDoi === routeValue ||
      recordDoi.endsWith(routeValue)
    );
  });

  if (!record) {
    return { record: null, schemaOrg: null };
  }

  if (!import.meta.env.SSR) {
    return { record, schemaOrg: null };
  }
  const schemaOrg = readGeneratedSchemaOrg(record.id);

  return {
    record,
    schemaOrg,
  };
}
