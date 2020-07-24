<template>
  <v-container>
    <v-row justify="center">
      <v-col
        cols="12"
        xl="5"
      >
        <v-card>
          <!-- TITLE -->
          <v-card-title class="blue white--text">
            <h2> Register a new account</h2>
          </v-card-title>

          <!-- SUCCESS -->
          <v-card-text v-if="message">
            <div
              v-if="created"
              class="alert alert-success"
            >
              {{ message }}
            </div>
            <div
              v-else
              class="alert alert-danger"
            >
              {{ message }}
            </div>
          </v-card-text>

          <!-- ERRORS -->
          <v-card-text
            v-if="errors.length > 0"
            class="alert alert-danger"
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
          </v-card-text>


          <!-- CONTENT/FORM -->
          <v-card-text>
            <v-form
              id="loginForm"
              class="py-3"
            >
              <!-- name -->
              <v-text-field
                v-model="loginData.name"
                label="Username"
                required
                outlined
              />

              <!-- email -->
              <v-text-field
                v-model="loginData.email"
                label="Email address"
                required
                outlined
              />

              <!-- password -->
              <v-text-field
                v-model="loginData.password"
                :type="showPwd ? 'text' : 'password'"
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
                @click:append="showRepeat = !showRepeat"
              />

              <div class="px-5 mb-5">
                <a href="#/accounts/login">
                  - I already have an account -
                </a>
              </div>

              <v-btn
                class="success"
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
    import RESTClient from "@/components/Client/RESTClient.js";
    import ValidityProgress from "./Password/ValidityProgress";

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
                created: false,
                message: null
            }
        },
        methods: {
            register: async function(){
                const _module = this;
                const user_mail = _module.loginData.email;
                _module.errors = [];
                const fields = ["name", "email", "password", "repeatPwd"];
                let valid = true;
                fields.forEach(function(field){
                    if (!_module.loginData[field]){
                        _module.errors.push(field + ' is missing.');
                        valid = false;
                    }
                });
                if (valid){
                   if (_module.loginData.password !== _module.loginData.repeatPwd){
                       _module.errors.push("Passwords need to be the same");
                       valid = false;
                   }
                }
                if (valid){
                    let user = {
                        username: _module.loginData.name,
                        email: _module.loginData.email,
                        password: _module.loginData.password,
                        password_confirmation: _module.loginData['repeatPwd']
                    };
                    let response = await Client.createAccount(user);
                    if (!response.error){
                        _module.created = true;
                        _module.message = "Account created, please verify your email address " + user_mail;
                    }
                    else {
                        _module.message = response.error;
                    }

                }

            }
        }
    }
</script>

<style scoped>

</style>
