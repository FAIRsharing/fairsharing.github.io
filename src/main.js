/*  import base */
import "vue-code-highlight/themes/prism-twilight.css";
import "vue-code-highlight/themes/window.css";
import "core-js/stable";
import "regenerator-runtime/runtime";
// import Highcharts from "highcharts";
// import options3D from "highcharts/highcharts-3d";
// import More from "highcharts/highcharts-more";
// import Drilldown from "highcharts/modules/drilldown";
// import Export from "highcharts/modules/exporting";
// import Networkgraph from "highcharts/modules/networkgraph";
// import Sunburst from "highcharts/modules/sunburst";
// import Variablepie from "highcharts/modules/variable-pie";
import HighchartsVue from "highcharts-vue";
import SimpleAnalytics from "simple-analytics-vue";
import Clipboard from "vue3-clipboard";
import VueCodeHighlight from "vue-code-highlight";
import VueGtag from "vue-gtag";
/* import linkify to turn url within text into an actual url link */
import linkify from "vue-3-linkify";
import {createMetaManager} from "vue-meta";
// import VueMoment from "vue-moment";
import Vue3Sanitize from "vue-3-sanitize";
import VueScrollTo from "vue-scrollto";
import Particles from "@tsparticles/vue3";

import App from "./App.vue";
import router from "./router";
import { afterEach, beforeEach } from "./router";
import store from "./store";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "vue-json-pretty/lib/styles.css";
import { createApp } from "vue";
import createVuetify from "../src/plugins/vuetify";
import { loadFull } from "tsparticles";
import { createHead } from "@unhead/vue";

// Variablepie(Highcharts);
// More(Highcharts);
// Export(Highcharts);
// Networkgraph(Highcharts);
// Drilldown(Highcharts);
// options3D(Highcharts);
// Sunburst(Highcharts);

router.beforeEach(
  async (to, from, next) => await beforeEach(to, from, next, store),
);

router.afterEach(async (to) => await afterEach(to));

async function bootstrapApp() {
  try {
    await store.dispatch("users/login");
    await store.dispatch("introspection/fetchParameters");
    await store.dispatch("searchFilters/assembleFilters");
    await store.dispatch("messages/setMessages");
  }
  catch (error) {
    if (error.response && error.response.status === 503) {
      store.commit("introspection/setMaintenanceMode");
    }
    else {
      await router.replace("/error/500");
    }
  }
}

// configureCompat({
//   MODE: 3,
// });

const head = createHead();

const app = createApp(App)
  .use(createVuetify)
  .use(router)
  .use(store)
  .use(bootstrapApp)
  .use(Particles, {
    init: async (engine) => {
      await loadFull(engine);
    },
  })
  .use(head)
  .use(HighchartsVue)
  .use(VueScrollTo)
  .use(Clipboard)
  // .use(VueMoment)
  .use(createMetaManager())
  .use(VueCodeHighlight)
  .use(Vue3Sanitize)
  .use(VueGtag, {
    config: { id: process.env.VUE_APP_ANALYTICS_ID },
  })
  .use(SimpleAnalytics, {
    skip: process.env.NODE_ENV !== "production",
  });
app.directive("linkified", linkify)
app.mount("#app");
