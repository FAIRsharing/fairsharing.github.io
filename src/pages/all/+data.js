import Client from "@/lib/GraphClient/GraphClient.js";
import recordQuery from "@/lib/GraphClient/queries/getRecordSEO.json";

export async function data(pageContext) {
  const paramURL = pageContext.routeParams["*"];

  if (!paramURL || paramURL.trim() === "" || paramURL === "index") {
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
  const individualizedPayload = {
    ...recordQuery,
    queryParam: {
      id: paramURL,
    },
  };
  try {
    const responseData = await client.executeQuery(individualizedPayload);
    //Extract the clean data object out to Vike's pageContext
    return {
      record: responseData?.fairsharingRecord || null,
    };
  }
  catch (error) {
    console.error(
      "Failed to execute server-side SEO query for ID:",
      paramURL,
      error,
    );
    return { record: null };
  }
}
