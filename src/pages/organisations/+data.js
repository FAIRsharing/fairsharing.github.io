import organisations from "@/lib/Prerender/organisations.generated.json";
import buildContext from "@/lib/Prerender/build-context.json" with { type: "json" };

export async function data() {
  if (buildContext.skipFull) {
    return { organisation: null };
  }
  return { organisations };
}
