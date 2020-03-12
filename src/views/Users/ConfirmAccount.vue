<template>
  <div>
    <h2>
      Confirm your account:
    </h2>
    <div v-if="getToken">
      {{ message }}
    </div>
    <div v-else class="alert alert-danger">
      {{ message }}
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
                message: null
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
        async mounted(){
            if (this.getToken){
                let response = await client.confirmAccount(this.getToken)
                this.message = response;
            }
            else {
                this.message = "No token"
            }
        }
    }
</script>

<style scoped>

</style>