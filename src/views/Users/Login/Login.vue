<template>
  <v-layout
    id="loginPage"
    class="login"
    width="100%"
  >
    <v-container fluid>
      <!-- forms -->
      <v-row>
        <v-col
          cols="12"
          sm="12"
        >
          <v-card
            flat
            dark
            color="#253442"
          >
            <!-- card title -->
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="headline">
                  {{ currentPanel | capitalize }}:
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <!-- message handler -->
            <MessageHandler field="login" />

            <!-- OAUTH -->
            <v-card-text>
              <v-list color="#253442">
                <v-list-item
                  v-for="(provider, providerIndex) in oauthLogin"
                  :key="'provider_' + providerIndex"
                  style="justify-content: center"
                >
                  <v-btn
                    width="250px"
                    :class="provider.color"
                    class="text-left"
                    :href="provider.callback"
                  >
                    <v-layout width="100%">
                      <v-icon
                        left
                        class="mr-5"
                      >
                        {{ provider.icon }}
                      </v-icon>
                      <v-layout>with {{ provider.name }}</v-layout>
                    </v-layout>
                  </v-btn>
                </v-list-item>
              </v-list>
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
                  outlined
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
                  outlined
                />

                <v-card-text class="text-left">
                  <router-link to="/accounts/forgotPassword">
                    Forgot your password ?
                  </router-link>
                </v-card-text>

                <v-card-actions class="mt-3">
                  <v-btn
                    class="mr-5 px-4"
                    light
                    @click="logUser()"
                  >
                    LOGIN
                  </v-btn>
                  <v-btn
                    light
                    class="px-4"
                    href="#/accounts/signup"
                  >
                    Register
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
    import { mapActions, mapState } from 'vuex'
    import MessageHandler from "../../../components/Users/MessageHandler";
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
        props: {
          redirect: {
            type: Boolean,
            default: true,
          }
        },
        data: () => {
            return {
                show1: false,
                currentPanel: "login",
                loginData: {},
                oauthLogin: [
                  {
                    name: "ORCID",
                    icon: "fab fa-orcid",
                    color: "green white--text",
                    callback: "https://api.fairsharing.org/users/auth/orcid",
                  },
                  {
                    name: "Twitter",
                    icon: "fab fa-twitter",
                    color: "blue white--text",
                    callback: "https://api.fairsharing.org/users/auth/twitter",
                  },
                  {
                    name: "GitHub",
                    icon: "fab fa-github",
                    color: "black white--text",
                    callback: "https://api.fairsharing.org/users/auth/github",
                  }
                ]
            }
        },
        computed: {
            ...mapState("users", ["messages", "user"])
        },
        methods: {
            ...mapActions('users', ['login', 'logout']),
            logUser: async function(){
                const _module = this;
                const user = {
                    "name": _module.loginData.name,
                    "password":  _module.loginData.password
                };
                await _module.login(user);
                if (!_module.messages().login.error) {
                  const goTo = _module.$route.query.redirect;
                  if (goTo){
                    _module.$router.push({
                      path: goTo
                    })
                  }
                  else if (_module.redirect) {
                    _module.$router.go(-1);
                  }
                }
            }
        }
    }
</script>

<style>
  #loginPage a {
    text-decoration: none !important;
  }
</style>
