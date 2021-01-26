<template>
  <v-scroll-x-transition>
    <v-card-text
      v-if="message.value"
      class="pt-3 mb-0 pb-0"
    >
      <v-alert
        :type="message.type()"
        class="mb-0"
      >
        {{ message.value }}<span v-if="message.error"> <v-icon class="ml-4 mr-3">fa-arrow-right</v-icon> {{ message.value.response.data }}</span>
      </v-alert>
    </v-card-text>
  </v-scroll-x-transition>
</template>

<script>
    import { mapGetters } from "vuex"

    export default {
        name: "Alerts",
        props: {
            target: {default: null, type: String},
        },
        computed: {
            ...mapGetters("record", ["getSection"]),
            message(){
                let error = this.getSection(this.target).error;
                return {
                    error: error,
                    value: this.getSection(this.target).message,
                    type: function(){if (error){return "error"} else {return "success"}}
                };
            }
        }
    }
</script>

<style scoped>

</style>
