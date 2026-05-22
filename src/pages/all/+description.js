export default function description(pageContext) {
  const path = pageContext.urlPathname;
  const hash = (pageContext.urlParsed?.hash || "").toLowerCase();
  //Record pages (Most dynamic, checked first)
  const record = pageContext.data?.record;
  if (record) {
    return (
      record.description ||
      `View the full registry profile for ${record.name || "this resource"} on FAIRsharing.`
    );
  }

  //Communites Page
  if (path === "/communities") {
    const communityTitles = {
      adopters:
        "Adopters are generally representatives of institutions, libraries, journal publishers, infrastructure programmes, societies and other organisations or projects that in turn serve and guide individual researchers or other stakeholders on research data management matters. Adopters display a FAIRsharing logo on their websites with a link from their website to our homepage.",
      activities:
        "FAIRsharing is not just a registry. The team behind FAIRsharing is involved in a number of FAIR-enabling activities, delivering guidance, tools and services with and for a variety of stakeholders. As these activities mature, we will implement or connect them in/to the FAIRsharing resource itself.",
      governance:
        "Based at the University of Oxford, UK, FAIRsharing has become a sustainable service, operating since 2011 with and for the researchers and all other stakeholders involved in the data life cycle.\n" +
        "The operational team is based in the Data Readiness Group, at the University of Oxford, supported by the Bodleian Library for DOI generation and access to the ORCID member-only API.",
      default:
        "FAIRsharing is a community-driven resource with users and collaborators across all disciplines. We work together with our stakeholders to enable the FAIR Principles by promoting the value and the use of standards, databases and policies.",
    };

    // Safely check which section is present in the hash fragment
    const matchedSection = ["adopters", "activities", "governance"].find(
      (section) => hash.includes(section),
    );
    return communityTitles[matchedSection] || communityTitles.default;
  }

  // 2. Static Route Descriptions (Clean lookup table)
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
    "/search": "Search the FAIRsharing records using advanced filtering",
    "/educational":
      "Infographics and factsheets by the FAIRsharing Team and our Community Champions, covering content and functionalities for all stakeholders",
    "/community_champions":
      "Put your expertise into action and get credited by joining our Community Champions programme.",
    "/community_champions/our_champions": "Community Champions",
    "/privacy":
      "FAIRsharing.org (“This site”) is operated by the University of Oxford. We are committed to protecting the privacy and security of your personal information (‘personal data’).",
    "/sustainability_and_preservation":
      "Since 2011, FAIRsharing is a sustainable service operating with and for the international researcher community and other stakeholders involved in the research life cycle. The FAIRsharing resource, along its core operational team, are based at the University of Oxford, UK.",
  };

  if (staticDescriptions[path]) {
    return staticDescriptions[path];
  }

  // Search pages (Robust URL query extraction via URLSearchParams)
  const searchParams = new URLSearchParams(pageContext.urlParsed?.search || "");
  const registry = searchParams.get("fairsharingRegistry");

  if (registry) {
    const registryDescriptions = {
      standard:
        "A registry of terminology artefacts, models/formats, reporting guidelines, and identifier schemas.",
      database:
        "A registry of knowledgebases and repositories of data and other digital assets.",
      policy:
        "A registry of data preservation, management and sharing policies from international funding agencies, regulators, journals, and other organisations.",
      collection:
        "Collections group together one or more types of resource (standard, database or policy) by domain, project or organisation.",
    };

    const matchedDescription = registryDescriptions[registry.toLowerCase()];
    if (matchedDescription) {
      return matchedDescription;
    }
  }

  //Global Fallback
  return "A curated, informative and educational resource on data and metadata standards, databases and policies.";
}
