<template>
  <div>
    <v-alert
      v-if="messages()[field].message && messages()[field].error"
      type="error"
      icon="fa-exclamation-circle"
    >
      {{ messages()[field].message }}
    </v-alert>

    <v-alert
      v-if="messages()[field].message && !messages()[field].error"
      type="success"
      icon="fa-check-circle"
    >
      {{ messages()[field].message }}
    </v-alert>
  </div>
</template>

<script>
    import { mapState } from "vuex"

    export default {
        name: "MessageHandler",
        props: {
          field: {
            type: String,
            default: null
          }
        },
        computed: {
          ...mapState("users", ["messages"])
        }
    }
</script>

<style scoped>

</style>
