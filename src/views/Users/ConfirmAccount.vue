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

          <v-card-text class="pt-5">
            <v-alert
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import RESTClient from "@/components/Client/RESTClient.js"
    const client = new RESTClient();

    export default {
        name: "ConfirmAccount",
        data: () => {
            return {
                message: null,
                error: false
            }
        },
        async created(){
            this.error = false;
            const token = (this.$route.query.confirmation_token) ? this.$route.query.confirmation_token : false;
            if (token){
              let response = await client.confirmAccount(token);
              this.message = response;
              this.error = !response.success
            }
            else {
                this.error = true;
                this.message = {Confirmation_token: "missing"}
            }
        }
    }
</script>

<style scoped>

</style>
