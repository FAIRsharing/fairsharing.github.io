import { h } from "vue";
import { useData } from "vike-vue/useData";

export default function Head() {
  const data = useData();

  if (!data.schemaOrg) return null;

  return h("script", {
    type: "application/ld+json",
    innerHTML: JSON.stringify(data.schemaOrg).replace(/</g, "\\u003c"),
  });
}
