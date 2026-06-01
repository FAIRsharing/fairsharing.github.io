export default function title(pageContext) {
  const path = pageContext.urlPathname;
  // const hashRaw = pageContext.urlParsed?.hash || "";
  // const hash = hashRaw.toLowerCase();

  //Record pages
  const record = pageContext.data?.record;
  if (record && record.name) {
    return `${record.name} | FAIRsharing`;
  }

  //Communities Page
  // if (path === "/communities") {
  //   const communityTitles = {
  //     adopters: "Adopters | Communities | FAIRsharing",
  //     activities: "Activities | Communities | FAIRsharing",
  //     governance: "Governance | Communities | FAIRsharing",
  //     default: "Communities | FAIRsharing",
  //   };
  //
  //   // Safely check which section is present in the hash fragment
  //   const matchedSection = ["adopters", "activities", "governance"].find(
  //     (section) => hash.includes(section),
  //   );
  //   return communityTitles[matchedSection] || communityTitles.default;
  // }

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
    "/fairassist": "Fairassist | FAIRsharing",
    "/browse/subject": "Subject Browser| FAIRsharing",
    "/communities": "Communities| FAIRsharing",
  };

  if (staticTitles[path]) {
    return staticTitles[path];
  }

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
    const defaultSearchTitle = "Search | FAIRsharing";

    if (registry) {
      const normalizedRegistry = registry.toLowerCase();

      // heck if the param is one of your specific keys
      if (allowedRegistries.includes(normalizedRegistry)) {
        const registryTitles = {
          standard: "Standards | FAIRsharing",
          database: "Databases | FAIRsharing",
          policy: "Policies | FAIRsharing",
          collection: "Collections | FAIRsharing",
          fairassist: "Fairassist | FAIRsharing",
        };

        return registryTitles[normalizedRegistry];
      }
    }
    return defaultSearchTitle;
  }

  return "FAIRsharing";
}
