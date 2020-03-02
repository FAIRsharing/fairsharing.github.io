<template>
  <v-app>
    <template>
      <div id="app">
        <navbar-top />
        <router-view />
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
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-height:99vh;
  }
</style>
