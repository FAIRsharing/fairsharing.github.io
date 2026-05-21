export default function description(pageContext) {
  const path = pageContext.urlPathname;
  const record = pageContext.data?.record;

  if (record) {
    return (
      record.description ||
      record.summary ||
      `View the full registry profile for ${record.name} on FAIRsharing.`
    );
  }
  if (path === "/search") return "Search Records | FAIRsharing";
  if (path === "/about") return "About Us | FAIRsharing";

  return "A curated, informative and educational resource on data and metadata standards, databases and policies.";
}
