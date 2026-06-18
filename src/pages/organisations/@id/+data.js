import organisations from "@/lib/Prerender/organisations.generated.json";
import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };

export async function data(pageContext) {
  if (buildContext.skipFull) {
    return { organisation: null };
  }
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
