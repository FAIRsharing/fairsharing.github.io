import vikeVue from "vike-vue/config";
import Layout from "./+Layout.vue";
// import vuetify from "@manderley/vike-vue-vuetify/config";

export default {
  extends: [vikeVue],
  Layout,
  ssr: true,
  prerender: {
    partial: true,
    parallel: false, // Disables multi-threaded race conditions
    keepDistServer: true, // Prevents Vike from deleting dist/server/ mid-build
  },
  hooksTimeout: false,
  favicon: "/assets/favicon.ico",
  title: "FAIRsharing",
  viewport:
    "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no",
};
