<template>
  <v-app v-if="isMounted" id="app">
    <v-navigation-drawer
      v-model="UIGeneralStatus.drawerVisibilityState"
      class="d-md-down"
      location="left"
      temporary
    >
      <NavigationDrawer />
    </v-navigation-drawer>

    <HeaderComp />
    <v-alert v-if="readOnlyMode" class="mt-4 mx-4" type="info">
      The site currently only allows viewing of records and editing is disabled.
      We hope to restore normal service as soon as possible. Please accept our
      apologies for any inconvenience
    </v-alert>

    <Jumbotron />
    <PublicMessages />

    <router-view class="min-height-70vh justify-center" />

    <FooterComp />
  </v-app>
</template>

<script>
import { mapState } from "vuex";
import PublicMessages from "@/components/Global/PublicMessages";
import FooterComp from "@/components/Navigation/Footer";
import HeaderComp from "@/components/Navigation/Header";
import Jumbotron from "@/components/Navigation/Jumbotron";
import NavigationDrawer from "@/components/Navigation/NavigationDrawer";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

export default {
  name: "App",
  components: {
    PublicMessages,
    NavigationDrawer,
    FooterComp,
    HeaderComp,
    Jumbotron,
  },
  data() {
    return {
      title: null,
      subtitle: null,
      isMounted: false,
    };
  },
  computed: {
    ...mapState("uiController", ["UIGeneralStatus"]),
    ...mapState("introspection", ["readOnlyMode"]),
  },
  /* v8 ignore start */
  async updated() {
    // very important line of code which prevents layout shifting which is considered as one negative point for SEO
    await this.$nextTick();
  },
  /* v8 ignore stop */
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 99vh;
}

html,
body {
  height: 100%;
}
</style>
