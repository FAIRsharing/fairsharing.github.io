/*  import base */
import Vue from "vue";
import App from "./App.vue";
import VueMeta from "vue-meta";

/* import router & store */
import router from './router'
import store from './store'

/* import HTML BoilerPlates */
import "./styles/css/normalize.css"
import "./styles/css/main.css"

/* import external libraries */
import "bootstrap/scss/bootstrap.scss";


Vue.config.productionTip = false;
Vue.use(VueMeta, {
    refreshOnceOnNavigation: true
});

/* Trigger the query to get aggregation filters and add them to the searchFilters store once before launching
the application.
This should be moved to Records.vue. It will be more optimized and prevent to load the filters before the first search is
ran. Maybe we could even use a local storage to store the value of the filters with a short life span (few hours?) */
store.dispatch("fetchFilters").then(function(){
    new Vue({
        render: (h) => h(App),
        router,
        store
    }).$mount("#app");
});


