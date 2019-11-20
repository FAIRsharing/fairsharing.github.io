<template>
  <div id="app">
    <navbar-top></navbar-top>
    <router-view></router-view>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
  import NavbarTop from './components/Navigation/NavbarTop'
  import FooterBar from './components/Navigation/Footer'

  export default {
    name: 'app',
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
