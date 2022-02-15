/*  import base */
import Vue from "vue";
import App from "./App.vue";
import VueMeta from "vue-meta";
import vuetify from './plugins/vuetify'
import VueScrollTo from 'vue-scrollto';
import VueMoment from 'vue-moment';
import Clipboard from 'v-clipboard'
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import Networkgraph from 'highcharts/modules/networkgraph'
import Variablepie from 'highcharts/modules/variable-pie'
import More from 'highcharts/highcharts-more'
import Export from 'highcharts/modules/exporting'
import Drilldown from 'highcharts/modules/drilldown'
import options3D from 'highcharts/highcharts-3d'
import Sunburst from 'highcharts/modules/sunburst'
import VueCodeHighlight from 'vue-code-highlight';
import VueSanitize from "vue-sanitize";
import Particles from "particles.vue";
import VueGtag from "vue-gtag";
import "vue-code-highlight/themes/prism-twilight.css";
import "vue-code-highlight/themes/window.css";
import 'prism-es6/components/prism-ruby.min';
import 'prism-es6/components/prism-python.min';


/* import router & store */
import router from './router'
import {beforeEach,afterEach} from "./router";
import store from './store'

/* import linkify to turn url within text into an actual url link */
import linkify from 'vue-linkify'
Vue.directive('linkified', linkify)

import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

import 'vue-json-pretty/lib/styles.css'


Variablepie(Highcharts);
More(Highcharts);
Export(Highcharts);
Networkgraph(Highcharts);
Drilldown(Highcharts);
options3D(Highcharts);
Sunburst(Highcharts);

Vue.config.productionTip = false;
Vue.use(HighchartsVue);
Vue.use(VueScrollTo);
Vue.use(Clipboard);
Vue.use(VueMoment);
Vue.use(VueMeta, {refreshOnceOnNavigation: true});
Vue.use(VueCodeHighlight);
Vue.use(Particles);
Vue.use(VueSanitize);
Vue.use(VueGtag, {
    config: { id:  process.env.VUE_APP_ANALYTICS_ID }
});

router.beforeEach(async(to, from, next) => await beforeEach(to, from, next, store));
router.afterEach(async(to) => await afterEach(to));

async function bootstrapApp() {
    try {
        await store.dispatch('users/login');
        await store.dispatch("introspection/fetchParameters");
        await store.dispatch("searchFilters/assembleFilters");
        await store.dispatch("messages/setMessages");
    }
    catch(error) {
        if (error.response && error.response.status === 503) {
            store.commit("introspection/setMaintenanceMode");
        }
        else {
            await router.replace('/error/500')
        }
    }
}

bootstrapApp().then(() => {
    new Vue({
        render: (h) => h(App),
        router,
        store,
        vuetify
    }).$mount("#app")
});
