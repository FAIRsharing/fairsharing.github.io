import Client from "@/lib/GraphClient/GraphClient.js";
import recordQuery from "@/lib/GraphClient/queries/getRecordSEO.json";

export async function data(pageContext) {
  const paramURL = pageContext.routeParams["*"];

  if (
    !paramURL ||
    paramURL.trim() === "" ||
    paramURL === "index" ||
    paramURL === "all"
  ) {
    return { record: null };
  }

  // Check for record page in id or DOI format
  const FAIRsharingDOIregex = /FAIRsharing\.[a-zA-Z0-9]+/;
  if (!isNaN(paramURL) || FAIRsharingDOIregex.test(paramURL)) {
    return recordPage(paramURL);
  }
}

/**
 * Record Page data
 * @param paramURL
 * @return {Promise<{record}|{record: null}>}
 */
async function recordPage(paramURL) {
  // Mirror the core execution logic from the recorddata.js action
  const client = new Client();
  const individualizedQuery = { ...recordQuery };
  individualizedQuery.queryParam = {
    id: paramURL,
  };

  //Promise that rejects automatically after 5 seconds
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("GraphQL backend timeout")), 5000),
  );

  try {
    const responseData = await Promise.race([
      client.executeQuery(individualizedQuery),
      timeoutPromise,
    ]);

    //Extract the clean data object out to Vike's pageContext
    return {
      record: responseData?.fairsharingRecord || null,
    };
  }
  catch (error) {
    console.warn(
      `⚠️ Skipping static data for ID [${paramURL}]:`,
      error.message || error,
    );
    return { record: null };
  }
}
