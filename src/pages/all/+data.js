import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };
import { normalizeDoi } from "@/lib/Prerender/prerenderUtils.shared.js";

export async function data(pageContext) {
  if (buildContext.skipFull) {
    return { record: null };
  }

  //Below file is used in full build, it is generated in full build step, so we need to import it dynamically to avoid errors in partial build
  const { readGeneratedRecords } = await import(
    "@/lib/Prerender/prerenderUtils.server.js"
  );
  const records = await readGeneratedRecords();
  const paramURL = pageContext.routeParams["*"];

  if (!paramURL || paramURL.trim() === "" || paramURL === "index") {
    return { record: null };
  }

  // if (!/^\d+$/.test(paramURL)) {
  //   return { record: null };
  // }

  const routeValue = normalizeDoi(paramURL);

  const record = records.find((r) => {
    const recordDoi = normalizeDoi(r.doi || "");

    return (
      String(r.id) === routeValue ||
      recordDoi === routeValue ||
      recordDoi.endsWith(routeValue)
    );
  });
  return { record: record || null };
}
