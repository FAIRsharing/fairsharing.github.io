import records from "@/lib/Prerender/fairsharingRecords.generated.json";

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

  const skipFull = process.env.SKIP_FULL_PRERENDER === "true";
  if (skipFull) {
    return staticRoutes;
  }

  const batchSize = Number.parseInt(
    process.env.VITE_BUILD_BATCH_SIZE || "250",
    10,
  );
  const batch = Number.parseInt(process.env.VITE_BUILD_BATCH || "1", 10);

  const startId = (batch - 1) * batchSize + 1;
  const endId = batch * batchSize;

  const maxId = records.reduce((max, record) => {
    const id = Number(record.id);
    return Number.isFinite(id) ? Math.max(max, id) : max;
  }, 0);

  const dynamicRoutes = records
    .filter((record) => {
      const id = Number(record.id);
      return id >= startId && id <= endId;
    })
    .sort((a, b) => Number(a.id) - Number(b.id))
    .flatMap((record) => {
      const routes = [`/${record.id}`];
      if (record.doi) {
        let doiRoute = record.doi.replace(/^10\.\d{4,9}\/+/i, "");
        routes.push(`/${doiRoute}`);
      }
      return routes;
    });

  console.log(
    `Building Batch #${batch} - Processing IDs ${startId} to ${Math.min(
      endId,
      maxId,
    )} out of max ID ${maxId}`,
  );

  if (dynamicRoutes.length === 0) {
    console.log(`No records found for batch #${batch}.`);
  }

  return batch === 1 ? [...staticRoutes, ...dynamicRoutes] : dynamicRoutes;
}
