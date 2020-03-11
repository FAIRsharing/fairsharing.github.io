<template>
  <div
    id="loginPage"
    class="login"
  >
    <v-container fluid>
      <!-- tabulation controls -->
      <v-row>
        <v-col
          cols="12"
        >
          <v-btn class="mr-5"
            @click="currentPanel = 'login' "
          >
            Login
          </v-btn>
          <v-btn
            @click="currentPanel = 'register'"
          >
            Register
          </v-btn>
        </v-col>
      </v-row>

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

            <!-- card content // Form -->
            <v-card-text v-if="currentPanel === 'login'">
              <v-form
                v-if="loggedIn === false"
                id="loginForm"
              >
                <!-- account -->
                <v-text-field
                  v-model="loginData.name"
                  label="Username of email"
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

                <v-card-actions>
                  <v-btn
                    v-if="loggedIn === false"
                    type="submit"
                    value="submit"
                    @click="logUser()"
                  >
                    LOGIN
                  </v-btn>
                </v-card-actions>
              </v-form>

              <v-alert
                v-else
                class="align-left"
                type="success"
              >
                You are logged in.
              </v-alert>

              <v-btn
                v-if="loggedIn"
                @click="unlogUser"
              >
                Logout
              </v-btn>
            </v-card-text>

            <v-card-text v-if="currentPanel === 'register'">
              <register></register>
            </v-card-text>

          </v-card>

        </v-col>
      </v-row>
    </v-container>

    <v-layout />
  </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import Register from "../../components/Users/Register";

    /** This component handles the login page
     *
     */
    export default {
        name: "Login",
        components: {Register},
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
            loggedIn: function() {
                return this.$store.state.users.userLoggedIn
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
            /*createAccount: async function(){
                const user = {
                    username: "TeraTEST",
                    email: "domwow13@gmail.com",
                    password: "Nickeldoor92!",
                    password_confirmation: "Nickeldoor92!"
                };
                await client.createAccount(user)
            },*/
            logUser: async function(){
                const user = {
                    "name": this.loginData.name,
                    "password":  this.loginData.password
                };
                await this.login(user);
            },
            unlogUser: function(){
                this.logout();
                this.loginData = {};
            }
        }
    }
</script>

<style scoped>

</style>