import { redirect } from "vike/abort";
import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };

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
  if (buildContext.skipFull) {
    return;
  }
  const paramURL = pageContext.routeParams["*"];

  if (!paramURL || /^\d+$/.test(paramURL)) {
    return;
  }

  const routeValue = normalizeDoi(paramURL);

  //Below file is used in full build, it is generated in full build step, so we need to import it dynamically to avoid errors in partial build
  const { default: records } = await import(
    "@/lib/Prerender/fairsharingRecords.generated.json"
  );
  const record = records.find((r) => {
    const recordDoi = normalizeDoi(r.doi || "");
    return recordDoi === routeValue || recordDoi.endsWith(routeValue);
  });

  if (record) {
    throw redirect(`/${record.id}`, 301);
  }
}
