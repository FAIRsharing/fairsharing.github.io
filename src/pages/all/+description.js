export default function description(pageContext) {
  const path = pageContext.urlPathname;
  const record = pageContext.data?.record;

  if (record) {
    return (
      record.description ||
      `View the full registry profile for ${record.name} on FAIRsharing.`
    );
  }
  if (path === "/search") return "Search";
  if (path === "/advancedsearch")
    return "Advanced filtering and searching for FAIRsharing records";

  return "A curated, informative and educational resource on data and metadata standards, databases and policies.";
}
