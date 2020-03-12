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

/* import external libraries */
import "bootstrap/scss/bootstrap.scss";

/* import clients */
import GraphQLClient from "./components/GraphClient/GraphClient.js"

import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.config.productionTip = false;
Vue.use(VueMeta, {
    refreshOnceOnNavigation: true
});

const graphQLClient = new GraphQLClient();
router.beforeEach((to, from, next) => beforeEach(to, from, next));

new Vue({
    mounted: async function(){
        await store.dispatch("introspection/fetchParameters");
        await store.dispatch('searchFilters/fetchFilters', graphQLClient);
        await store.dispatch('users/login');
    },
    render: (h) => h(App),
    router,
    store,
    vuetify
}).$mount("#app");




