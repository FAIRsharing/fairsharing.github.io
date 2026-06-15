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

export async function onBeforePrerenderStart() {
  const staticRoutes = [
    "/",
    "/advancedsearch",
    "/organisations",
    "/summary-statistics",
    "/new",
    "/stakeholders",
    "/licence",
    "/terms",
    "/educational",
    "/community_champions",
    "/community_champions/our_champions",
    "/privacy",
    "/sustainability_and_preservation",
    "/standards",
    "/databases",
    "/policies",
    "/collections",
    "/browse/subject",
    "/communities",
    "/api_doc",
    "/search",
  ];

  if (process.env.SKIP_FULL_PRERENDER === "true") {
    return staticRoutes;
  }

  const batchSize = Number.parseInt(
    process.env.VITE_BUILD_BATCH_SIZE || "250",
    10,
  );
  const batch = Number.parseInt(process.env.VITE_BUILD_BATCH || "1", 10);

  const startId = (batch - 1) * batchSize + 1;
  const endId = batch * batchSize;

  const dynamicRoutes = records.flatMap((record) => {
    const id = Number(record.id);
    if (id < startId || id > endId) return [];

    const routes = [`/${record.id}`];

    if (record.doi) {
      routes.push(`/${normalizeDoi(record.doi)}`);
    }

    return routes;
  });

  const uniqueRoutes = [...new Set(dynamicRoutes)];

  return batch === 1 ? [...staticRoutes, ...uniqueRoutes] : uniqueRoutes;
}
