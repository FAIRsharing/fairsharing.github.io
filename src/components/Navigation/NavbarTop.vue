<template>
  <nav class="navbar navbar-expand-lg nav-top">
    <h2>Navbar top will be here</h2>
    <ul class="navbar-nav mr-auto">
      <li>
        <router-link to="/">
          Home
        </router-link>
      </li>
      <li>
        <router-link to="/search">
          Search
        </router-link>
      </li>
      <li>
        <router-link to="/standards">
          Standards
        </router-link>
      </li>
      <li>
        <router-link to="/databases">
          Databases
        </router-link>
      </li>
      <li>
        <router-link to="/policies">
          Policies
        </router-link>
      </li>
      <li>
        <router-link to="/collections">
          Collections
        </router-link>
      </li>
      <li>
        <router-link to="/new">
          Add/Claim
        </router-link>
      </li>
      <li>
        <router-link to="/summary-statistics">
          Stats
        </router-link>
      </li>
      <li :class="{'blue': userLoggedIn}">
        <router-link
          v-if="!userLoggedIn"
          to="/accounts/login"
        >
          Login/Register
        </router-link>
        <router-link
          v-else
          to="/accounts/profile"
          class="white--text"
        >
          Welcome, {{ currentUserID }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
  import { mapState } from 'vuex'

  /** Component to handle the header (should be present on every page)
     *
     */
    export default {
        name: "NavbarTop",
        computed: {
          ...mapState('users', ["userLoggedIn", "currentUserID"])
        }
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
</style>
