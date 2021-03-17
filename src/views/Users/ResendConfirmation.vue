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
          <v-form
            id="resendConfirm"
            ref="resendConfirmForm"
            v-model="formValid"
          >
            <v-card>
              <v-card-title class="blue white--text mb-5">
                <h2 class="ma-0">
                  Confirm your email address
                </h2>
              </v-card-title>
              <v-card-text>
                <v-alert
                  v-if="error"
                  type="error"
                >
                  <b>Something went wrong: {{ error }}</b>
                </v-alert>

                <v-alert
                  v-if="success"
                  type="success"
                >
                  Confirmation message sent successfully, please check your email {{ email }}.
                </v-alert>

                <v-text-field
                  v-model="email"
                  label="Email"
                  required
                  outlined
                  :rules="[rules.isEmail(), rules.isRequired()]"
                />
              </v-card-text>
              <v-card-actions class="mt-2 justify-center">
                <v-btn
                  class=" px-4"
                  light
                  color="primary"
                  :loading="loading"
                  :disabled="!formValid"
                  @click="makeResendRequest()"
                >
                  {{ buttonMessage }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
  import RESTClient from "@/components/Client/RESTClient.js"
  let restClient = new RESTClient();
  import { isEmail, isRequired } from "@/utils/rules.js"


  export default {
    name: "ResendConfirmation",
    data: () => {
      return {
        email: null,
        buttonDisabled: false,
        buttonMessage: "Resend Confirmation Email",
        error: false,
        loading: false,
        rules: {
          isEmail: function(){return isEmail()},
          isRequired: function(){return isRequired()},
        },
        formValid: false,
        success: false
      }
    },
    methods: {
      makeResendRequest: async function () {
        const _module = this;
        _module.error = false;
        _module.loading = true;
        _module.success = false;
        const user = {
          "email": _module.email,
        };
        if (_module.email) {
          const outcome = await restClient.resendConfirmation(user);
          if (outcome.message === "Confirmation message not sent!") {
            _module.error = "Confirmation message not sent!";
          }
          else if (outcome.message === 'Confirmation message sent successfully!') {
            _module.success = true;
            _module.buttonMessage = outcome.message;
          }
        }
        _module.loading = false;
      }
    }
  }
</script>
