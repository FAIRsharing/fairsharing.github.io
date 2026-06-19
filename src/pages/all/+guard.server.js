import {redirect} from "vike/abort";
import buildContext from "@/lib/Prerender/build-context.json" with {type: "json"};
import {normalizeDoi} from "@/lib/Prerender/prerenderUtils.shared.js";

export async function guard(pageContext) {
  if (buildContext.skipFull) {
    return;
  }

  const { readGeneratedRecords } = await import(
    "@/lib/Prerender/prerenderUtils.server.js"
  );

  const paramURL = pageContext.routeParams["*"];
  if (!paramURL || /^\d+$/.test(paramURL)) {
    return;
  }

  const routeValue = normalizeDoi(paramURL);
  const records = await readGeneratedRecords();

  const record = records.find((r) => {
    const recordDoi = normalizeDoi(r.doi || "");
    return recordDoi === routeValue || recordDoi.endsWith(routeValue);
  });

  if (record) {
    throw redirect(`/${record.id}`, 301);
  }
}
