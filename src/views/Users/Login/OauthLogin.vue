<template>
  <div class="container-fluid" />
</template>

<script>
  import { mapActions, mapState } from "vuex"
  export default {
    name: "OauthLogin",
    data(){
      return {
        user: ""
      }
    },
    computed: {
      ...mapState("users", ["messages"])
    },
    async mounted(){
      await this.login();
    },
    methods: {
      ...mapActions("users", ["loginFromOauth", "setError", "oauthLogin"]),
      login: async function(){
        let _module = this;
        const parseError = {
          field: "login",
          message: "Missing token or expiry"
        };
        let paramsArray = this.$route.query;
        if (Object.keys(paramsArray).length === 0 || !Object.keys(paramsArray).includes("jwt") || !Object.keys(paramsArray).includes("expiry")){
          this.setError(parseError);
          return null
        }
        await this.oauthLogin({
          jwt: paramsArray.jwt,
          expiry: paramsArray.expiry
        });
        let path;
        if (paramsArray.return_to) {
          path = paramsArray.return_to
        }
        else {
          path = "accounts/profile"
        }
        _module.$router.push({
          path: path
        })
      }
    }
  }
</script>

<style scoped>
</style>
