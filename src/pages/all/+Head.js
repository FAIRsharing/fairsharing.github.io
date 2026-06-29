import { h } from "vue";
import { useData } from "vike-vue/useData";

export default function Head() {
  const data = useData();

  if (!data.record) return null;

  const schemaOrg = data.schemaOrg
    ? {
      ...data.schemaOrg,
      url: data.canonicalUrl,
      identifier: [data.record.doi || null].filter(Boolean),
      name: data.record.name,
      description: data.record.description || "",
    }
    : null;

  return [
    data.seoTitle ? h("title", null, data.seoTitle) : null,
    data.seoDescription
      ? h("meta", { name: "description", content: data.seoDescription })
      : null,
    data.canonicalUrl
      ? h("link", { rel: "canonical", href: data.canonicalUrl })
      : null,
    data.canonicalUrl
      ? h("meta", { property: "og:url", content: data.canonicalUrl })
      : null,
    data.seoTitle
      ? h("meta", { property: "og:title", content: data.seoTitle })
      : null,
    data.seoDescription
      ? h("meta", { property: "og:description", content: data.seoDescription })
      : null,
    schemaOrg
      ? h("script", {
        type: "application/ld+json",
        innerHTML: JSON.stringify(schemaOrg).replace(/</g, "\\u003c"),
      })
      : null,
  ].filter(Boolean);
}
