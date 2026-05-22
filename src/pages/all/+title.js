export default function title(pageContext) {
  const path = pageContext.urlPathname;
  // console.log("pageContext::", pageContext);
  // console.log("pageContext.urlPathname::", pageContext.urlPathname);
  // console.log("pageContext.urlParsed:::", pageContext.urlParsed);
  const record = pageContext.data?.record;
  // If we are looking at a specific record ID
  if (record && record.name) {
    return `${record.name} | FAIRsharing`;
  }
  if (path === "/search") return "Search | FAIRsharing";
  if (path === "/advancedsearch") return "AdvancedSearch | FAIRsharing";

  return "FAIRsharing";
}
