export default function description(pageContext) {
  const path = pageContext.urlPathname;
  //Record pages (Most dynamic, checked first)
  const record = pageContext.data?.record;
  if (record) {
    return (
      record.description ||
      `View the full registry profile for ${record.name || "this resource"} on FAIRsharing.`
    );
  }

  //Static Route Descriptions
  const staticDescriptions = {
    "/advancedsearch":
      "Advanced filtering and searching for FAIRsharing records",
    "/organisations": "List of Organisations",
    "/summary-statistics":
      "A selection of charts describing the standards, databases and data policies stored within the FAIRsharing registries",
    "/new":
      "Describe your standard, database or data policy with us to make it more discoverable, more widely adopted and cited.",
    "/stakeholders": "FAIRsharing stakeholders",
    "/licence": "Using FAIRsharing content through the web or through our API",
    "/terms": "Acceptable Use Policy and Conditions of Use",
    "/educational":
      "Infographics and factsheets by the FAIRsharing Team and our Community Champions, covering content and functionalities for all stakeholders",
    "/community_champions":
      "Put your expertise into action and get credited by joining our Community Champions programme.",
    "/community_champions/our_champions": "Community Champions",
    "/privacy":
      "FAIRsharing.org (“This site”) is operated by the University of Oxford. We are committed to protecting the privacy and security of your personal information (‘personal data’).",
    "/sustainability_and_preservation":
      "Since 2011, FAIRsharing is a sustainable service operating with and for the international researcher community and other stakeholders involved in the research life cycle. The FAIRsharing resource, along its core operational team, are based at the University of Oxford, UK.",
    "/standards":
      "A registry of terminology artefacts, models/formats, reporting guidelines, and identifier schemas.",
    "/databases":
      "A registry of knowledgebases and repositories of data and other digital assets.",
    "/policies":
      "A registry of data preservation, management and sharing policies from international funding agencies, regulators, journals, and other organisations.",
    "/collections":
      "Collections group together one or more types of resource (standard, database or policy) by domain, project or organisation.",
    "/fairassist":
      "FAIRsharing provides a registry that stores records relating to FAIR assistance and evaluation, initially developed as part of the OSTrails project but open to all assessment tools. The types of records within this registry are defined here, as well as how those record types align with community-developed frameworks and standards.",
    "/browse/subject":
      "Subject Browser helps you navigate the subjects hierarchy and find the standards, repositories, and policies relevant to you.",
    "/communities":
      "FAIRsharing is a community-driven resource with users and collaborators across all disciplines. We work together with our stakeholders to enable the FAIR Principles by promoting the value and the use of standards, databases and policies.",
    "/api_doc":
      "How to use the FAIRsharing REST API for for querying and modifying records",
  };

  if (staticDescriptions[path]) {
    return staticDescriptions[path];
  }

  // Search pages (Robust URL query extraction via URLSearchParams)
  const searchParams = new URLSearchParams(pageContext.urlParsed?.search || "");
  if (path === "/search") {
    const registry = searchParams.get("fairsharingRegistry");
    const allowedRegistries = [
      "standard",
      "database",
      "policy",
      "collection",
      "fairassist",
    ];
    const defaultSearchDescription =
      "Search the FAIRsharing records using advanced filtering";

    if (registry) {
      const normalizedRegistry = registry.toLowerCase();

      // heck if the param is one of your specific keys
      if (allowedRegistries.includes(normalizedRegistry)) {
        const registryTitles = {
          standard:
            "A registry of terminology artefacts, models/formats, reporting guidelines, and identifier schemas.",
          database:
            "A registry of knowledgebases and repositories of data and other digital assets.",
          policy:
            "A registry of data preservation, management and sharing policies from international funding agencies, regulators, journals, and other organisations.",
          collection:
            "Collections group together one or more types of resource (standard, database or policy) by domain, project or organisation.",
          fairassist:
            "FAIRsharing provides a registry that stores records relating to FAIR assistance and evaluation, initially developed as part of the OSTrails project but open to all assessment tools. The types of records within this registry are defined here, as well as how those record types align with community-developed frameworks and standards.",
        };

        return registryTitles[normalizedRegistry];
      }
    }
    return defaultSearchDescription;
  }

  //Global Fallback
  return "A curated, informative and educational resource on data and metadata standards, databases and policies.";
}
