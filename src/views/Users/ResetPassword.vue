<template>
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        sm="12"
        xl="4"
      >
        <v-card>
          <v-card-title class="blue white--text mb-5">
            <h2>Enter your new password below</h2>
          </v-card-title>

          <v-card-text>
            <MessageHandler field="resetPassword" />
          </v-card-text>

          <v-card-text>
            <v-form if="resetPwd">
              <v-text-field
                v-if="user().isLoggedIn"
                v-model="formData['oldPwd']"
                type="password"
                label="Enter your current password"
                required
                outlined
              />

              <v-text-field
                v-model="password"
                type="password"
                label="Enter your new password"
                required
                outlined
              >
                <template slot="append">
                  <v-progress-circular
                    :value="passwordValidity"
                    :color="passwordColor"
                  />
                </template>
              </v-text-field>
              <v-text-field
                v-model="formData.passwordRepeat"
                type="password"
                label="Repeat your password"
                required
                outlined
              />
              <v-btn
                @click="submitPassword()"
              >
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
  import {mapState, mapActions} from "vuex"
  import MessageHandler from "@/components/Users/MessageHandler";
  import RESTClient from "@/components/Client/RESTClient.js"

  let restClient = new RESTClient();

  export default {
    name: "ResetPassword",
    components: {MessageHandler},
    data: () => {
      return {
        message: null,
        error: null,
        formData: {},
        password: null,
        passwordValidity: 0,
        passwordColor: "red"
      }
    },
    computed: {
      ...mapState("users", ["user", "messages"])
    },
    watch: {
      password: async function () {
        await this.verifyPwd();
      },
    },
    mounted() {
      this.$nextTick(async function () {
        const params = this.$route.query;
        if (!Object.keys(params).includes('reset_password_token') && !this.user().isLoggedIn) {
          this.setError({
            field: "resetPassword",
            message: "Missing Token"
          });
        }
      })
    },
    methods: {
      ...mapActions("users", ["resetPwdWithoutToken", 'resetPwd', "setError"]),
      async submitPassword() {
        let _module = this;
        await _module.submit(_module.user().isLoggedIn);
      },
      async submit(isLoggedIn) {
        let _module = this;
        let query = {
          password: _module.password,
          password_confirmation: _module.formData['passwordRepeat'],
        };
        if (isLoggedIn) {
          query.current_password = _module.formData['oldPwd'];
          await _module.resetPwdWithoutToken(query);
          if (!_module.messages().resetPassword.error) {
            _module.$router.push({path: "/accounts/login", query: {redirect: '/accounts/profile'}})
          }
        }
        else {
          query.reset_password_token = _module.$route.query['reset_password_token'];
          await _module.resetPwd(query);
          if (!_module.messages().resetPassword.error) {
            _module.$router.push({path: "/accounts/login", query: {redirect: '/accounts/profile'}})
          }
        }
      },
      async verifyPwd() {
        const pwd = await restClient.verifyPassword(this.password);
        this.passwordValidity = pwd.percent;
        if (this.passwordValidity < 25) {
          this.passwordColor = "red"
        }
        else if (25 <= this.passwordValidity && this.passwordValidity < 50) {
          this.passwordColor = "orange"
        }
        else if (50 <= this.passwordValidity && this.passwordValidity < 74) {
          this.passwordColor = "yellow"
        }
        else {
          this.passwordColor = "green"
        }
      }
    }
  }
</script>

<style>
  .v-input__append-inner {
    margin-top: 13px !important
  }
</style>
