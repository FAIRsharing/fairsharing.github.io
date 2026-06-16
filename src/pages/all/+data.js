import records from "@/lib/Prerender/fairsharingRecords.generated.json";

export async function data(pageContext) {
  const paramURL = pageContext.routeParams["*"];

  if (!paramURL || paramURL.trim() === "" || paramURL === "index") {
    return { record: null };
  }

  const FAIRsharingDOIregex = /FAIRsharing\.[a-zA-Z0-9]+/;

  if (!isNaN(paramURL) || FAIRsharingDOIregex.test(paramURL)) {
    const record = records.find((r) => String(r.id) === String(paramURL));

    return { record: record || null };
  }

  return { record: null };
}
