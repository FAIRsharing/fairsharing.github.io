<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-list-item-avatar
    style="height:auto !important"
  >
    <v-menu
      offset-y
      transition="scale-transition"
      origin="top center 0"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          dark
          icon
          v-on="on"
        >
          <v-icon>
            fa-bars
          </v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(item, index) in menuItems"
          :key="index"
          @click="item.action()"
        >
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-list-item-avatar>
</template>

<script>
    import { mapActions } from "vuex"
    import routerUtils from "@/utils/routerUtils";

    export default {
        name: "UserProfileMenu",
      mixins: [routerUtils],
      data: () => {
            return {
                dialog: false
            }
        },
        computed: {
            menuItems: function(){
                const _module = this;
                return [
                    {
                        name: "Edit profile",
                        action: function(){
                          _module.goto({Path: "/profiles/edit"});
                        }
                    },
                    {
                        name: "Reset Password",
                        action: async function(){
                          _module.goto({Path: "/users/password/edit"});
                        }
                    },
                    {
                        name: "Logout",
                        action: async function(){
                            await _module.logoutUser()
                        }
                    }
                ]
            }
        },
        methods: {
            ...mapActions('users', ['logout']),
            logoutUser: async function(){
                await this.logout();
                this.goto({Name: "Login"});
            },
        }
    }
</script>

<style scoped>

</style>
