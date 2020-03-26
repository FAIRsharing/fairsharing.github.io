<template>
  <div
    id="loginPage"
    class="login"
  >
    <v-container fluid>
      <!-- forms -->
      <v-row>
        <v-col
          cols="12"
          sm="12"
        >
          <v-card
            outline
          >
            <!-- card title -->
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline">
                  {{ currentPanel | capitalize }} form:
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-card-text>
              <MessageHandler field="login" />
            </v-card-text>

            <!-- card content // Form -->
            <v-card-text v-if="currentPanel === 'login'">
              <v-form
                id="loginForm"
              >
                <!-- account -->
                <v-text-field
                  v-model="loginData.name"
                  label="Username or email"
                  required
                />

                <!-- password -->
                <v-text-field
                  v-model="loginData.password"
                  :append-icon="show1 ? 'fa-eye' : 'fa-eye-slash'"
                  :type="show1 ? 'text' : 'password'"
                  label="Password"
                  counter
                  required
                  @click:append="show1 = !show1"
                />

                <v-card-text class="text-left">
                  <router-link to="/accounts/forgotPassword">
                    Forgot your password ?
                  </router-link>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    type="submit"
                    value="submit"
                    @click="logUser()"
                  >
                    LOGIN
                  </v-btn>
                </v-card-actions>
              </v-form>

              <v-btn
                href="#/accounts/signup"
              >
                Register
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-layout />
  </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex'
    import MessageHandler from "../../components/Users/MessageHandler";
    /** This component handles the login page
     *
     */
    export default {
        name: "Login",
        components: {MessageHandler},
        filters: {
              capitalize: function(value){
                  return value.charAt(0).toUpperCase() + value.slice(1)
              }
          },
        data: () => {
            return {
                show1: false,
                currentPanel: "login",
                loginData: {}
            }
        },
        computed: {
            ...mapState("users", ["messages", "user"]),
            loggedIn: function() {
                return this.$store.state.users.user().isLoggedIn
            },
            currentUser: function(){
                return {
                    name: this.$store.state.users.currentUserID,
                    token: this.$store.state.users.currentUserToken
                }
            }
        },
        methods: {
            ...mapActions('users', ['login', 'logout']),
            logUser: async function(){
                const user = {
                    "name": this.loginData.name,
                    "password":  this.loginData.password
                };
                await this.login(user);
                if (!this.messages().login.error) {
                  this.$router.push({path: "/accounts/profile"})
                }
            }
        }
    }
</script>

<style scoped>
</style>
