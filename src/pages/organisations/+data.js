import organisations from "@/lib/Prerender/organisations.generated.json";

export async function data() {
  return { organisations };
}
