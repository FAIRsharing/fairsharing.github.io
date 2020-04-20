<template>
  <div class="container-fluid">
    <h3>{{ user }}</h3>
  </div>
</template>

<script>
  import { mapActions } from "vuex"
  export default {
    name: "OauthLogin",
    data(){
      return {
        user: ""
      }
    },
    async mounted(){
      await this.login();
    },
    methods: {
      ...mapActions("users", ["loginFromOauth"]),
      login: async function(){
        const params = this.$route.fullPath.split("?")[1];
        const provider = this.$route.fullPath.split("/")[3];
        this.user = await this.loginFromOauth({
          params: params,
          provider: provider
        });
      }
    }
  }
</script>

<style scoped>
</style>
