import { redirect } from "vike/abort";
import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };
import {
  normalizeDoi,
  readGeneratedRecords,
} from "@/lib/Prerender/prerenderUtils.js";

export async function guard(pageContext) {
  if (buildContext.skipFull) {
    return;
  }

  const paramURL = pageContext.routeParams["*"];
  if (!paramURL || /^\d+$/.test(paramURL)) {
    return;
  }

  const routeValue = normalizeDoi(paramURL);
  const records = readGeneratedRecords();

  const record = records.find((r) => {
    const recordDoi = normalizeDoi(r.doi || "");
    return recordDoi === routeValue || recordDoi.endsWith(routeValue);
  });

  if (record) {
    throw redirect(`/${record.id}`, 301);
  }
}
