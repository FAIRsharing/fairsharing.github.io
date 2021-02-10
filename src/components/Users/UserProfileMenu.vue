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
    import { mapActions, mapState } from "vuex"

    export default {
        name: "UserProfileMenu",
        data: () => {
            return {
                dialog: false
            }
        },
        computed: {
          ...mapState('users', ['user']),
            menuItems: function(){
                const _module = this;
                let vecReturn = [];
                let auxV = [
                    {
                        name: "Edit profile",
                        action: function(){
                            _module.$router.push({
                              path: "/profiles/edit"
                            })
                        }
                    },
                    {
                        name: "Reset Password",
                        action: async function(){
                          _module.$router.push({
                            path: "/users/password/edit"
                          })
                        }
                    },
                    {
                        name: "Logout",
                        action: async function(){
                            await _module.logoutUser()
                        }
                    }
                ];
                if (_module.user().role === 'super_curator' || _module.user().role === 'senior_curator'){
                    vecReturn.push(
                      {
                          name: "Curator Panel",
                          action: function(){
                              _module.$router.push({
                                path: "/curator"
                              })
                          }
                      }
                    );
                }
                for (let i = 0; i < auxV.length; i++) {
                  vecReturn.push(auxV[i]);
                }
                return vecReturn;
            }
        },
        methods: {
            ...mapActions('users', ['logout']),
            logoutUser: async function(){
                await this.logout();
                this.$router.push({name: "Login"})
            },
        }
    }
</script>

<style scoped>

</style>
