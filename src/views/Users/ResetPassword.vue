<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="12" md="8" lg="8" xl="4">
        <v-card>
          <v-card-title class="bg-blue text-white mb-5">
            <h2>Enter your new password below</h2>
          </v-card-title>

          <v-card-text>
            <MessageHandler field="resetPassword" />
          </v-card-text>

          <v-card-text>
            <v-form if="resetPwd">
              <!-- if user is logged in and has a password, ask them for it -->
              <div v-if="user().isLoggedIn">
                <v-text-field
                  v-model="formData['oldPwd']"
                  type="password"
                  label="Enter your current password"
                  required
                  variant="outlined"
                />
                <p>
                  Don't know your current password or never set one? Please make
                  sure you're logged out and then request a password reset.
                </p>
                <p>
                  <v-btn
                    class="mb-5 text-white"
                    color="red-darken-1"
                    size="small"
                    @click="ensureLogout"
                  >
                    Log out and reset
                  </v-btn>
                </p>
              </div>

              <v-text-field
                v-model="password"
                type="password"
                label="Enter your new password"
                required
                variant="outlined"
              >
                <template #append>
                  <validity-progress :password="password" />
                </template>
              </v-text-field>
              <v-text-field
                v-model="formData.passwordRepeat"
                type="password"
                label="Repeat your password"
                required
                variant="outlined"
              />
              <v-btn :loading="loading" @click="submitPassword()">
                Save your new password
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from "vuex";

import MessageHandler from "@/components/Users/MessageHandler";
import ValidityProgress from "@/components/Users/Password/ValidityProgress";

export default {
  name: "ResetPassword",
  components: { ValidityProgress, MessageHandler },
  data: () => {
    return {
      message: null,
      error: null,
      formData: {},
      password: null,
      loading: false,
    };
  },
  computed: {
    ...mapState("users", ["user", "messages"]),
  },
  mounted() {
    this.$nextTick(async function () {
      const params = this.$route.query;
      if (
        !Object.keys(params).includes("reset_password_token") &&
        !this.user().isLoggedIn
      ) {
        this.setError({
          field: "resetPassword",
          message: "Missing Token",
        });
      }
    });
  },
  methods: {
    ...mapActions("users", [
      "resetPwdWithoutToken",
      "resetPwd",
      "setError",
      "logout",
    ]),
    async submitPassword() {
      this.loading = true;
      let _module = this;
      await _module.submit(_module.user().isLoggedIn);
      this.loading = false;
    },
    async submit(isLoggedIn) {
      let _module = this;
      let query = {
        password: _module.password,
        password_confirmation: _module.formData["passwordRepeat"],
      };
      if (isLoggedIn) {
        query.current_password = _module.formData["oldPwd"];
        await _module.resetPwdWithoutToken(query);
        if (!_module.messages().resetPassword.error) {
          _module.$router.push({
            path: "/accounts/login",
            query: { redirect: "/accounts/profile" },
          });
        }
      } else {
        query.reset_password_token =
          _module.$route.query["reset_password_token"];
        await _module.resetPwd(query);
        if (!_module.messages().resetPassword.error) {
          _module.$router.push({
            path: "/accounts/login",
            query: { redirect: "/accounts/profile" },
          });
        }
      }
    },
    async ensureLogout() {
      await this.logout();
      this.$store.commit("users/logout");
      this.$router.push({ path: "/accounts/forgotPassword" });
    },
  },
};
</script>
