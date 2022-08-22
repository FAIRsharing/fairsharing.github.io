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
        <span v-if="!message.error">
          {{ message.value }}
        </span>
        <vue-json-pretty
          v-else
          :data="message.value.response.data"
          :show-double-quotes="false"
          :deep="5"
          :highlight-mouseover-node="true"
        />
        <span v-if="message.error">
          <br>
          Need help with the message above?
          Please <a href="mailto:contact@fairsharing.org">email us</a> with the details.
        </span>
      </v-alert>
    </v-card-text>
  </v-scroll-x-transition>
</template>

<script>
    import { mapGetters } from "vuex"
    import VueJsonPretty from 'vue-json-pretty';

    export default {
        name: "Alerts",
        components: { VueJsonPretty },
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

<style>
.vjs-value__string {
  color: #e6ee1b !important;
}
.vjs-value__boolean, .vjs-value__number {
  color: #9ac2e5;
}
</style>
