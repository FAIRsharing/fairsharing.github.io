<template>
  <div
    id="app"
    data-app
  >
    <navbar-top />
    <router-view />
    <footer-bar />
  </div>
</template>

<script>
  import NavbarTop from './components/Navigation/NavbarTop'
  import FooterBar from './components/Navigation/Footer'

  // @vuese
  // Entry point of the app; handles the route-view and the main display
  export default {
    name: 'App',
    title: 'Home',
    components: {
      NavbarTop,
      FooterBar
    }

  }
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
