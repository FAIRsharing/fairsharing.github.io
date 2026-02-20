<template>
  <v-form
    id="loginPage"
    ref="loginPage"
    v-model="formValid"
    class="login mb-9 elevation-10 rounded"
    style="background: white"
  >
    <v-container>
      <!-- forms -->
      <v-row justify="center">
        <v-col
          :lg="!popUp ? '8' : '12'"
          :md="!popUp ? '8' : '12'"
          :xl="!popUp ? '5' : '12'"
          cols="12"
          sm="12"
        >
          <v-card :flat="popUp">
            <v-card-title
              :class="{
                'bg-blue text-white mb-5 text-center': !popUp,
                'py-0 mb-5': popUp,
              }"
            >
              <h2 class="ma-0">
                {{ currentPanel }}
              </h2>
            </v-card-title>

            <v-card-text>
              <!-- message handler -->
              <MessageHandler field="login" />

              <!-- button to re-send confirmation if login failed -->
              <div v-if="resendButton" class="d-flex flex-row justify-center">
                <v-btn
                  class="text-center bg-teal text-white px-2"
                  href="/users/resendConfirmation"
                  @click="
                    () => {
                      $emit('ClosePopup', true);
                    }
                  "
                >
                  Resend me the confirmation email
                </v-btn>
              </div>
              <v-divider v-if="resendButton" class="pb-0 mb-0" opacity="0.9" />

              <!-- OAUTH -->
              <v-list
                v-if="checkEndpoint()"
                class="d-flex flex-column align-center"
              >
                <v-list-item
                  v-for="(provider, providerIndex) in oauthLogin"
                  :key="'provider_' + providerIndex"
                >
                  <v-btn
                    :class="provider.color"
                    :href="provider.callback + getCurrentLocation()"
                    class="text-left"
                    elevation="3"
                    width="250px"
                  >
                    <v-layout width="100%">
                      <v-icon class="mr-5" start>
                        {{ "fab fa-" + provider.name.toLowerCase() }}
                      </v-icon>
                      <v-layout>with {{ provider.name }}</v-layout>
                    </v-layout>
                  </v-btn>
                </v-list-item>
              </v-list>
            </v-card-text>

            <!-- card content // Form -->
            <v-card-text v-if="currentPanel === 'Login'">
              <v-form id="loginForm" ref="loginForm" v-model="formValid">
                <!-- account -->
                <v-text-field
                  v-model="loginData.name"
                  :rules="[rules.isRequired()]"
                  label="Username or email"
                  required
                  variant="outlined"
                  @keyup.enter="logUser()"
                />

                <!-- password -->
                <v-text-field
                  v-model="loginData.password"
                  :append-inner-icon="show1 ? 'fas fa-eye' : 'fas fa-eye-slash'"
                  :rules="[rules.isRequired()]"
                  :type="show1 ? 'text' : 'password'"
                  autocomplete="off"
                  counter
                  label="Password"
                  required
                  variant="outlined"
                  @click:append-inner="show1 = !show1"
                  @keyup.enter="logUser()"
                />

                <v-card-text class="text-center py-1">
                  <router-link to="/accounts/forgotPassword">
                    <span
                      @click="
                        () => {
                          $emit('ClosePopup', true);
                        }
                      "
                      >Forgotten your password?</span
                    >
                  </router-link>
                  <v-divider opacity="0.9" />
                  <router-link to="/accounts/signup">
                    <span
                      @click="
                        () => {
                          $emit('ClosePopup', true);
                        }
                      "
                      >Need to create a new account?</span
                    >
                  </router-link>
                  <v-divider opacity="0.9" />
                  <a
                    href="https://fairsharing.gitbook.io/fairsharing/#accessing-fairsharing-through-3rd-party-accounts"
                    target="_blank"
                  >
                    <span
                      @click="
                        () => {
                          $emit('ClosePopup', true);
                        }
                      "
                      >Can't login with ORCID or Github?</span
                    >
                  </a>
                </v-card-text>

                <v-card-actions class="mt-2 justify-center">
                  <v-btn
                    :disabled="!formValid"
                    class="px-4 bg-primary"
                    elevation="2"
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
  </v-form>
