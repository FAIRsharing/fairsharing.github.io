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
            <h2> Request a new password</h2>
          </v-card-title>
          <v-card-text v-if="triggered && message">
            <v-alert
              v-if="success"
              type="success"
            >
              {{ message }}
            </v-alert>
            <v-alert
              v-if="!success"
              type="error"
            >
              {{ message }}
            </v-alert>
          </v-card-text>
          <v-card-text>
            <v-form
              id="requestNewPassword"
            >
              <!-- account -->
              <v-text-field
                v-model="formData.email"
                label="Email address of the account"
                required
                outlined
              />
              <v-btn
                @click="sendEmail()"
              >
                Request new password
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import Client from "@/components/Client/RESTClient.js"

    const client = new Client();

    export default {
        name: "NewPassword",
        data: () => {
          return {
            message: null,
            formData: {},
            success: false,
            triggered: false
          }
        },
        methods: {
          sendEmail: async function(){
            this.triggered = false;
            let response = await client.requestResetPwd(this.formData.email);
            this.message = response.message;
            this.success = response.success;
            this.triggered = true;
          }
        }
    }
</script>

<style scoped>

</style>
