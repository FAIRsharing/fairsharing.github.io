<template>
  <v-app id="app">
    <!--    <div-->
    <!--      v-if="loading"-->
    <!--      style="height:100vh; color: white"-->
    <!--    >-->
    <!--      loading-hidden-->
    <!--    </div>-->
    <v-navigation-drawer
      v-if="$vuetify.display.mdAndDown"
      v-model="UIGeneralStatus.drawerVisibilityState"
      location="left"
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
    <router-view class="min-height-70vh" />
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

export default {
  name: "App2",
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
      // loading:true,
      subtitle: null,
    };
  },
  computed: {
    ...mapState("uiController", ["UIGeneralStatus"]),
    ...mapState("introspection", ["readOnlyMode"]),
  },
  /* v8 ignore start*/
  async updated() {
    // very important line of code which prevents layout shifting which is considered as one negative point for SEO
    await this.$nextTick();
    // this.loading = false;
  },
  /* v8 ignore stop*/
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
