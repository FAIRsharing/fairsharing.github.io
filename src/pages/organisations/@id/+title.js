export default function title(pageContext) {
  //Organisations pages
  const organisation = pageContext.data?.organisation;
  if (organisation && organisation.name) {
    return `${organisation.name} | FAIRsharing`;
  }
  return "Organisations | FAIRsharing";
}
