<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app-bar
    id="mainHeader"
    short
    height="100"
    max-height="100"
    class="header-container"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.mdAndDown"
      @click.stop="toggleDrawerLeft"
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
      <string-search
        v-if="$vuetify.breakpoint.sm || $vuetify.breakpoint.mdAndUp"
        placeholder="search through all content"
        :class="$vuetify.breakpoint.lgAndDown?'flex-grow-1':'flex-grow-custom'"
      />
      <nav>
        <ul
          v-if="$vuetify.breakpoint.lgAndUp"
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
              color="primary"
              :outlined="!item.active"
              :to="item.link"
            >
              <span :class="['white--text',{'primary--text':!item.active}]">{{ item.label }}</span>
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
            <template #activator="{ on }">
              <v-btn
                :small="$vuetify.breakpoint.mdAndDown"
                :x-large="$vuetify.breakpoint.xlOnly"
                color="accent3 white--text"
                class="mr-1 mt-sm-1"
                dark
                v-on="on"
                @click="closePopup(false)"
              >
                Login
                <v-icon
                  class="ml-1"
                  small
                >
                  fa fa-sign-in-alt
                </v-icon>
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
            class="mr-1 mt-sm-1 accent3 pl-2"
            to="/accounts/profile"
          >
            <v-avatar>
              <v-icon
                dark
                color="white"
              >
                fa-user-circle
              </v-icon>
            </v-avatar>
            <span class="white--text ellipse-150">{{ user().credentials.username }}</span>
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
import {isEmpty} from "lodash";

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
          name: "Standard",
          link: "/standards",
          active:false
        },
        {
          label: "Databases",
          name: "Database",
          link: "/databases",
          active:false
        },
        {
          label: "Policies",
          name: "Policy",
          link: "/policies",
          active:false
        },
        {
          label: "Collections",
          name: "Collection",
          link: "/collections",
          active:false
        },
        {
          label: "Add content",
          name: "New_content",
          link: "/new",
          active:false
        },
        {
          label: "Stats",
          name: "Statistics",
          link: "/summary-statistics",
          active:false
        }
      ]
    }
  },
  computed: {
    ...mapState('uiController', ["UIGeneralStatus"]),
    ...mapState('users', ["user"]),
    currentParameter() {
      let currentQuery = this.$route.query;
      if (!isEmpty(currentQuery)) {
        return currentQuery
      }
      else {
        return {fairsharingRegistry: this.$route.name}
      }
    }
  },
  watch: {
    currentParameter: {
      handler(newVal) {
        const _module = this;
        _module.setCurrentActiveButton(newVal.fairsharingRegistry)
      },
      deep: true
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
    closePopup: function (status) {
      this.closeMenuStatus = status;
    },
    setCurrentActiveButton: function(newValue) {
      this.links.map(link => {
        link.name === newValue ? link.active = true : link.active = false;
      });
    }
  }
}

</script>

<style scoped lang="scss">
header {
  padding-right: .5rem;
}

.flex-grow-custom {
  width: 30%;
}

.custom-width {
  width: 94%;
}

.header-container {
    border-bottom: 3px dashed #253442;
}
</style>






