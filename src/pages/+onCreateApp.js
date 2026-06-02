/* Directives & Plugins Imports */
import linkify from "vue-3-linkify";
import {createMetaManager} from "vue-meta";
import Vue3Sanitize from "vue-3-sanitize";
import DOMPurify from "dompurify";
import {createMyRouter} from "@/router";
import {createMyStore} from "@/store";
import createVuetify from "@/plugins/vuetify";
import {bootstrapApp, globalFilters} from "@/utils/setupUtils";
/* Styles */
import CodeBlock from "@/components/Static/APIDoc/CodeBlock.vue";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "vue-json-pretty/lib/styles.css";

export default async (pageContext) => {
  const { app } = pageContext;
  const isServer = typeof window === "undefined";

  // Create unique, isolated instances for this specific request
  const store = createMyStore();
  const router = createMyRouter(store);

  app.use(store);
  app.use(router);

  await bootstrapApp(store, router);

  // Safely sync the unique router instance to the current URL
  if (isServer) {
    router.push(pageContext.urlPathname);
  }

  // 3. Plugins that are SAFE for both Server and Client
  const vuetifyPlugin =
    typeof createVuetify === "function" ? createVuetify() : createVuetify;
  app.use(vuetifyPlugin).use(createMetaManager()).use(Vue3Sanitize);

  app.component("CodeBlock", CodeBlock);

  // Plugins that MUST ONLY run in the Browser (Client)
  if (!isServer) {
    const { default: HighchartsVue } = await import("highcharts-vue");
    const { default: Highcharts } = await import("highcharts");
    const { default: accessibilityInit } = await import(
      "highcharts/modules/accessibility"
    );
    const { default: SimpleAnalytics } = await import("simple-analytics-vue");
    // const { default: VueGtag } = await import("vue-gtag");
    const { default: VueScrollTo } = await import("vue-scrollto");
    const { default: Particles } = await import("@tsparticles/vue3");
    const { loadFull } = await import("tsparticles");

    if (typeof accessibilityInit === "function") {
      accessibilityInit(Highcharts);
    }
    app
      .use(Particles, {
        init: async (engine) => {
          await loadFull(engine);
        },
      })
      .use(HighchartsVue)
      .use(VueScrollTo)
      // .use(VueGtag, {
      //   config: { id: import.meta.env.VUE_APP_ANALYTICS_ID },
      // })
      .use(SimpleAnalytics, {
        skip: import.meta.env.VITE_NODE_ENV !== "production",
      });
  }

  // Directives
  app.directive("linkified", linkify);
  app.directive("safe-html", (el, binding) => {
    el.innerHTML = DOMPurify.sanitize(binding.value, { ADD_ATTR: ["target"] });
  });

  // Global Properties
  app.config.globalProperties.$filters = globalFilters;

  // Await the isolated router so the server waits for route components to resolve
  await router.isReady();
};
