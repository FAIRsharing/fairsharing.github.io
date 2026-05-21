export default function title(pageContext) {
  const path = pageContext.urlPathname;
  const record = pageContext.data?.record;
  // If we are looking at a specific record ID
  if (record && record.name) {
    return `${record.name} | FAIRsharing Record`;
  }
  if (path === "/search") return "Search Records | FAIRsharing";
  if (path === "/about") return "About Us | FAIRsharing";

  return "FAIRsharing";
}
