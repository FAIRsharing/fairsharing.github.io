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


/* import router & store */
import router from './router'
import {beforeEach} from "./router";
import store from './store'

/* import HTML BoilerPlates */
import "./styles/css/normalize.css"
import "./styles/css/main.css"

import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

// This is a global sass file, it is applied to every vue instance
/* import Global Sass */
import "./styles/main.scss"
import 'vue-json-pretty/lib/styles.css'

Variablepie(Highcharts);
More(Highcharts);
Export(Highcharts);
Networkgraph(Highcharts);

Vue.config.productionTip = false;
Vue.use(HighchartsVue);
Vue.use(VueScrollTo);
Vue.use(Clipboard);
Vue.use(VueMoment);
Vue.use(VueMeta, {refreshOnceOnNavigation: true});

router.beforeEach(async(to, from, next) => await beforeEach(to, from, next, store));

async function bootstrapApp() {
    try {
        await store.dispatch('users/login');
        await store.dispatch("introspection/fetchParameters");
        await store.dispatch("searchFilters/assembleFilters");
    }
    catch {
        store.commit("introspection/setMaintenanceMode");
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
