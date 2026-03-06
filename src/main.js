/*  import base */
import "vue-code-highlight/themes/prism-twilight.css";
import "vue-code-highlight/themes/window.css";
import "core-js/stable";
import "regenerator-runtime/runtime";
import HighchartsVue from "highcharts-vue";
import SimpleAnalytics from "simple-analytics-vue";
import VueCodeHighlight from "vue-code-highlight";
import VueGtag from "vue-gtag";
/* import linkify to turn url within text into an actual url link */
import linkify from "vue-3-linkify";
import { createMetaManager } from "vue-meta";
import Vue3Sanitize from "vue-3-sanitize";
import VueScrollTo from "vue-scrollto";
import Particles from "@tsparticles/vue3";

import App from "./App.vue";
import router, { afterEach, beforeEach } from "./router";
import store from "./store";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "vue-json-pretty/lib/styles.css";
import { createApp } from "vue";
import createVuetify from "../src/plugins/vuetify";
import { loadFull } from "tsparticles";
import Highcharts from "highcharts";
import accessibilityInit from "highcharts/modules/accessibility";
import { bootstrapApp, globalFilters } from "./utils/setupUtils";

router.beforeEach(
  async (to, from, next) => await beforeEach(to, from, next, store),
);

router.afterEach(async (to) => await afterEach(to));

//Implement accessibility module for Highcharts
// check if accessibilityInit is a function, if not try .default
export function initHighchartsAccessibility(
  accessibilityModule,
  highchartsInstance,
) {
  if (typeof accessibilityModule === "function") {
    accessibilityModule(highchartsInstance);
  } else if (
    accessibilityModule &&
    typeof accessibilityModule.default === "function"
  ) {
    accessibilityModule.default(highchartsInstance);
  }
}

initHighchartsAccessibility(accessibilityInit, Highcharts);

const app = createApp(App)
  .use(createVuetify)
  .use(router)
  .use(store)
  .use(Particles, {
    init: async (engine) => {
      await loadFull(engine);
    },
  })
  .use(bootstrapApp)
  .use(HighchartsVue)
  .use(VueScrollTo)
  .use(createMetaManager())
  .use(VueCodeHighlight)
  .use(Vue3Sanitize)
  .use(VueGtag, {
    config: { id: import.meta.env.VUE_APP_ANALYTICS_ID },
  })
  .use(SimpleAnalytics, {
    skip: import.meta.env.NODE_ENV !== "production",
  });
app.directive("linkified", linkify);
app.mount("#app");
app.config.globalProperties.$filters = globalFilters;
