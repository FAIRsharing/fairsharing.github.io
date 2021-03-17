<template>
  <v-app id="app">
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="UIGeneralStatus.drawerVisibilityState"
      app
      left
      width="70%"
    />
    <Header />
    <router-view class="min-height-70vh" />
    <Footer />
  </v-app>
</template>

<script>
    import Header from "./components/Navigation/Header";
    import {mapState} from 'vuex';
    import Footer from "./components/Navigation/Footer";

    export default {
        name: "App2",
        components: {Footer, Header},
        computed: {
            ...mapState('uiController', ["UIGeneralStatus"]),
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
