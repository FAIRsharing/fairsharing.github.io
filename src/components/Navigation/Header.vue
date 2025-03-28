<template>
  <v-app-bar
    id="mainHeader"
    height="150px"
    class="header-container"
    :class="[{'largeScreen': $vuetify.display.xl}, {'smallScreen': $vuetify.display.mdAndDown}]"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.display.mdAndDown"
      @click.stop="toggleDrawerLeft"
    />
    <!-- First Level Menu -->
    <div
      class="navFirst d-flex"
      :class="{'full-width': $vuetify.display.mdAndDown}"
    >
      <router-link to="/">
        <img
          src="/assets/fairsharing-logo.svg"
          alt="FAIRsharing logo"
        >
      </router-link>
      <div
        class="d-flex justify-start align-center custom-width"
      >
        <string-search
          v-if="$vuetify.display.sm || $vuetify.display.mdAndUp"
          placeholder="search through all content"
          :class="$vuetify.display.lgAndDown?'flex-grow-1':'full-width'"
        />
        <nav>
          <ul
            v-if="$vuetify.display.lgAndUp"
            class="d-flex flex-row align-center flex-wrap px-0"
          >
            <!-- LOGIN -->
            <v-menu
              v-if="!user().isLoggedIn"
              transition="slide-y-transition"
              :close-on-content-click="closeMenuStatus"
              class="mt-5"
              max-height="90vh"
            >
              <template #activator="{ props }">
                <v-btn
                  :size="$vuetify.display.xl ? 'x-large' : $vuetify.display.mdAndDown ? 'small' : undefined"
                  class="mr-1 mt-sm-1 bg-accent3"
                  v-bind="props"
                  elevation="3"
                  @click="closePopup(false)"
                >
                  Login
                  <v-icon
                    class="ml-1"
                    size="small"
                  >
                    fa fa-sign-in-alt
                  </v-icon>
                </v-btn>
              </template>
              <Login
                :redirect="false"
                :pop-up="true"
                @close-popup="closePopup"
              />
            </v-menu>
            <v-btn
              v-else
              :size="$vuetify.display.xl ? 'x-large' : $vuetify.display.mdAndDown ? 'small' : undefined"
              class="mr-1 mt-sm-1 bg-green"
              to="/accounts/profile"
            >
              <v-avatar>
                <v-icon
                  color="white"
                >
                  fa-user-circle
                </v-icon>
              </v-avatar>
              <span class="text-white ellipse-150">{{ user().credentials.username }}</span>
            </v-btn>
          </ul>
        </nav>
      </div>
    </div>
    <!-- Second Level Menu -->
    <div
      v-if="$vuetify.display.lgAndUp"
      class="navSecond d-flex justify-space-around align-center full-width"
    >
      <nav class="full-width">
        <ul
          v-if="$vuetify.display.lgAndUp"
          class="d-flex flex-row align-center px-0 justify-space-around"
        >
          <li
            v-for="(item, itemIndex) in links"
            :key="'navBarTopMenuItem_' + itemIndex"
          >
            <v-btn
                :size="$vuetify.display.xl ? 'x-large' : $vuetify.display.mdAndDown ? 'small' : undefined"
              class="mr-1 mt-sm-1 menuLinks"
              :class="{'px-2': $vuetify.display.lgAndDown}"
              :color="item.color"
              :variant="!item.active ? 'outlined' : undefined"
              :to="item.link"
              width="100%"
              min-width="167px"
              max-width="184px"
            >
              <span :class="['text-white',{'text-primary': !item.active}, {'text-accent3': item.primary && !item.active}]">{{ item.label }}</span>
            </v-btn>
          </li>
        </ul>
      </nav>
    </div>
  </v-app-bar>
</template>

<script>
import {isEmpty} from "lodash";
import {mapState} from 'vuex'

import StringSearch from "@/components/Records/Search/Input/StringSearch";
import Login from "@/views/Users/Login/Login";

export default {
  name: "HeaderComp",
  components: {StringSearch, Login},
  data: function () {
    return {
      closeMenuStatus: false,
      drawerLeft: false,
      links: [
        {
          label: "Standards",
          name: "Standard",
          link: "/standards",
          color: "accent3",
          active: false,
          primary: true
        },
        {
          label: "Databases",
          name: "Database",
          link: "/databases",
          color: "accent3",
          active: false,
          primary: true
        },
        {
          label: "Policies",
          name: "Policy",
          link: "/policies",
          color: "accent3",
          active: false,
          primary: true
        },
        {
          label: "Collections",
          name: "Collection",
          link: "/collections",
          color: "primary",
          active: false,
          primary: false
        },
        {
          label: "Organisations",
          name: "Organisations",
          link: "/organisations",
          color: "primary",
          active: false,
          primary: false
        },
        {
          label: "Add content",
          name: "New",
          link: "/new",
          color: "primary",
          active: false,
          primary: false
        },
        {
          label: "Stats",
          name: "Statistics",
          link: "/summary-statistics",
          color: "primary",
          active: false,
          primary: false
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

.custom-width {
  width: 94%;
}


.header-container {
  border-bottom: 3px dashed #253442;
  position: relative !important;
  height:150px;
  max-height: 150px;
}


.header-container:deep(.v-toolbar__content) {
  flex-direction: column;
  align-items: stretch;
  padding: 4px 16px
}

.smallScreen {
  height: 100px !important;
  max-height: 100px !important;
}

.smallScreen:deep(.v-toolbar__content) {
  height: 100px !important;
  flex-direction: row;
  align-items: center;
}

.largeScreen {
  height: 170px !important;
  max-height: 170px !important;
}

.largeScreen:deep(.menuLinks) {
  min-width: 260px !important
}

</style>