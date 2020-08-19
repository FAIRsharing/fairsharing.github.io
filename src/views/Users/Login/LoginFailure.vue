<template>
  <div>
    YOU FAILED !
  </div>
</template>

<script>
    import { mapActions } from "vuex"

    export default {
        name: "LoginFailure",
        computed: {},
        mounted() {
            this.parseParams();
        },
        methods: {
            ...mapActions("users", ["setError"]),
            parseParams: function(){
                let _module = this;
                let error = JSON.parse(_module.$route.query.errors);
                this.setError({
                    field: "login",
                    message: error
                });
                this.$router.push({
                    path: "accounts/login"
                })
            }
        }
    }
</script>

<style scoped>

</style>
