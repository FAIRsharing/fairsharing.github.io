<template>
  <v-progress-circular
    :value="passwordValidity"
    :color="passwordColor"
  />
</template>

<script>
    import RESTClient from "@/components/Client/RESTClient.js"

    let restClient = new RESTClient();

    export default {
        name: "ValidityProgress",
        props: {
            password: {
                type: String,
                default: null
            }
        },
        data: () => {
            return {
                passwordValidity: 0,
                passwordColor: "red"
            }
        },
        watch: {
            password: async function () {
                await this.verifyPwd();
            }
        },
        methods: {
            async verifyPwd() {
                let _module = this;
                const pwd = await restClient.verifyPassword(_module.password);
                _module.passwordValidity = pwd.percent;
                if (_module.passwordValidity < 25) {
                    _module.passwordColor = "red"
                }
                else if (25 <= _module.passwordValidity && _module.passwordValidity < 50) {
                    _module.passwordColor = "orange"
                }
                else if (50 <= this.passwordValidity && _module.passwordValidity < 74) {
                    _module.passwordColor = "yellow"
                }
                else {
                    _module.passwordColor = "green"
                }
            }
        }
    }
</script>

<style scoped>

</style>
