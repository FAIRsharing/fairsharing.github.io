import organisations from "@/lib/Prerender/organisations.generated.json";

export async function data(pageContext) {
  const orgId = pageContext.routeParams["id"];
  if (!orgId) {
    return { organisation: null };
  }
  const organisation = organisations.find(
    (o) => String(o.id) === String(orgId),
  );
  return {
    organisation: organisation || null,
  };
}
