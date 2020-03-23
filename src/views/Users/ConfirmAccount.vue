<template>
  <v-container class="container--fluid">
    <h2>
      Confirm your account:
    </h2>
    <div
      class="alert"
      :class="{'alert-success': !error, 'alert-danger': error}"
    >
      {{ message }}
    </div>
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
                this.message = "No token"
            }
        }
    }
</script>

<style scoped>

</style>
