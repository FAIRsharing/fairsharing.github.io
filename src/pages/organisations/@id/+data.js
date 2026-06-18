import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };
import { readGeneratedOrganisations } from "@/lib/Prerender/prerenderUtils.js";

export async function data(pageContext) {
  if (buildContext.skipFull) {
    return { organisation: null };
  }
  //Below file is used in full build, it is generated in full build step, so we need to import it dynamically to avoid errors in partial build
  const organisations = readGeneratedOrganisations();
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
