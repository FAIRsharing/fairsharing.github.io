<template>
  <div
    v-if="messages()[field].message"
    class="alert"
    :class="{'alert-danger': messages()[field].error, 'alert-success': !messages()[field].error}"
  >
    {{ messages()[field] }}
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
