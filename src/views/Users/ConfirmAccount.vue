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
          <v-card-title class="primary white--text">
            <h2> Confirm your account </h2>
          </v-card-title>

          <v-card-text
            v-if="message"
            class="pt-5"
          >
            <v-alert
              v-if="error"
              type="error"
              :class="{'alert-success': !error, 'alert-danger': error}"
            >
              <b>Something went wrong:</b>
              <ul>
                <li
                  v-for="(errorMessage, errorField, errorIndex) in message"
                  :key="'error_' + errorIndex"
                >
                  {{ errorField }}: {{ errorMessage }}
                </li>
              </ul>
            </v-alert>
            <v-alert
              v-else
              type="success"
            >
              {{ message }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import RESTClient from "@/lib/Client/RESTClient.js"
    const client = new RESTClient();

    export default {
        name: "ConfirmAccount",
        data: () => {
            return {
                message: null,
                error: true,
            }
        },
        async created(){
            await this.validateToken();
        },
        methods: {
          async validateToken(){
            const _module = this;
            _module.error = false;
            const token = (_module.$route.query.confirmation_token) ? _module.$route.query.confirmation_token : false;
            if (token){
              let response = await client.confirmAccount(token);
              _module.error = !response.success;
              _module.message = response;
              if (!_module.error){
                _module.message = "you can now login using your credentials."
              }
            }
            else {
              _module.error = true;
              _module.message = {Confirmation_token: "missing"}
            }
          }
        }
    }
</script>
