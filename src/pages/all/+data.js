import records from "@/lib/Prerender/fairsharingRecords.generated.json";
import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };
export async function data(pageContext) {
  if (buildContext.skipFull) {
    return { record: null };
  }
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
