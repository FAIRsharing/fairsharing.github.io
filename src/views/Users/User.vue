<template>
  <div>
    Welcome {{ $store.state.users.currentUserID }} <br> Your profile is here


    <div>
      <v-btn>
        Logout
      </v-btn>
    </div>
  </div>
</template>

<script>
    export default {
        name: "User"
    }
</script>

<style scoped>

</style>
