<template>
  <v-card-text>
    <v-text-field
      v-model="email"
      label="Email"
      required
      outlined
    />
    <v-btn
      class="text-center"
      :disabled="buttonDisabled"
      @click="makeResendRequest"
    >
      <v-layout width="100%">
        <v-icon
          left
          class="mr-5"
        >
          mdi-email
        </v-icon>
        <v-layout>{{ buttonMessage }}</v-layout>
      </v-layout>
    </v-btn>
  </v-card-text>
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
        buttonMessage: "Resend Confirmation Email",
        buttonColor: "green"
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