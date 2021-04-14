<template>
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
        xl="4"
      >
        <v-card>
          <!-- TITLE -->
          <v-card-title class="blue white--text">
            <h2> Register a new account</h2>
          </v-card-title>

          <!-- SUCCESS -->
          <v-card-text
            v-if="message || errors.length > 0"
            class="pt-2 mb-0 pb-0"
          >
            <v-alert
              v-if="message"
              type="success"
              class="my-3"
            >
              {{ message }}
            </v-alert>
            <v-alert
              v-if="errors.length > 0"
              type="error"
            >
              <b>Please correct the following error(s):</b>
              <ul>
                <li
                  v-for="(error, index) in errors"
                  :key="'error_' + index"
                >
                  {{ error }}
                </li>
              </ul>
            </v-alert>
          </v-card-text>

          <!-- CONTENT/FORM -->
          <v-card-text>
            <v-form
              id="loginForm"
              ref="registerForm"
              v-model="formValid"
              class="my-3"
            >
              <!-- name -->
              <v-text-field
                v-model="loginData.name"
                label="Username"
                :rules="[rules.isRequired()]"
                required
                outlined
              />

              <!-- email -->
              <v-text-field
                v-model="loginData.email"
                label="Email address"
                :rules="[rules.isEmail(), rules.isRequired()]"
                required
                outlined
              />

              <!-- password -->
              <v-text-field
                v-model="loginData.password"
                :type="showPwd ? 'text' : 'password'"
                :rules="[rules.isRequired()]"
                label="Password"
                required
                outlined
              >
                <template slot="append">
                  <div
                    class="pt-1 mr-2"
                    @click="showPwd = !showPwd"
                  >
                    <v-icon v-if="showPwd">
                      fa-eye
                    </v-icon>
                    <v-icon v-else>
                      fa-eye-slash
                    </v-icon>
                  </div>
                  <validity-progress :password="loginData.password" />
                </template>
              </v-text-field>

              <!-- repeat password -->
              <v-text-field
                v-model="loginData.repeatPwd"
                :append-icon="showRepeat ? 'fa-eye' : 'fa-eye-slash'"
                :type="showRepeat ? 'text' : 'password'"
                label="Repeat password"
                required
                outlined
                :rules="[rules.hasValue(loginData.password), rules.isRequired()]"
                @click:append="showRepeat = !showRepeat"
              />

              <div class="px-5 mb-5">
                <a href="#/accounts/login">
                  - I already have an account -
                </a>
              </div>

              <v-btn
                :loading="isLoading"
                class="success"
                :disabled="!formValid"
                @click="register()"
              >
                Register my new account
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import RESTClient from "@/lib/Client/RESTClient.js";
    import ValidityProgress from "./Password/ValidityProgress";

    import { hasValue, isEmail, isRequired } from "@/utils/rules.js"

    const Client = new RESTClient();

    export default {
      name: "Register",
      components: {ValidityProgress},
      data: () => {
            return {
                showPwd: false,
                showRepeat: false,
                loginData: {},
                errors: [],
                message: null,
                isLoading: false,
                rules: {
                    hasValue: function(val){return hasValue(val)},
                    isEmail: function(){return isEmail()},
                    isRequired: function(){return isRequired()},
                },
                formValid: false,
            }
        },
        methods: {
            register: async function(){
                const _module = this;
                _module.errors = [];
                _module.message = false;
                _module.isLoading = true;
                const user_mail = _module.loginData.email;
                let user = {
                    username: _module.loginData.name,
                    email: _module.loginData.email,
                    password: _module.loginData.password,
                    password_confirmation: _module.loginData['repeatPwd']
                };
                let response = await Client.createAccount(user);
                if (!response.error){
                    _module.message = "Account created, please verify your email address " + user_mail;
                    _module.$refs['registerForm'].reset();
                }
                else {
                  Object.keys(response.error.response.data.errors).forEach(function(errorField){
                    response.error.response.data.errors[errorField].forEach(function(error){
                      _module.errors.push(errorField + ' ' + error);
                    })
                  });
                }
                _module.isLoading = false;
            }
        }
    }
</script>
