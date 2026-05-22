import Client from "@/lib/GraphClient/GraphClient.js";
import recordQuery from "@/lib/GraphClient/queries/getRecordSEO.json";

export async function data(pageContext) {
  //Extract the wildcard route parameter (e.g., "3493")
  const recordId = pageContext.routeParams["*"];

  // If there's no numeric record ID, return early (handles /search, /about, etc.)
  if (!recordId || isNaN(recordId)) {
    return { record: null };
  }

  // Mirror the core execution logic from the recorddata.js action
  const client = new Client();
  recordQuery.queryParam = {
    id: recordId,
  };

  try {
    const responseData = await client.executeQuery(recordQuery);
    //Extract the clean data object out to Vike's pageContext
    return {
      record: responseData?.fairsharingRecord || null,
    };
  }
  catch (error) {
    console.error(
      "Failed to execute server-side SEO query for ID:",
      recordId,
      error,
    );
    return { record: null };
  }
}
