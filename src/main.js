/*  import base */
import Vue from "vue";
import VueScrollStop from 'vue-scroll-stop';
import App from "./App.vue";
import VueMeta from "vue-meta";
import vuetify from './plugins/vuetify'
import VueScrollTo from 'vue-scrollto'

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

// This is a package for stopping propagation in scroll
Vue.use(VueScrollStop);

// This is a package for having more control over scrolling in the app
Vue.use(VueScrollTo,{
    container: "body",
    duration: 1000,
    easing: "ease",
    offset: 0,
    force: true,
    cancelable: true,
    onStart: false,
    onDone: false,
    onCancel: false,
    x: false,
    y: true
})

// using meta package to inject meta data dynamically.
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





