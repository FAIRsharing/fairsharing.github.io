export default function title(pageContext) {
  //Organisations pages
  const organisation = pageContext.data?.organisation;
  if (organisation && organisation.name) {
    return (
      organisation.homepage ||
      `Browse FAIRsharing organisations. ${organisation.length} organisations available.`
    );
  }
  return "A curated, informative and educational resource on data and metadata standards, databases and policies.";
}
