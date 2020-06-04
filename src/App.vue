<template>
  <v-app>
    <template>
      <div id="app">
        <navbar-top />
        <router-view class="py-5" />
        <footer-bar />
      </div>
    </template>
  </v-app>
</template>

<script>
import NavbarTop from "./components/Navigation/NavbarTop";
import FooterBar from "./components/Navigation/Footer";

export default {
  name: 'App',
  components: {
    NavbarTop,
    FooterBar
  }
};
</script>

<style>
  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 99vh;
  }
</style>
