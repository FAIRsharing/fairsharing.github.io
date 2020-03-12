<template>
  <v-container fluid>
    <div
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
    </div>

    <div v-if="message">
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
    </div>

    <v-form
      id="loginForm"
    >
      <!-- name -->
      <v-text-field
        v-model="loginData.name"
        label="Username"
        required
      />

      <!-- password -->
      <v-text-field
        v-model="loginData.password"
        :append-icon="showPwd ? 'fa-eye' : 'fa-eye-slash'"
        :type="showPwd ? 'text' : 'password'"
        label="Password"
        required
        @click:append="showPwd = !showPwd"
      />

      <!-- repeat password -->
      <v-text-field
        v-model="loginData.repeatPwd"
        :append-icon="showRepeat ? 'fa-eye' : 'fa-eye-slash'"
        :type="showRepeat ? 'text' : 'password'"
        label="Repeat password"
        required
        @click:append="showRepeat = !showRepeat"
      />

      <!-- email -->
      <v-text-field
        v-model="loginData.email"
        label="Email address"
        required
      />

      <v-card-actions>
        <v-btn
          type="submit"
          value="submit"
          @click="register()"
        >
          Register a new account
        </v-btn>
        <v-btn
          href="#/accounts/login"
        >
          Login
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script>
    import RESTclient from "@/components/Client/RESTClient.js";

    const Client = new RESTclient();

    export default {
        name: "Register",
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
