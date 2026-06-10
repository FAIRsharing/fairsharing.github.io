// import GraphClient from "@/lib/GraphClient/GraphClientSEO.js";
// import getAllFairsharingRecordsQuery from "@/lib/GraphClient/queries/getAllFairsharingRecords.json";
//
// export async function onBeforePrerenderStart() {
//   const staticRoutes = [
//     "/",
//     "/advancedsearch",
//     "/organisations",
//     "/summary-statistics",
//     "/new",
//     "/stakeholders",
//     "/licence",
//     "/terms",
//     "/educational",
//     "/community_champions",
//     "/community_champions/our_champions",
//     "/privacy",
//     "/sustainability_and_preservation",
//     "/standards",
//     "/databases",
//     "/policies",
//     "/collections",
//     "/browse/subject",
//     "/communities",
//     "/api_doc",
//     "/search",
//   ];
//
//   try {
//     const graphClient = new GraphClient();
//     const allPayload = structuredClone(getAllFairsharingRecordsQuery);
//     const responseData = await graphClient.executeQuery(allPayload);
//
//     const records = responseData?.allFairsharingRecords || [];
//     const dynamicRoutes = records.map((record) => `/${record.id}`);
//
//     // Read the batch environment variable (Defaults to batch 1 if not passed)
//     const batch = parseInt(process.env.BUILD_BATCH || "1", 10);
//     const batchSize = 1500; // Limits each execution thread to 1,500 pages to keep memory low
//
//     const startIdx = (batch - 1) * batchSize;
//     const endIdx = startIdx + batchSize;
//     const slicedDynamicRoutes = dynamicRoutes.slice(startIdx, endIdx);
//
//     console.log(
//       `Building Batch #${batch} (Processing records ${startIdx} to ${Math.min(endIdx, dynamicRoutes.length)} out of ${dynamicRoutes.length})`,
//     );
//
//     // Only include static routes on the first batch so they don't reset or clear between cycles
//     if (batch === 1) {
//       return [...staticRoutes, ...slicedDynamicRoutes];
//     }
//
//     return slicedDynamicRoutes;
//   }
//   catch (error) {
//     console.error(
//       "Failed to fetch record IDs for pre-rendering, falling back to static routes only.",
//       error,
//     );
//     return staticRoutes;
//   }
// }

import GraphClient from "@/lib/GraphClient/GraphClientSEO.js";
import getAllFairsharingRecordsQuery from "@/lib/GraphClient/queries/getAllFairsharingRecords.json";

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

  const batchSize = 250;
  const batch = Number.parseInt(import.meta.env.VITE_BUILD_BATCH || "1", 10);

  const startId = (batch - 1) * batchSize + 1;
  const endId = batch * batchSize;
  console.log("VITE_BUILD_BATCH:", import.meta.env.VITE_BUILD_BATCH);
  console.log(
    `Building Batch #${batch} - Processing IDs ${startId} to ${endId}`,
  );

  try {
    const graphClient = new GraphClient();
    const allPayload = structuredClone(getAllFairsharingRecordsQuery);
    const responseData = await graphClient.executeQuery(allPayload);

    const records = responseData?.allFairsharingRecords || [];

    const dynamicRoutes = records
      .filter((record) => {
        const id = Number(record.id);
        return id >= startId && id <= endId;
      })
      .sort((a, b) => Number(a.id) - Number(b.id))
      .map((record) => `/${record.id}`);

    const maxId = records.reduce((max, record) => {
      const id = Number(record.id);
      return Number.isFinite(id) ? Math.max(max, id) : max;
    }, 0);

    console.log(
      `Building Batch #${batch} - Processing IDs ${startId} to ${Math.min(
        endId,
        maxId,
      )} out of max ID ${maxId}`,
    );

    if (dynamicRoutes.length === 0) {
      console.log(`No records found for batch #${batch}.`);
    }

    // Only include static routes on the first batch
    if (batch === 1) {
      return [...staticRoutes, ...dynamicRoutes];
    }

    return dynamicRoutes;
  }
  catch (error) {
    console.error(
      `Failed to fetch record IDs for pre-rendering batch #${batch}.`,
      error,
    );

    // Avoid rebuilding/resetting static routes on later batches
    if (batch === 1) {
      return staticRoutes;
    }

    return [];
  }
}
