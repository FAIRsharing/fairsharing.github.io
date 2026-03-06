<template>
  <div>
    <v-alert
      v-if="messages()[field].message && messages()[field]"
      :type="messages()[field].error ? 'error' : 'success'"
      class="mb-4"
      variant="tonal"
    >
      <div v-html="messages()[field].message"></div>
    </v-alert>
  </div>
</template>

<script>
import { mapState } from "vuex";

import stringUtils from "@/utils/stringUtils";
import messages from "../../store/messages";

export default {
  name: "MessageHandler",
  mixins: [stringUtils],
  props: {
    field: {
      type: String,
      default: null,
    },
  },
  computed: {
    messages() {
      return messages;
    },
    ...mapState("users", ["messages"]),
  },
};
</script>
