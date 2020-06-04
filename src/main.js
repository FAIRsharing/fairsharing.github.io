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

/* import clients */
import GraphQLClient from "./components/GraphClient/GraphClient.js"

import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@fortawesome/fontawesome-free/css/all.css'

/* import Mixin */
// This is a global mixin, it is applied to every vue instance
import {applicationMixin} from "./mixins/applicationMixin";
// This is a global sass file, it is applied to every vue instance

/* import Global Sass */
import "./styles/main.scss"


Vue.config.productionTip = false;

Vue.mixin(applicationMixin);

Vue.use(VueMeta, {
    refreshOnceOnNavigation: true
});

const graphQLClient = new GraphQLClient();
router.beforeEach((to, from, next) => beforeEach(to, from, next));

store.dispatch('users/login').then(function () {
    store.dispatch("introspection/fetchParameters").then(async function () {
        new Vue({
            mounted: async function () {
                await store.dispatch('searchFilters/fetchFilters', graphQLClient);
            },
            render: (h) => h(App),
            router,
            store,
            vuetify
        }).$mount("#app")
    });
});




