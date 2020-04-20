<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        xl="12"
      >
        <h2>Reset your password</h2>
      </v-col>

      <v-col
        cols="12"
        sm="12"
        xl="12"
      >
        <MessageHandler field="resetPassword" />

        <v-form
          if="resetPwd"
        >
          <v-text-field
            v-if="user().isLoggedIn"
            v-model="formData['oldPwd']"
            type="password"
            label="Enter your current password"
            required
          />
          <v-text-field
            v-model="formData.password"
            type="password"
            label="Enter your new password"
            required
          />
          <v-text-field
            v-model="formData.passwordRepeat"
            type="password"
            label="Repeat your password"
            required
          />
          <v-btn
            @click="submitPassword()"
          >
            Request new password
          </v-btn>
        </v-form>
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
                  this.login(this.user().isLoggedIn);
              },
              login: async function(isLoggedIn){
                let query = {
                  password: this.formData.password,
                  password_confirmation: this.formData['passwordRepeat'],
                };
                if (isLoggedIn){
                  query.current_password = this.formData['oldPwd'];
                  await this.resetPwdWithoutToken(query);
                  if (!this.messages().resetPassword.error){
                    this.$router.push({path: "/accounts/login"})
                  }
                }
                else {
                  query.reset_password_token = this.$route.query['reset_password_token'];
                  await this.resetPwd(query);
                  if (!this.messages().resetPassword.error){
                    this.$router.push({path: "/accounts/login"})
                  }
                }
              }
          }
    }
</script>

<style scoped>

</style>
