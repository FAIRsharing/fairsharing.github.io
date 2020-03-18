<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        xl="12"
      >
        <h2>Reset your password</h2>
        <div
          v-if="error"
          class="alert alert-danger"
        >
          {{ message }}
        </div>

        <v-form if="resetPwd">
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
        mounted() {
            this.$nextTick(async function () {
                const params = this.$route.query;
                if (!Object.keys(params).includes('token')){
                    this.error = true;
                    this.message = "Missing token"
                }
            })
        },
        methods: {
            submitPassword: async function(){
                let query = {
                    password: this.formData.password,
                    password_confirmation: this.formData.passwordRepeat,
                    reset_password_token: this.$route.query.token
                };
                let response = await client.resetPassword(query);
                this.message = response;
                if (response.error){
                    this.error = true;
                    this.message = response.error
                }
            }
        }
    }
</script>

<style scoped>

</style>
