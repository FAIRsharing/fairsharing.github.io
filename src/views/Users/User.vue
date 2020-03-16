<template>
  <div>
    Welcome {{ $store.state.users.currentUserID }} <br>
    Your profile is here : <br>
    {{ user }}
    <v-divider />
    {{ userDetail }}
    <div>
      <v-btn @click="logoutUser()">
        Logout
      </v-btn>
      <v-btn @click="resetPwd()">
        Reset password
      </v-btn>
    </div>
  </div>
</template>

<script>
    import { mapActions } from "vuex"
    import RESTClient from "@/components/Client/RESTClient.js"
    import GraphClient from "@/components/GraphClient/GraphClient.js"
    import query from "@/components/GraphClient/queries/getUser.json"


    let client = new RESTClient();
    let graphClient = new GraphClient();

    export default {
        name: "User",
        data: () => {
          return {
              user: null,
              userDetail: null,
          }
        },
        async mounted(){
            this.user = await client.getUser(this.$store.state.users.currentUserToken);
            query.queryParam.id = this.user.id;
            this.userDetail = await graphClient.executeQuery(query);
        },
        methods: {
            ...mapActions('users', ['logout']),
            logoutUser: async function(){
                await this.logout(this.$store.state.users.currentUserToken);
                this.$router.push({name: "Login"})
            },
            resetPwd: async function(){
                await client.resetPassword(this.$store.state.users.currentUserToken);
            }
        }
    }
</script>

<style scoped>

</style>
