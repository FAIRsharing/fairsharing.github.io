<template>
  <div>
    <v-alert
      v-if="messages()[field].message && messages()[field].error"
      type="error"
    >
      <!-- This html is from a safe source -->
      <!-- eslint-disable vue/no-v-html -->
      <p :inner-html.prop="messages()[field].message | pretty" />
      <!-- eslint-enable vue/no-v-html -->
    </v-alert>

    <v-alert
      v-if="messages()[field].message && !messages()[field].error"
      type="success"
    >
      <!-- This html is from a safe source -->
      <!-- eslint-disable vue/no-v-html -->
      <p :inner-html.prop="messages()[field].message | pretty" />
      <!-- eslint-enable vue/no-v-html -->
    </v-alert>
  </div>
</template>

<script>
    import { mapState } from "vuex";
    import stringUtils from '@/utils/stringUtils';

    export default {
        name: "MessageHandler",
        mixins: [ stringUtils ],
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
