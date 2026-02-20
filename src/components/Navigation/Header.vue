<template>
  <v-app-bar
    id="mainHeader"
    :class="[
      { largeScreen: $vuetify.display.xl },
      { smallScreen: $vuetify.display.mdAndDown },
    ]"
    class="header-container"
    height="150px"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.display.mdAndDown"
      @click.stop="toggleDrawerLeft"
    />
    <!-- First Level Menu -->
    <div
      :class="{ 'full-width': $vuetify.display.mdAndDown }"
      class="navFirst d-flex"
    >
      <router-link to="/">
        <img alt="FAIRsharing logo" src="/assets/fairsharing-logo.svg" />
      </router-link>
      <div class="d-flex justify-start align-center custom-width">
        <string-search
          v-if="$vuetify.display.sm || $vuetify.display.mdAndUp"
          :class="$vuetify.display.lgAndDown ? 'flex-grow-1' : 'full-width'"
          placeholder="search through all content"
        />
        <nav>
          <ul
            v-if="$vuetify.display.lgAndUp"
            class="d-flex flex-row align-center flex-wrap px-0"
          >
            <!-- LOGIN -->
            <v-menu
              v-if="!user().isLoggedIn"
              :close-on-content-click="closeMenuStatus"
              class="mt-5"
              max-height="90vh"
              transition="slide-y-transition"
            >
              <template #activator="{ props }">
                <v-btn
                  :size="
                    $vuetify.display.xl
                      ? 'x-large'
                      : $vuetify.display.mdAndDown
                        ? 'small'
                        : undefined
                  "
                  class="mr-1 mt-sm-1 bg-accent3"
                  elevation="3"
                  v-bind="props"
                  @click="closePopup(false)"
                >
                  Login
                  <v-icon class="ml-1" size="small"> fas fa-sign-in-alt</v-icon>
                </v-btn>
              </template>
              <Login
                :pop-up="true"
                :redirect="false"
                @close-popup="closePopup"
              />
            </v-menu>
            <div v-else class="d-flex align-center">
              <v-btn
                :size="
                  $vuetify.display.xl
                    ? 'x-large'
                    : $vuetify.display.mdAndDown
                      ? 'small'
                      : undefined
                "
                class="mr-1 mt-sm-1 bg-green"
                elevation="2"
                to="/accounts/profile"
              >
                <v-icon class="mr-1" color="white"> fas fa-user-circle</v-icon>

                <span class="text-white ellipse-150">{{
                  user().credentials.username
                }}</span>
              </v-btn>
              <v-btn
                class="bg-red mt-1"
                height="30"
                size="x-small"
                variant="elevated"
                width="30"
              >
                <v-icon
                  color="white"
                  icon="fas fa-power-off"
                  size="20"
                  @click="logoutUser()"
                />
              </v-btn>
            </div>
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
              :class="{ 'px-2': $vuetify.display.lgAndDown }"
              :color="item.color"
              :size="
                $vuetify.display.xl
                  ? 'x-large'
                  : $vuetify.display.mdAndDown
                    ? 'small'
                    : undefined
              "
              :to="item.link"
              :variant="!item.active ? 'outlined' : 'elevated'"
              class="mr-1 mt-sm-1 menuLinks"
              max-width="184px"
              min-width="167px"
              width="100%"
            >
              <span
                :class="[
                  'text-white',
                  { 'text-primary': !item.active },
                  { 'text-accent3': item.primary && !item.active },
                ]"
                >{{ item.label }}</span
              >
            </v-btn>
          </li>
        </ul>
      </nav>
    </div>
  </v-app-bar>
</template>

<script>
import { isEmpty } from "lodash";
import { mapActions, mapState } from "vuex";

import StringSearch from "@/components/Records/Search/Input/StringSearch";
import Login from "@/views/Users/Login/Login";

export default {
  name: "HeaderComp",
  components: { StringSearch, Login },
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
          primary: true,
        },
        {
          label: "Databases",
          name: "Database",
          link: "/databases",
          color: "accent3",
          active: false,
          primary: true,
        },
        {
          label: "Policies",
          name: "Policy",
          link: "/policies",
          color: "accent3",
          active: false,
          primary: true,
        },
        {
          label: "Collections",
          name: "Collection",
          link: "/collections",
          color: "primary",
          active: false,
          primary: false,
        },
        {
          label: "Organisations",
          name: "Organisations",
          link: "/organisations",
          color: "primary",
          active: false,
          primary: false,
        },
        {
          label: "Add content",
          name: "New",
          link: "/new",
          color: "primary",
          active: false,
          primary: false,
        },
        {
          label: "Stats",
          name: "Statistics",
          link: "/summary-statistics",
          color: "primary",
          active: false,
          primary: false,
        },
      ],
    };
  },
  computed: {
    ...mapState("uiController", ["UIGeneralStatus"]),
    ...mapState("users", ["user"]),
    currentParameter() {
      let currentQuery = this.$route.query;
      if (!isEmpty(currentQuery)) {
        return currentQuery;
      } else {
        return { fairsharingRegistry: this.$route.name };
      }
    },
  },
  watch: {
    currentParameter: {
      handler(newVal) {
        const _module = this;
        _module.setCurrentActiveButton(newVal.fairsharingRegistry);
      },
      deep: true,
    },
  },
  methods: {
    ...mapActions("users", ["logout"]),
    toggleDrawerLeft: function () {
      this.drawerLeft = !this.UIGeneralStatus.drawerVisibilityState;
      this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
        headerVisibilityState: true,
        drawerVisibilityState: this.drawerLeft,
      });
    },
    closePopup: function (status) {
      this.closeMenuStatus = status;
    },
    setCurrentActiveButton: function (newValue) {
      this.links.map((link) => {
        link.name === newValue ? (link.active = true) : (link.active = false);
      });
    },

    async logoutUser() {
      await this.logout();
      await this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style lang="scss" scoped>
header {
  padding-right: 0.5rem;
}

.custom-width {
  width: 94%;
}

.header-container {
  border-bottom: 3px dashed #253442;
  position: relative !important;
  height: 150px;
  max-height: 150px;
}

.header-container:deep(.v-toolbar__content) {
  flex-direction: column;
  align-items: stretch;
  padding: 4px 16px;
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
  min-width: 260px !important;
}
</style>