</template>

<script>
import { mapActions, mapState } from "vuex";

import MessageHandler from "@/components/Users/MessageHandler";
import { isRequired } from "@/utils/rules.js";
import stringUtils from "@/utils/stringUtils";

/** This component handles the login page
 *
 */
export default {
  name: "Login",
  components: { MessageHandler },
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
      currentPanel: "Login",
      loginData: {},
      oauthLogin: [
        {
          name: "ORCID",
          color: "bg-green text-white",
          callback: import.meta.env.VITE_API_ENDPOINT + "/users/auth/orcid",
        },
        // See: https://github.com/FAIRsharing/fairsharing.github.io/issues/2184
        /*
        {
          name: "Twitter",
          color: "blue text-white",
          callback: import.meta.env.VITE_API_ENDPOINT + "/users/auth/twitter",
        },
         */
        {
          name: "GitHub",
          color: "bg-black text-white",
          callback: import.meta.env.VITE_API_ENDPOINT + "/users/auth/github",
        },
      ],
      rules: {
        isRequired: function () {
          return isRequired();
        },
      },
      formValid: false,
    };
  },
  computed: {
    ...mapState("users", ["messages", "user"]),
  },
  methods: {
    ...mapActions("users", ["login", "logout"]),
    async logUser() {
      const _module = this;
      const user = {
        name: _module.loginData.name,
        password: _module.loginData.password,
      };
      _module.$emit("ClosePopup", false);
      await _module.login(user);

      if (_module.messages().login.error) {
        const confirmationError =
          "You have to confirm your email address before continuing.";
        if (_module.messages().login.message === confirmationError) {
          _module.resendButton = true;
        }
      } else {
        const goTo = _module.$route.query.goTo;
        let target = {};
        if (_module.redirect) {
          if (goTo) {
            //Added if condition as path was trimming query params in path in vue-router 4
            if (goTo.includes("?")) {
              const url = goTo.split("?");
              const queryURLArr = url[1].split("&");
              queryURLArr.forEach((pair) => {
                if (pair !== "") {
                  let splitpair = pair.split("=");
                  let key = splitpair[0];
                  target[key] = splitpair[1];

                  //For advancedSearch only
                  if (url[0] === "/advancedsearch" && pair.includes("fields")) {
                    const [key, ...rest] = pair.split("=");
                    const value = rest.join("=");
                    target[key] = decodeURIComponent(value);
                  }
                }
              });
              _module.$router.push({
                path: url[0],
                query: target,
              });
            } else {
              _module.$router.push({
                path: goTo,
              });
            }
          } else {
            _module.$router.push({
              path: "/accounts/profile",
            });
          }
        }
      }
    },
    returnTo() {
      const _module = this;
      const goTo = _module.$route.query.goTo;
      if (goTo) {
        return `?return_to=${goTo}`;
      }
      return "";
    },
    getCurrentLocation() {
      let loc = this.$router.currentRoute.path;
      let params = this.$route.query;
      let query = Object.keys(params)
        .map((k) => `${k}=${params[k]}`)
        .join("&")
        .replace("next=", "");
      let origin;
      if (params.length > 0) {
        origin = encodeURI(`${loc}`);
      } else {
        origin = encodeURI(`${loc}?${query}`);
      }
      return `?origin=${origin}`;
    },
    checkEndpoint() {
      if (
        import.meta.env.VITE_API_ENDPOINT === "https://api.fairsharing.org" ||
        import.meta.env.VITE_API_ENDPOINT === "http://127.0.0.1:3000"
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="scss" scoped>
#loginPage a {
  text-decoration: none !important;
}

.v-card__text {
  width: auto;
}
</style>
