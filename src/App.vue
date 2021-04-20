<template>
  <v-app id="app">
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
    <router-view class="min-height-70vh" />
    <Footer />
  </v-app>
</template>

<script>
    import Header from "@/components/Navigation/Header";
    import {mapState} from 'vuex';
    import Footer from "@/components/Navigation/Footer";
    import NavigationDrawer from "@/components/Navigation/NavigationDrawer";

    export default {
        name: "App2",
        components: {NavigationDrawer, Footer, Header},
        computed: {
            ...mapState('uiController', ["UIGeneralStatus"]),
            ...mapState('introspection', ["readOnlyMode"])
        },
        created() {
          window.addEventListener('beforeinstallprompt', () => {});
      },
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
