<template>
  <div
    class="py-10 px-5 d-flex flex-column"
    style="height:100%"
  >
    <div
      v-for="(button, index) in buttons"
      :key="'button_' + index"
      class="mb-2"
    >
      <v-btn
        width="100%"
        color="primary"
        :outlined="!button.active"
        @click="goTo(button)"
      >
        <span :class="['white--text',{'primary--text':!button.active}]">{{ button.name }}</span>
      </v-btn>
    </div>
    <div style="flex-grow: 1">
      <v-btn
        v-if="!user().isLoggedIn"
        color="accent3 white--text"
        class="mr-1 mt-10"
        dark
        width="100%"
        @click="goToLogin()"
      >
        Login
        <v-icon
          class="ml-1"
          small
        >
          fa fa-sign-in-alt
        </v-icon>
      </v-btn>
      <v-btn
        v-else
        class="mr-1 mt-10 accent3 pl-2"
        to="/accounts/profile"
        width="100%"
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
    </div>
    <div>
      <router-link to="/">
        <v-img
          src="assets/fairsharing-logo.svg"
          height="70"
          contain
        />
      </router-link>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
        name: "NavigationDrawer",
        data(){
            return {
                buttons: [
                    {
                        name: "Standards",
                        query: {"fairsharingRegistry": "Standard"},
                        path: "search",
                        active: false
                    },
                    {
                        name: "Databases",
                        query: {"fairsharingRegistry": "Database"},
                        path: "search",
                        active: false
                    },
                    {
                        name: "Policies",
                        query: {"fairsharingRegistry": "Policy"},
                        path: "search",
                        active: false
                    },
                    {
                        name: "Collections",
                        query: {"fairsharingRegistry": "Collection"},
                        path: "search",
                        active: false
                    },
                    {
                        name: "Add content",
                        path: "new",
                        query: undefined,
                        active: false
                    },
                    {
                        name: "Stats",
                        path: "summary-statistics",
                        query: undefined,
                        active: false
                    }
                ]
            }
        },
        computed: {
            ...mapState('users', ["user"]),
            route(){
                return {
                    path: this.$route.path,
                    query: this.$route.query
                }
            }
        },
        watch: {
            route: {
                deep: true,
                handler(val){
                    this.makeActiveButton(val)
                }
            }
        },
        mounted(){
            this.makeActiveButton(this.$route)
        },
        methods: {
            async goTo(button){
                if (this.route.path.replace("/", "") !== button.path
                    || this.route.query['fairsharingRegistry'] !== button.query['fairsharingRegistry'])
                {
                    this.buttons.forEach(button => {
                        button.active = false
                    });
                    button.active = true;
                    await this.$router.push({
                        path: "/" + button.path,
                        query: button.query
                    })
                }
            },
            async goToLogin(){
              if (this.$route.path !== '/accounts/login') {
                await this.$router.push({
                  path: "/accounts/login",
                  query: {
                    goTo: this.$route.fullPath
                  }
                })
              }
            },
            makeActiveButton(val){
                this.buttons.forEach(button => {
                    button.active =
                        button.path === val.path.replace("/", "")
                        && button.query['fairsharingRegistry'] === val.query['fairsharingRegistry'];
                });
            },
        }
    }
</script>

<style scoped>

</style>
