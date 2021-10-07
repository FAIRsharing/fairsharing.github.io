<template>
  <main class="pa-15 mb-10">
    <!--  title  -->
    <h2 class="text-h5 text-xl-h4 mb-2 mb-xl-6">
      Login Failure
    </h2>
    <p
        :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      Sorry, login failed. This is an unexpected event that might relate to a problem with a remote
      login service. The message was: <b>{{ error.message }}</b>
    </p>
    <p
        :class="['mb-4 lato-font-medium lato-text-sm',{'lato-text-md':$vuetify.breakpoint.xlOnly }]"
    >
      If you need assistance please <a href="mailto:contact@fairsharing.org">contact us</a>
       with the text of the message shown above, details of your account, the approximate time this error
      occurred, and the steps you took to log in.
    </p>


  </main>
</template>

<script>
    import { mapActions } from "vuex"

    export default {
        name: "LoginFailure",
        data() {
          return {
            error: "unknown",
          };
        },
        computed: {},
        mounted() {
            this.parseParams();
        },
        methods: {
            ...mapActions("users", ["setError"]),
            parseParams: function(){
                let _module = this;
                _module.error = JSON.parse(_module.$route.query.errors);
                _module.setError({
                    field: "login",
                    message: _module.error
                });
                _module.$router.push({
                    path: "accounts/login"
                })
            }
        }
    }
</script>

<style scoped>

</style>
