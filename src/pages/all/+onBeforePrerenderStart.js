import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };

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

  if (buildContext.skipFull) {
    return staticRoutes;
  }

  //Below file is used in full build, it is generated in full build step, so we need to import it dynamically to avoid errors in partial build
  const { default: records } = await import(
    "@/lib/Prerender/fairsharingRecords.generated.json"
  );

  const { default: organisations } = await import(
    "@/lib/Prerender/organisations.generated.json"
  );

  const batchSize = buildContext.batchSize || 500;
  const batch = buildContext.batch || 1;

  const startId = (batch - 1) * batchSize + 1;
  const endId = batch * batchSize;

  const maxId = records.reduce((max, record) => {
    const id = Number(record.id);
    return Number.isFinite(id) ? Math.max(max, id) : max;
  }, 0);

  const recordRoutes = records
    .filter((record) => {
      const id = Number(record.id);
      return id >= startId && id <= endId;
    })
    .sort((a, b) => Number(a.id) - Number(b.id))
    .map((record) => `/${record.id}`);

  const organisationRoutes = organisations
    .filter((org) => {
      const id = Number(org.id);
      return id >= startId && id <= endId;
    })
    .map((org) => `/organisations/${org.id}`);

  console.log(
    `Building Batch #${batch} - Processing IDs ${startId} to ${Math.min(
      endId,
      maxId,
    )} out of max ID ${maxId}`,
  );

  if (recordRoutes.length === 0) {
    console.log(`No records found for batch #${batch}.`);
  }

  const dynamicRoutes = [...new Set([...recordRoutes, ...organisationRoutes])];

  return batch === 1 ? [...staticRoutes, ...dynamicRoutes] : dynamicRoutes;
}
