import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };

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

  if (!/^\d+$/.test(paramURL)) {
    return { record: null };
  }

  const record = records.find((r) => String(r.id) === String(paramURL));
  return { record: record || null };
}
