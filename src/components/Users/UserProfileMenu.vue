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
          <v-list-item-title
            v-if="item.name !== 'Reset Password'"
          >
            {{ item.name }}
          </v-list-item-title>

          <!-- dialog box when resetting pwd -->
          <v-list-item-title v-else>
            <div class="text-center">
              <v-dialog
                v-model="dialog"
                transition="scale-transition"
                width="500"
              >
                <template v-slot:activator="{ on }">
                  <div
                    class="text-left"
                    v-on="on"
                    @click="item.action()"
                  >
                    {{ item.name }}
                  </div>
                </template>
                <!-- popup -->
                <v-card>
                  <v-card-title
                    class="headline grey lighten-2"
                    primary-title
                  >
                    Resetting a password:
                  </v-card-title>
                  <v-card-text v-if="userResetPwdMessage">
                    <div
                      class="alert mt-10"
                      :class="{'alert-danger': !userResetPwdMessage.success, 'alert-success': userResetPwdMessage.success, }"
                    >
                      {{ userResetPwdMessage.message }}
                    </div>
                  </v-card-text>

                  <v-divider />

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="primary"
                      text
                      @click="dialog = false"
                    >
                      Ok
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
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
            ...mapState('users', ['userResetPwdMessage']),
            menuItems: function(){
                const _module = this;
                return [
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
                            await _module.resetPwd();
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
            ...mapActions('users', ['logout', 'resetPwd']),
            logoutUser: async function(){
                await this.logout();
                this.$router.push({name: "Login"})
            },
        }
    }
</script>

<style scoped>

</style>
