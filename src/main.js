/*  import base */
import Vue from "vue";
import App from "./App.vue";
import VueMeta from "vue-meta";
import vuetify from './plugins/vuetify'

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


Vue.config.productionTip = false;

Vue.use(VueMeta, {
    refreshOnceOnNavigation: true
});

router.beforeEach(async(to, from, next) => await beforeEach(to, from, next, store));

async function bootstrapApp() {
    await store.dispatch('users/login');
    await store.dispatch("introspection/fetchParameters");
    await store.dispatch("searchFilters/assembleFilters");
}

bootstrapApp().then(() => {
    new Vue({
        render: (h) => h(App),
        router,
        store,
        vuetify
    }).$mount("#app")
});





