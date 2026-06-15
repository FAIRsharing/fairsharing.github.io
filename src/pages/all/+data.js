import records from "@/lib/Prerender/fairsharingRecords.generated.json";

function normalizeDoi(value) {
  return decodeURIComponent(String(value))
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^10\.\d{4,9}\/+/i, "")
    .replace(/^doi:/i, "")
    .replace(/\/$/, "");
}

export async function data(pageContext) {
  const paramURL = pageContext.routeParams["*"];

  if (!paramURL || paramURL.trim() === "" || paramURL === "index") {
    return { record: null };
  }

  const routeValue = normalizeDoi(paramURL);
  const isNumericId = /^\d+$/.test(routeValue);

  let record = null;

  if (isNumericId) {
    record = records.find((r) => String(r.id) === routeValue);
  }
  else {
    record = records.find((r) => {
      const recordDoi = normalizeDoi(r.doi);

      return (
        recordDoi === routeValue ||
        recordDoi.endsWith(routeValue) ||
        routeValue.endsWith(recordDoi)
      );
    });
  }

  return { record };
}
