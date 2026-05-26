import vikeVue from "vike-vue/config";
import Layout from "./+Layout.vue";

export default {
  extends: [vikeVue],
  Layout,
  ssr: true,

  favicon: "/assets/favicon.ico",
  title: "FAIRsharing",
  viewport:
    "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no",
};
