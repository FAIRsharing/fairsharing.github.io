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

    <v-form
      id="loginForm"
    >
      <!-- name -->
      <v-text-field
        v-model="loginData.name"
        label="Username"
        required
      />

      <!-- email -->
      <v-text-field
        v-model="loginData.email"
        label="Email address"
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

      <v-card-actions>
        <v-btn
          type="submit"
          value="submit"
          @click="register()"
        >
          Register a new account
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-container>
</template>

<script>
    export default {
        name: "Register",
        data: () => {
            return {
                showPwd: false,
                showRepeat: false,
                loginData: {},
                errors: []
            }
        },
        methods: {
            register: async function(){
                const _module = this;
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
                    console.log("ATTEMPTING ACCOUNT CREATION")
                }

            }
        }
    }
</script>

<style scoped>

</style>