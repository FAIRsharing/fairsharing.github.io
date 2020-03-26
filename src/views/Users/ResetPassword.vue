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
        <div
          v-if="message"
          class="alert"
          :class="{'alert-danger': error, 'alert-success': !error}"
        >
          {{ message }}
        </div>

        <v-form
          if="resetPwd"
        >
          <v-text-field
            v-if="userLoggedIn"
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
            type="submit"
            value="submit"
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
    import Client from "@/components/Client/RESTClient.js"

    const client = new Client();

    export default {
        name: "ResetPassword",
        data: () => {
            return {
                message: null,
                error: null,
                formData: {}
            }
        },
      computed: {
          ...mapState("users", ["userLoggedIn", "currentUserToken", "errors"])
      },
      mounted() {
            this.$nextTick(async function () {
              if (!this.userLoggedIn) {
                const params = this.$route.query;
                if (!Object.keys(params).includes('reset_password_token')) {
                  this.error = true;
                  this.message = "Missing token"
                }
              }
            })
        },
        methods: {
            ...mapActions("users", ["resetPwdWithoutToken"]),
            submitPassword: async function(){
                let query = {
                    password: this.formData.password,
                    password_confirmation: this.formData['passwordRepeat'],
                };

                // Not logged in
                if (!this.userLoggedIn){
                  query.reset_password_token = this.$route.query.reset_password_token;
                  let response = await client.resetPassword(query);
                  this.message = response;
                  if (response.error){
                    this.error = true;
                    this.message = response.error
                  }
                }

                // Logged in users
                else {
                  query.current_password = this.formData['oldPwd'];
                  await this.resetPwdWithoutToken(query);
                  if (!this.errors){
                    this.$router.push({path: "/accounts/login"})
                  }
                  else{
                    this.error = true;
                    this.message = this.errors
                  }

                }
            }
        }
    }
</script>

<style scoped>

</style>
