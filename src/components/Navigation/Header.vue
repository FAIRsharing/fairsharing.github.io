<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app-bar
    :hide-on-scroll="UIGeneralStatus.headerVisibilityState"
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
        contain
      />
    </router-link>
    <div
      class="d-flex justify-end align-center custom-width"
    >
      <string-search :class="$vuetify.breakpoint.lgAndDown?'flex-grow-1':'flex-grow-custom'" />
      <nav>
        <ul
          v-if="!$vuetify.breakpoint.md && !$vuetify.breakpoint.sm"
          class="d-flex flex-row align-center flex-wrap px-0"
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
                @click="closePopup(false)"
              >
                Login
              </v-btn>
            </template>
            <Login
              :redirect="false"
              :pop-up="true"
              @ClosePopup="closePopup"
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
    </div>
  </v-app-bar>
</template>

<script>
import {mapState} from 'vuex'
import Login from "@/views/Users/Login/Login";
import StringSearch from "@/components/Records/Search/Input/StringSearch";

export default {
  name: "Header",
  components: {StringSearch, Login},
  data() {
    return {
      closeMenuStatus: false,
      drawerLeft: false,
      links: [
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
          label: "Add content",
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
    ...mapState('uiController', ["UIGeneralStatus"]),
    ...mapState('users', ["user"])
  },
  methods: {
    toggleDrawerLeft: function () {
      this.drawerLeft = !this.UIGeneralStatus.drawerVisibilityState;
      this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
        headerVisibilityState: true,
        drawerVisibilityState: this.drawerLeft
      });
    },
    closePopup: function (status) {
      this.closeMenuStatus = status;
    }
  },
}

</script>

<style scoped lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity .8s;
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

.flex-grow-custom {
  width: 30%;
}

.custom-width {
  width: 94%;
}
</style>






