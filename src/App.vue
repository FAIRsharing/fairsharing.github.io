<template>
  <div id="app">
    <navbar-top></navbar-top>
    {{currentRoute}}
    <router-view></router-view>
    <footer-bar></footer-bar>
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
