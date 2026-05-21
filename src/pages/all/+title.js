export default function title(pageContext) {
  const path = pageContext.urlPathname;
  const record = pageContext.data?.record;
  // If we are looking at a specific record ID
  if (record && record.name) {
    return `${record.name} | FAIRsharing`;
  }
  if (path === "/search") return "Search | FAIRsharing";
  if (path === "/advancedsearch") return "AdvancedSearch | FAIRsharing";

  return "FAIRsharing";
}
