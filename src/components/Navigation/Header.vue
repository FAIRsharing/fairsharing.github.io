<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app-bar
    short
    height="100"
    max-height="100"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.smAndDown"
      @click="toggleDrawerLeft"
    />
    <router-link to="/">
      <v-img
        src="@/assets/fairsharing-logo.svg"
        height="70"
        class="d-flex flex-grow-0"
        contain
      />
    </router-link>
    <v-spacer />
    <nav>
      <ul
        v-if="!$vuetify.breakpoint.sm && !$vuetify.breakpoint.xs"
        class="d-flex flex-row align-center flex-wrap"
      >
        <li
          v-for="(item, itemIndex) in links"
          :key="'navBarTopMenuItem_' + itemIndex"
        >
          <v-btn
            :small="$vuetify.breakpoint.mdAndDown"
            :x-large="$vuetify.breakpoint.xlOnly"
            class="mr-1 mt-sm-1"
            :class="item.color"
            :to="item.link"
          >
            <span class="white--text">{{ item.label }}</span>
          </v-btn>
        </li>
        <!-- LOGIN -->
        <v-menu
          v-if="!user().isLoggedIn"
          offset-y
          transition="slide-y-transition"
          :close-on-content-click="closeMenuStatus"
          class="mt-5"
          max-height="90vh"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              :small="$vuetify.breakpoint.mdAndDown"
              :x-large="$vuetify.breakpoint.xlOnly"
              color="teal darken-2 white--text"
              class="mr-1 mt-sm-1"
              dark
              v-on="on"
            >
              Login
            </v-btn>
          </template>
          <Login
            :redirect="false"
            :pop-up="true"
            :close-popup="closePopup"
          />
        </v-menu>
        <v-btn
          v-else
          :small="$vuetify.breakpoint.mdAndDown"
          :x-large="$vuetify.breakpoint.xlOnly"
          class="mr-1 mt-sm-1 teal darken-2"
          to="/accounts/profile"
        >
          <span class="white--text">Welcome, {{ user().credentials.username }}</span>
        </v-btn>
      </ul>
    </nav>
  </v-app-bar>
</template>

<script>
    import {mapState} from 'vuex'
    import Login from "@/views/Users/Login/Login";

    export default {
        name: "Header",
        components: {Login},
        computed: {
            ...mapState('uiController', ["UIGeneralStatus"]),
            ...mapState('users', ["user"])
        },
        data() {
            return {
                closeMenuStatus: false,
                drawerLeft: false,
                links: [
                    {
                        label: "Search",
                        link: "/search",
                        color: "blue"
                    },
                    {
                        label: "Standards",
                        link: "/standards",
                        color: "blue"
                    },
                    {
                        label: "Databases",
                        link: "/databases",
                        color: "blue"
                    },
                    {
                        label: "Policies",
                        link: "/policies",
                        color: "blue"
                    },
                    {
                        label: "Collections",
                        link: "/collections",
                        color: "blue"
                    },
                    {
                        label: "Add/Claim content",
                        link: "/new",
                        color: "grey"
                    },
                    {
                        label: "Stats",
                        link: "/summary-statistics",
                        color: "teal darken-2"
                    }
                ]
            }
        },
        methods: {
            toggleDrawerLeft: function () {
                this.drawerLeft = !this.UIGeneralStatus.drawerVisibilityState;
                this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
                    headerVisibilityState: true,
                    drawerVisibilityState: this.drawerLeft
                });
            },
            closePopup: function () {
                this.closeMenuStatus = true;
            }
        },
    }

</script>

<style scoped lang="scss">
    .fade-enter-active, .fade-leave-active {
        transition: opacity .1s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }

    ul {
        list-style: none;
    }

    header {
        padding-right: .5rem;
    }
</style>






