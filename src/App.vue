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
    <Jumbotron
      :content="getJumbotronData()"
    />
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
    import jumbotronData from "@/data/jumbotronData.json"

    export default {
        name: "App2",
        components: {NavigationDrawer, Footer, Header, Jumbotron},
        data() {
          return {
            title: null,
            subtitle: null
          }
        },
        computed: {
            ...mapState('uiController', ["UIGeneralStatus"]),
            ...mapState('introspection', ["readOnlyMode"]),
        },
        methods: {
          getJumbotronData(){
            if (this.$route.name) {
              let route = this.$route.name;
              if (route === "search" && Object.keys(this.$route.query).includes("fairsharingRegistry")) {
                route = this.$route.query.fairsharingRegistry
              }
              if (route) route = route.toLowerCase();
              return jumbotronData[route] || null
            }
            return null
          }
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
