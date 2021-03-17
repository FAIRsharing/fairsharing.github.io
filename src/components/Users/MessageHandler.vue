<template>
  <div>
    <v-alert
      v-if="messages()[field].message && messages()[field].error"
      type="error"
    >
      {{ messages()[field].message }}
    </v-alert>

    <v-alert
      v-if="messages()[field].message && !messages()[field].error"
      type="success"
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
