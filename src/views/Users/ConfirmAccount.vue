<template>
  <div>
    <h2>
      Confirm your account:
    </h2>
    <div
      class="alert"
      :class="{'alert-success': !error, 'alert-danger': error}"
    >
      {{ message.message }}
    </div>
  </div>
</template>

<script>
    import RESTclient from "@/components/Client/RESTClient.js"
    const client = new RESTclient();

    export default {
        name: "ConfirmAccount",
        data: () => {
            return {
                message: {
                  message: null
                },
                error: false
            }
        },
        computed: {
            getToken: function(){
                if (this.$route.query.token){
                    return this.$route.query.token
                }
                return false;
            }
        },
        async created(){
            this.error = false;
            if (this.getToken){
              this.message = await client.confirmAccount(this.getToken);
            }
            else {
                this.error = true;
                this.message.message = "No token"
            }
        }
    }
</script>

<style scoped>

</style>
