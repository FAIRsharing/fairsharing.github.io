<template>
  <div>
    Welcome {{ $store.state.users.currentUserID }} <br>
    Your profile is here : <br>
    {{ user }}
    <div>
      <v-btn @click="logoutUser()">
        Logout
      </v-btn>
    </div>
  </div>
</template>

<script>
    import { mapActions } from "vuex"
    import RESTClient from "@/components/Client/RESTClient.js"

    let client = new RESTClient();

    export default {
        name: "User",
        data: () => {
          return {
              user: null
          }
        },
        async mounted(){
            this.user = await client.getUser(this.$store.state.users.currentUserToken)
        },
        methods: {
            ...mapActions('users', ['logout']),
            logoutUser: async function(){
                await this.logout(this.$store.state.users.currentUserToken);
                this.$router.push({name: "Login"})
            }
        }
    }
</script>

<style scoped>

</style>
