// import GraphClient from "@/lib/GraphClient/GraphClient.js";
// import getAllFairsharingRecordsQuery from "@/lib/GraphClient/queries/getAllFairsharingRecords.json";

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
    "/1",
    "/2",
  ];

  return staticRoutes;

  // try {
  //   const graphClient = new GraphClient();
  //   const responseData = await graphClient.executeQuery(
  //     getAllFairsharingRecordsQuery,
  //   );
  //
  //   const records = responseData?.allFairsharingRecords || [];
  //   const dynamicRoutes = records.map((record) => `/${record.id}`);
  //
  //   // Read the batch environment variable (Defaults to batch 1 if not passed)
  //   const batch = parseInt(process.env.BUILD_BATCH || "1", 10);
  //   const batchSize = 1500; // Limits each execution thread to 1,500 pages to keep memory low
  //
  //   const startIdx = (batch - 1) * batchSize;
  //   const endIdx = startIdx + batchSize;
  //   const slicedDynamicRoutes = dynamicRoutes.slice(startIdx, endIdx);
  //
  //   console.log(
  //     `Building Batch #${batch} (Processing records ${startIdx} to ${Math.min(endIdx, dynamicRoutes.length)} out of ${dynamicRoutes.length})`,
  //   );
  //
  //   // Only include static routes on the first batch so they don't reset or clear between cycles
  //   if (batch === 1) {
  //     return [...staticRoutes, ...slicedDynamicRoutes];
  //   }
  //
  //   return slicedDynamicRoutes;
  // }
  // catch (error) {
  //   console.error(
  //     "Failed to fetch record IDs for pre-rendering, falling back to static routes only.",
  //     error,
  //   );
  //   return staticRoutes;
  // }
}
