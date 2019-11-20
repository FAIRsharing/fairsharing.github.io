/*  import base */
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'

/* import routes */
import routes from './router/routes'


/* import external libraries */
import 'bootstrap/scss/bootstrap.scss'


Vue.use(VueRouter);
Vue.config.productionTip = false;
Vue.use(VueMeta, {
    refreshOnceOnNavigation: true
});

const router = new VueRouter({
    routes, // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
    document.title = (to.meta.title !== undefined) ? 'FAIRsharing | ' + to.meta.title : 'FAIRsharing';
    next()
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
