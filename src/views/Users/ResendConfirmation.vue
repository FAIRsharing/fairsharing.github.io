<template>
  <v-layout
    id="resendConfirmationPage"
    class="login"
    style="background: white"
  >
    <v-container>
      <!-- forms -->
      <v-row justify="center">
        <v-col
          cols="12"
          sm="12"
          :md="4"
          :lg="4"
          :xl="4"
        >
          <v-card>
            <v-card-title class="blue white--text mb-5">
              <h2 class="ma-0">
                Confirm your email address
              </h2>
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="email"
                label="Email"
                required
                outlined
              />
            </v-card-text>
            <v-card-actions class="mt-2 justify-center">
              <v-btn
                class=" px-4"
                light
                color="primary"
                @click="makeResendRequest()"
              >
                {{ buttonMessage }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
  import RESTClient from "@/components/Client/RESTClient.js"
  let restClient = new RESTClient();

  export default {
    name: "ResendConfirmation",
    data: () => {
      return {
        email: null,
        buttonDisabled: false,
        buttonMessage: "Resend Confirmation Email"
      }
    },
    methods: {
      makeResendRequest: async function () {
        const _module = this;
        const user = {
          "email": _module.email,
        };
        if (_module.email) {
          const outcome = await restClient.resendConfirmation(user);
          if (outcome.message === 'Confirmation message sent successfully!') {
            _module.buttonDisabled = true;
            _module.buttonMessage = outcome.message;
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>