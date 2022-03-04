<template>
  <v-app id="app">
    <div
      v-if="loading"
      style="height:100vh; color: white"
    >
      loading-hidden
    </div>
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.mdAndDown"
      v-model="UIGeneralStatus.drawerVisibilityState"
      app
      left
      width="70%"
    >
      <NavigationDrawer />
    </v-navigation-drawer>
    <Header />
    <v-alert
      v-if="readOnlyMode"
      class="mt-4 mx-4"
      type="info"
    >
      The site currently only allows viewing of records and editing is disabled. We hope to restore normal service
      as soon as possible. Please accept our apologies for any inconvenience
    </v-alert>
    <Jumbotron />
    <PublicMessages />
    <router-view class="min-height-70vh" />
    <Footer />
  </v-app>
</template>

<script>
    import Jumbotron from "@/components/Navigation/Jumbotron";
    import Header from "@/components/Navigation/Header";
    import {mapState} from 'vuex';
    import Footer from "@/components/Navigation/Footer";
    import NavigationDrawer from "@/components/Navigation/NavigationDrawer";
    import PublicMessages from "@/components/Global/PublicMessages";

    export default {
        name: "App2",
        components: {PublicMessages, NavigationDrawer, Footer, Header, Jumbotron},
        data() {
          return {
            title: null,
            loading:true,
            subtitle: null
          }
        },
      computed: {
        ...mapState('uiController', ["UIGeneralStatus"]),
        ...mapState('introspection', ["readOnlyMode"]),
      },
      /* istanbul ignore next */
      async updated() {
        // very important line of code which prevents layout shifting which is considered as one negative point for SEO
        await this.$nextTick()
        this.loading = false;
      }
    }
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 99vh;
}

html, body {
  height: 100%;
}
</style>
