<template>
  <div>
    YOU FAILED !
  </div>
</template>

<script>
    import { mapActions } from "vuex"
    import routerUtils from "@/utils/routerUtils";

    export default {
        name: "LoginFailure",
      mixins: [routerUtils],
      mounted() {
            this.parseParams();
        },
        methods: {
            ...mapActions("users", ["setError"]),
            parseParams: function(){
                const _module=this;
                let error = JSON.parse(_module.$route.query.errors);
                this.setError({
                    field: "login",
                    message: error
                });
              _module.goto({Path:"accounts/login"});
            }
        }
    }
</script>

<style scoped>

</style>
