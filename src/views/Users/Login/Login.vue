<template>
  <v-layout
    id="loginPage"
    class="login"
    style="background: white"
  >
    <v-container>
      <!-- forms -->
      <v-row justify="center">
        <v-col
          cols="12"
          sm="12"
          :md="!popUp ? '8' : '12' "
          :lg="!popUp ? '8' : '12' "
          :xl="!popUp ? '5' : '12' "
        >
          <v-card :flat="popUp">
            <v-card-title :class="{'blue white--text mb-5': !popUp, 'py-0 mb-5': popUp}">
              <h2 class="ma-0">
                {{ currentPanel | capitalize }}
              </h2>
            </v-card-title>

            <v-card-text>
              <!-- message handler -->
              <MessageHandler field="login" />

              <!-- button to re-send confirmation if login failed -->
              <div
                v-if="resendButton"
                class="d-flex flex-row justify-center"
              >
                <v-btn
                  class="text-center teal white--text px-2"
                  href="#/users/resendConfirmation"
                  @click="()=>{this.$emit('ClosePopup', true)}"
                >
                  Resend me the confirmation email
                </v-btn>
              </div>
              <v-divider
                v-if="resendButton"
                class="pb-0 mb-0"
              />

              <!-- OAUTH -->
              <v-list>
                <v-list-item
                  v-for="(provider, providerIndex) in oauthLogin"
                  :key="'provider_' + providerIndex"
                  style="justify-content: center"
                >
                  <v-btn
                    width="250px"
                    :class="provider.color"
                    class="text-left"
                    :href="provider.callback + returnTo()"
                  >
                    <v-layout width="100%">
                      <v-icon
                        left
                        class="mr-5"
                      >
                        {{ 'fab fa-' + provider.name.toLowerCase() }}
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
                ref="loginForm"
                v-model="formValid"
              >
                <!-- account -->
                <v-text-field
                  v-model="loginData.name"
                  label="Username or email"
                  required
                  outlined
                  :rules="[rules.isRequired()]"
                />

                <!-- password -->
                <v-text-field
                  v-model="loginData.password"
                  :append-icon="show1 ? 'fa-eye' : 'fa-eye-slash'"
                  :type="show1 ? 'text' : 'password'"
                  label="Password"
                  counter
                  required
                  outlined
                  :rules="[rules.isRequired()]"
                  @click:append="show1 = !show1"
                />

                <v-card-text class="text-center py-1">
                  <router-link to="/accounts/forgotPassword">
                    <span @click="()=>{this.$emit('ClosePopup', true)}">Forgot your password ?</span>
                  </router-link>
                  <v-divider />
                  <router-link to="/accounts/signup">
                    <span @click="()=>{this.$emit('ClosePopup', true)}">Create a new account</span>
                  </router-link>
                </v-card-text>

                <v-card-actions class="mt-2 justify-center">
                  <v-btn
                    class=" px-4"
                    light
                    color="primary"
                    :disabled="!formValid"
                    @click="logUser()"
                  >
                    LOGIN
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
import {mapActions, mapState} from 'vuex'
import MessageHandler from "@/components/Users/MessageHandler";
import stringUtils from '@/utils/stringUtils';
import { isRequired } from "@/utils/rules.js"

/** This component handles the login page
 *
 */
export default {
  name: "Login",
  components: {MessageHandler},
  mixins: [stringUtils],
  props: {
    redirect: {
      type: Boolean,
      default: true,
    },
    popUp: {
      type: Boolean,
      default: false,
    },
  },
  data: () => {
    return {
      show1: false,
      resendButton: false,
      currentPanel: "login",
      loginData: {},
      oauthLogin: [
        {
          name: "ORCID",
          color: "green white--text",
          callback: process.env.VUE_APP_API_ENDPOINT + "/users/auth/orcid",
        },
        {
          name: "Twitter",
          color: "blue white--text",
          callback: process.env.VUE_APP_API_ENDPOINT + "/users/auth/twitter",
        },
        {
          name: "GitHub",
          color: "black white--text",
          callback: process.env.VUE_APP_API_ENDPOINT + "/users/auth/github",
        }
      ],
      rules: {
        isRequired: function(){return isRequired()},
      },
      formValid: false
    }
  },
  computed: {
    ...mapState("users", ["messages", "user"]),
  },
  methods: {
    ...mapActions('users', ['login', 'logout']),
    logUser: async function () {
      const _module = this;
      const user = {
        "name": _module.loginData.name,
        "password": _module.loginData.password
      };
      _module.$emit('ClosePopup',false);
      await _module.login(user);

      if (_module.messages().login.error) {
        const confirmationError = "You have to confirm your email address before continuing.";
        if (_module.messages().login.message === confirmationError) {
          _module.resendButton = true;
        }
      }

      else {
        const goTo = _module.$route.query.goTo;
        if (_module.redirect) {
          if (goTo) {
            _module.$router.push({
              path: goTo
            })
          }
          else {
            _module.$router.push({
              path: "/accounts/profile"
            })
          }
        }
      }
    },
    returnTo: function() {
      const _module = this;
      const goTo = _module.$route.query.goTo;
      if (goTo) {
        return `?return_to=${goTo}`;
      }
      return '';
    }
  }
}
</script>

<style scoped>
#loginPage a {
  text-decoration: none !important;
}

.v-card__text
{
  width: auto;
}

</style>
