import records from "@/lib/Prerender/fairsharingRecords.generated.json";

export async function data(pageContext) {
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
