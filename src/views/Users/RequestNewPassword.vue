<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        xl="12"
      >
        <h2> Request a new password</h2>
        <div
          v-if="triggered && message"
          class="alert"
          :class="{'alert-success': success, 'alert-danger': !success}"
        >
          {{ message }}
        </div>
        <v-form
          id="requestNewPassword"
        >
          <!-- account -->
          <v-text-field
            v-model="formData.email"
            label="Email address of the account"
            required
          />
          <v-btn
            type="submit"
            value="submit"
            @click="sendEmail()"
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
            this.triggered = true;
            let response = await client.requestResetPwd(this.formData.email);
            this.message = response.message;
            this.success = response.success;
          }
        }
    }
</script>

<style scoped>

</style>
