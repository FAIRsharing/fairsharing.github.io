<template>
  <v-app-bar
    short
    height="100"
    max-height="100"
  >
    <v-app-bar-nav-icon
      v-if="$vuetify.breakpoint.smAndDown"
      @click="toggleDrawerLeft"
    />
    <v-img
      src="@/assets/fairsharing-logo.svg"
      height="70"
      class="d-flex flex-grow-0"
      contain
    />
    <v-spacer />
    <nav>
      <ul
        v-if="!$vuetify.breakpoint.sm && !$vuetify.breakpoint.xs"
        id="nav-md-lg-screens"
      >
        <li>
          <v-btn
            v-for="(item, itemIndex) in links"
            :key="'navBarTopMenuItem_' + itemIndex"
            :small="$vuetify.breakpoint.mdAndDown"
            :x-large="$vuetify.breakpoint.xlOnly"
            class="mr-1 mt-sm-1"
            :class="item.color"
            :to="item.link"
          >
            <span class="white--text">{{ item.label }}</span>
          </v-btn>
        </li>
      </ul>
    </nav>
  </v-app-bar>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Header",
        data() {
            return {
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
            }
        },
        computed: {
            ...mapState('uiController', ["UIGeneralStatus"]),
        }
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
