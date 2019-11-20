/*  import base */
import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'

/* import routes */
import routes from './router/routes'


/* import external libraries */
import 'bootstrap/scss/bootstrap.scss'


Vue.use(VueRouter);
Vue.config.productionTip = false;

const router = new VueRouter({
  routes // short for `routes: routes`
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app');
