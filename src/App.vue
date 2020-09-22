<template>
  <v-app id="app">
    <v-navigation-drawer
      v-if="$vuetify.breakpoint.smAndDown"
      v-model="UIGeneralStatus.drawerVisibilityState"
      app
      left
      width="70%"
    />
    <transition name="fade">
      <Header v-if="UIGeneralStatus.headerVisibilityState" />
    </transition>
    <router-view style="min-height: 70vh" />
    <Footer v-if="$route.path !== '/search'" />
  </v-app>
</template>

<script>
    import Header from "./components/Navigation/Header";
    import {mapState} from 'vuex';
    import Footer from "./components/Navigation/Footer";

    export default {
        name: "App2",
        components: {Footer, Header},
        data: () => ({
            hideOverflow: 'overflow-hidden',
            root: null,
            _status: false
        }),
        computed: {
            ...mapState('uiController', ["UIGeneralStatus", "scrollStatus"]),
        },
        watch: {
            UIGeneralStatus: {
                handler(UIGeneralStatus) {
                    this.toggleOverFlow(UIGeneralStatus.bodyOverflowState);
                },
                deep: true
            },
        },
        methods: {
            toggleOverFlow: function (status) {
                this._status = status;
                this.root = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)
                this._status ? this.root.setAttribute('class', this.hideOverflow) : this.root.removeAttribute('class');
            },
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

    .overflow-hidden {
        overflow: hidden !important;
    }
</style>
