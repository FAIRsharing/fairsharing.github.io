<template>
  <v-layout
    class="login"
    style="background: white"
  >
    <v-container>
      <!-- forms -->
      <v-row justify="center">
        <v-col
          cols="12"
          sm="12"
          md="8"
          lg="8"
          xl="4"
        >
          <v-form
            ref="emailRef"
            v-model="formValid"
          >
            <v-card>
              <v-card-title class="blue white--text mb-5">
                <h2 class="ma-0">
                  Provide your email address
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
                  Verification message sent successfully, please check your
                  email {{ emailId }}.
                </v-alert>

                <v-text-field
                  v-model="email"
                  label="Email"
                  required
                  outlined
                  :rules="[rules.isEmail(), rules.isRequired()]"
                  @focus="success = false"
                />
              </v-card-text>
              <v-card-actions class="mt-2 justify-center">
                <v-btn
                  class="px-4"
                  light
                  color="primary"
                  :loading="loading"
                  :disabled="!formValid"
                  @click="sendVerificationRequest()"
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
import RESTClient from "@/lib/Client/RESTClient.js";

let restClient = new RESTClient();
import { isEmail, isRequired } from "@/utils/rules.js";

export default {
  name: "SendOrcidLoginEmail",
  data: () => {
    return {
      email: null,
      emailId: null,
      uid: null,
      identifier: null,
      buttonDisabled: false,
      buttonMessage: "Send Verification Email",
      error: false,
      loading: false,
      rules: {
        isEmail: function () {
          return isEmail();
        },
        isRequired: function () {
          return isRequired();
        },
      },
      formValid: false,
      success: false,
    };
  },
  mounted() {
    this.getURLQueryParams();
  },

  methods: {
    getURLQueryParams() {
      this.uid = this.$route.query["uid"];
      this.identifier = this.$route.query["identifier"];
    },
    async sendVerificationRequest() {
      const _module = this;
      _module.error = false;
      _module.loading = true;
      _module.success = false;
      const user = {
        email: _module.email,
        uid: _module.uid,
        identifier: _module.identifier,
      };
      if (_module.email) {
        const outcome = await restClient.sendOrcidVerification(user);
        if (outcome.status === 503) {
          _module.error = "Verification message not sent!";
        } else if (outcome.status === 201) {
          _module.success = true;
          _module.emailId = _module.email;
          _module.$refs.emailRef.reset();
        }
      }
      _module.loading = false;
    },
  },
};
</script>
