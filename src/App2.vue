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
    <router-view />
  </v-app>
</template>

<script>
    import Header from "./components/IndividualComponents/Header";
    import {mapState} from 'vuex';

    export default {
        components: {Header},
        data: () => ({
            hideOverflow: 'overflow-hidden'
        }),
        computed: {
            ...mapState('uiController', ["UIGeneralStatus"]),
        },
        watch: {
            UIGeneralStatus: {
                handler(UIGeneralStatus) {
                    this.toggleOverFlow(UIGeneralStatus.bodyOverflowState);
                },
                deep: true
            },
        },
        created() {
            /*
                        this.$vuetify.theme.dark = true;
                        console.log( this.$vuetify.theme);
                         console.log( this.$vuetify.icons.values);
                         console.log( this.$vuetify);
                        console.log( this.$vuetify.breakpoint);
                        console.log( this.$vuetify.breakpoint.width + ' '+this.$vuetify.breakpoint.height);
            */
        },
        methods: {
            toggleOverFlow: function (status) {
                let root = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)
                status ? root.setAttribute('class', this.hideOverflow) : root.removeAttribute('class');
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

    .footer-content {

    }

    .overflow-hidden {
        overflow: hidden !important;
    }


</style>