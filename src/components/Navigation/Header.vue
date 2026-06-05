<template>
  <v-app-bar id="mainHeader" class="header-container">
    <v-app-bar-nav-icon
      class="d-block d-lg-none"
      @click.stop="toggleDrawerLeft"
    />

    <div class="navFirst d-flex">
      <router-link
        :active-class="isMounted ? 'router-link-active' : ''"
        :exact-active-class="isMounted ? 'router-link-exact-active' : ''"
        to="/"
      >
        <img alt="FAIRsharing logo" src="/assets/fairsharing-logo.svg" />
      </router-link>
      <div class="d-flex justify-start align-center custom-width">
        <string-search
          class="d-none d-sm-block header-search-width"
          placeholder="Search through all content"
        />
        <nav class="d-none d-lg-flex">
          <ul class="d-flex flex-row align-center flex-wrap px-0">
            <template v-if="isMounted">
              <v-menu
                v-if="!user().isLoggedIn"
                :close-on-content-click="closeMenuStatus"
                class="mt-5"
                max-height="90vh"
                transition="slide-y-transition"
              >
                <template #activator="{ props }">
                  <v-btn
                    :size="xl ? 'x-large' : undefined"
                    class="responsive-btn mr-1 mt-sm-1 bg-accent3"
                    elevation="3"
                    v-bind="props"
                    @click="closePopup(false)"
                  >
                    Login
                    <v-icon class="ml-1" size="small">
                      fas fa-sign-in-alt</v-icon
                    >
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
                  :size="xl ? 'x-large' : undefined"
                  class="responsive-btn mr-1 mt-sm-1 bg-green"
                  elevation="2"
                  to="/accounts/profile"
                >
                  <v-icon class="mr-1" color="white">
                    fas fa-user-circle</v-icon
                  >
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
            </template>

            <template v-else>
              <v-btn class="responsive-btn mr-1 mt-sm-1" disabled elevation="3">
                Login
                <v-icon class="ml-1" size="small"> fas fa-sign-in-alt</v-icon>
              </v-btn>
            </template>
          </ul>
        </nav>
      </div>
    </div>

    <div
      v-if="isMounted"
      class="navSecond d-none d-lg-flex justify-space-around align-center full-width"
    >
      <nav class="full-width">
        <ul class="d-flex flex-row align-center px-0 justify-space-around">
          <li
            v-for="(item, itemIndex) in links"
            :key="'navBarTopMenuItem_' + itemIndex"
          >
            <v-btn
              :color="item.color"
              :size="xl ? 'x-large' : undefined"
              :to="item.link"
              :variant="!item.active ? 'outlined' : 'elevated'"
              class="mr-1 mt-sm-1 menuLinks responsive-btn"
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
import {isEmpty} from "lodash-es";
import {mapActions, mapState} from "vuex";
import {useDisplay} from "vuetify";

import StringSearch from "@/components/Records/Search/Input/StringSearch";
import Login from "@/views/Users/Login/Login";

export default {
  name: "HeaderComp",
  components: { StringSearch, Login },
  setup() {
    const { xl } = useDisplay();
    return { xl };
  },
  data: function () {
    return {
      isMounted: false,
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
      return !isEmpty(currentQuery)
        ? currentQuery
        : { fairsharingRegistry: this.$route.name };
    },
  },
  watch: {
    currentParameter: {
      handler(newVal) {
        this.setCurrentActiveButton(newVal.fairsharingRegistry);
      },
      deep: true,
    },
  },
  mounted() {
    this.isMounted = true;
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
  background-color: #f5f5f5 !important;
  height: 150px !important;
  max-height: 150px !important;

  :deep(.v-toolbar__content) {
    flex-direction: column;
    align-items: stretch;
    padding: 4px 16px;
    height: 150px !important;
  }

  @media (max-width: 1279px) {
    height: 100px !important;
    max-height: 100px !important;

    :deep(.v-toolbar__content) {
      height: 100px !important;
      flex-direction: row;
      align-items: center;
    }
  }

  @media (min-width: 1920px) {
    height: 170px !important;
    max-height: 170px !important;

    :deep(.v-toolbar__content) {
      height: 170px !important;
    }

    :deep(.menuLinks) {
      min-width: 260px !important;
    }
  }
}

.responsive-btn {
  @media (max-width: 1279px) {
    height: 32px !important;
    font-size: 0.75rem !important;
  }
}

.navFirst {
  @media (max-width: 1279px) {
    width: 100% !important;
  }
}

.menuLinks {
  @media (max-width: 1279px) {
    padding-left: 8px !important;
    padding-right: 8px !important;
  }
}

.header-search-width {
  flex-grow: 1 !important;

  @media (min-width: 1920px) {
    flex-grow: 0 !important;
    width: 100% !important;
  }
}
</style>
