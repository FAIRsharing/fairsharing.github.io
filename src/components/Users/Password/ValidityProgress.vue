<template>
  <div>
    <v-progress-circular
      :value="passwordValidity"
      :color="passwordColor"
    />
  </div>
</template>

<script>
    import RESTClient from "@/lib/Client/RESTClient.js"

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
                const colors = [
                  {
                    name: "red",
                    min: 0,
                    max: 25
                  },
                  {
                    name: "orange",
                    min: 25,
                    max: 50
                  },
                  {
                    name: "yellow",
                    min: 50,
                    max: 74
                  },
                  {
                    name: "green",
                    min: 74,
                    max: 200
                  }
                ];
                const pwd = await restClient.verifyPassword(_module.password);
                _module.passwordValidity = pwd.percent;
                colors.forEach(function(colorObject){
                  if (colorObject.min <= pwd.percent && pwd.percent < colorObject.max){
                    _module.passwordColor = colorObject.name;
                  }
                });

            },
        }
    }
</script>
