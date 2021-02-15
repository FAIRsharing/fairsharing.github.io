<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-toolbar
    id="navigationBarTop"
    class="grey lighten-3"
    flat
    height="80px"
  >
    <v-toolbar-title>
      <router-link to="/">
        <v-img
          src="@/assets/logo.svg"
          contain
          alt="FAIRsharing"
        />
      </router-link>
    </v-toolbar-title>

    <v-spacer />

    <v-btn
      v-for="(item, itemIndex) in links"
      :key="'navBarTopMenuItem_' + itemIndex"
      class="mr-1"
      :class="item.color"
      :to="item.link"
    >
      <span class="white--text">{{ item.label }}</span>
    </v-btn>

    <!-- LOGIN -->
    <v-menu
      v-if="!user().isLoggedIn"
      offset-y
      left
      fixed
      transition="slide-y-transition"
      :close-on-content-click="false"
      class="mt-5"
    >
      <template #activator="{ on }">
        <v-btn
          color="teal darken-2 white--text"
          dark
          v-on="on"
        >
          Login
        </v-btn>
      </template>
      <v-list
        width="400px"
        dark
        color="#253442"
      >
        <v-list-item>
          <Login :redirect="false" />
        </v-list-item>
      </v-list>
    </v-menu>

    <v-btn
      v-else
      class="teal darken-2"
      to="/accounts/profile"
    >
      <span class="white--text">Welcome, {{ user().credentials.username }}</span>
    </v-btn>
  </v-toolbar>
</template>

<script>
  import { mapState } from 'vuex'
  import Login from "../../views/Users/Login/Login";

  /** Component to handle the header (should be present on every page)
     *
     */
    export default {
      name: "NavbarTop",
      components: {Login},

      data() {
        return {
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
      computed: {
        ...mapState('users', ["user"])
      },
    }
</script>

<style scoped>
  .nav-top {
      border-bottom:1px solid #ccc;
  }

  .navbar-nav {
      margin-left:auto;
  }

  li {
      margin-left: 15px;
      border:1px solid #ccc;
      border-radius:5px;
      padding:10px 20px;
  }

  a:hover {
    text-decoration: none !important;
  }

  .menuable__content__active {
    margin-top:7px !important;
  }

</style>
