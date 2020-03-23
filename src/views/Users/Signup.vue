<template>
  <div
    id="signUp"
    class="signUp"
  >
    <h2>Register a new account</h2>
    <Register></Register>
  </div>
</template>

<script>
    import Register from "../../components/Users/Register";
    /** This component handles the sign-up/register page
     *
     */
    export default {
        name: "Signup",
      components: {Register}
    }
</script>

<style scoped>

</style>
