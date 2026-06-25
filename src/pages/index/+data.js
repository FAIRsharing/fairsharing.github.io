import { h } from "vue";
import { useConfig } from "vike-vue/useConfig";
import RestClient from "@/lib/Client/RESTClient.js";

const restClient = new RestClient();

export async function data() {
  const vikeConfig = useConfig();

  const jsonld = await restClient.getHomepageJsonld();

  if (jsonld && Object.keys(jsonld).length) {
    vikeConfig({
      Head: h("script", {
        type: "application/ld+json",
        innerHTML: JSON.stringify(jsonld).replace(/</g, "\\u003c"),
      }),
    });
  }

  return {
    JSONLD: jsonld || null,
  };
}
