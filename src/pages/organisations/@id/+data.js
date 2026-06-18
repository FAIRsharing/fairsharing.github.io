import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };

export async function data(pageContext) {
  if (buildContext.skipFull) {
    return { organisation: null };
  }
  //Below file is used in full build, it is generated in full build step, so we need to import it dynamically to avoid errors in partial build
  const { default: organisations } = await import(
    "@/lib/Prerender/organisations.generated.json"
  );
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
