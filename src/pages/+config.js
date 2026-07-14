import vikeVue from "vike-vue/config";
import Layout from "./+Layout.vue";

export default {
  extends: [vikeVue],
  Layout,
  ssr: true,
  prerender: {
    partial: true,
    parallel: false, // Disables multi-threaded race conditions
    keepDistServer: true, // Prevents Vike from deleting dist/server/ mid-build
  },
  trailingSlash: false,
  disableUrlNormalization: true,
  hooksTimeout: false,
  favicon: "/assets/favicon.ico",
  title: "FAIRsharing",
  description:
    "A curated, informative and educational resource on data and metadata standards, databases and policies.",
  viewport:
    "width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no",
};
