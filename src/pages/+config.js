import vikeVue from "vike-vue/config";
import Layout from "./+Layout.vue";

export default {
  extends: [vikeVue],
  Layout,
  ssr: true,
  // prerender: {
  //   async partial() {
  //     return ["/", "/standards", "/databases", "/policies"];
  //   },
  // },
};
