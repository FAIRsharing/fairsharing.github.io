export default function title(pageContext) {
  const path = pageContext.urlPathname;
  const hash = pageContext.urlParsed?.hash.toLowerCase() || "";

  //Record pages
  const record = pageContext.data?.record;
  if (record && record.name) {
    return `${record.name} | FAIRsharing`;
  }

  //Communities Page
  if (path === "/communities") {
    const communityTitles = {
      adopters: "Adopters | Communities | FAIRsharing",
      activities: "Activities | Communities | FAIRsharing",
      governance: "Governance | Communities | FAIRsharing",
      default: "Communities | FAIRsharing",
    };

    // Safely check which section is present in the hash fragment
    const matchedSection = ["adopters", "activities", "governance"].find(
      (section) => hash.includes(section),
    );
    return communityTitles[matchedSection] || communityTitles.default;
  }

  const staticTitles = {
    "/advancedsearch": "AdvancedSearch | FAIRsharing",
    "/organisations": "Organisations | FAIRsharing",
    "/summary-statistics": "Summary Statistics | FAIRsharing",
    "/new": "Adding content in FAIRsharing | FAIRsharing",
    "/stakeholders": "Using FAIRsharing & stakeholders | FAIRsharing",
    "/licence": "Licence | FAIRsharing",
    "/terms": "Terms | FAIRsharing",
    "/educational": "Educational | FAIRsharing",
    "/community_champions":
      "FAIRsharing Community Champions Programme | FAIRsharing",
    "/community_champions/our_champions": "Community Champions | FAIRsharing",
    "/privacy": "Privacy Policy | FAIRsharing",
    "/sustainability_and_preservation":
      "FAIRsharing Sustainability | FAIRsharing",
    "/standards": "Standards | FAIRsharing",
    "/databases": "Databases | FAIRsharing",
    "/policies": "Policies | FAIRsharing",
    "/collections": "Collections | FAIRsharing",
  };

  if (staticTitles[path]) {
    return staticTitles[path];
  }

  const searchParams = new URLSearchParams(pageContext.urlParsed?.search || "");
  const registry = searchParams.get("fairsharingRegistry");

  if (registry) {
    const registryTitles = {
      standard: "Standards | FAIRsharing",
      database: "Databases | FAIRsharing",
      policy: "Policies | FAIRsharing",
      collection: "Collections | FAIRsharing",
    };

    const matchedTitle = registryTitles[registry.toLowerCase()];
    if (matchedTitle) {
      return matchedTitle;
    }
  }

  return "FAIRsharing";
}
