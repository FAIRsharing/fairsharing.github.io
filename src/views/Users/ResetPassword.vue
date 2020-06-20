<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        xl="12"
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
                v-model="formData.password"
                type="password"
                label="Enter your new password"
                required
                outlined
              />
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
    import { mapState, mapActions } from "vuex"
    import MessageHandler from "../../components/Users/MessageHandler";

    export default {
          name: "ResetPassword",
      components: {MessageHandler},
      data: () => {
              return {
                  message: null,
                  error: null,
                  formData: {}
              }
          },
          computed: {
              ...mapState("users", ["user", "messages"])
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
              submitPassword: async function(){
                  this.submit(this.user().isLoggedIn);
              },
              submit: async function(isLoggedIn){
                let query = {
                  password: this.formData.password,
                  password_confirmation: this.formData['passwordRepeat'],
                };
                if (isLoggedIn){
                  query.current_password = this.formData['oldPwd'];
                  await this.resetPwdWithoutToken(query);
                  if (!this.messages().resetPassword.error){
                    this.$router.push({path: "/accounts/login", query: {redirect: '/accounts/profile'}})
                  }
                }
                else {
                  query.reset_password_token = this.$route.query['reset_password_token'];
                  await this.resetPwd(query);
                  if (!this.messages().resetPassword.error){
                    this.$router.push({path: "/accounts/login", query: {redirect: '/accounts/profile'}})
                  }
                }
              }
          }
    }
</script>

<style scoped>

</style>
