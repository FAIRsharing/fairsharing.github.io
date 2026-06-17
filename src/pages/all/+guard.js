import {redirect} from "vike/abort";
import records from "@/lib/Prerender/fairsharingRecords.generated.json";

function normalizeDoi(value) {
  return decodeURIComponent(String(value))
    .trim()
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, "")
    .replace(/^doi:/i, "")
    .replace(/^10\.\d{4,9}\//i, "")
    .replace(/^\//, "")
    .replace(/\/$/, "");
}

export async function guard(pageContext) {
  const paramURL = pageContext.routeParams["*"];

  if (!paramURL || /^\d+$/.test(paramURL)) {
    return;
  }

  const routeValue = normalizeDoi(paramURL);

  const record = records.find((r) => {
    const recordDoi = normalizeDoi(r.doi || "");
    return recordDoi === routeValue || recordDoi.endsWith(routeValue);
  });

  if (record) {
    throw redirect(`/${record.id}`, 301);
  }
}
