<template>
  <div>
    <div v-if="publicMessages.length && !loading" class="my-1">
      <!-- eslint-disable vue/no-v-html -->
      <v-alert
        v-for="(messageObj, index) in publicMessages"
        :key="messageObj.message + '_' + index"
        class="mt-2 mb-2 mx-2 flex-grow-1 text-center"
        density="compact"
        type="warning"
        v-html="`${moment(messageObj.updatedAt)}: ${messageObj.message}`"
      />
      <!-- eslint-enable vue/no-v-html -->
    </div>
    <div v-if="is_development()">
      <v-alert
        key="localhost_warning"
        class="mt-2 mb-2 mx-2 flex-grow-1 text-center"
        density="compact"
        type="warning"
      >
        You are using dev-api.fairsharing.org; changes will not appear in
        production and will be lost when this server is updated.
      </v-alert>
    </div>
    <div v-if="is_localhost()">
      <v-alert
        key="dev_server_warning"
        class="mt-2 mb-2 mx-2 flex-grow-1 text-center"
        density="compact"
        type="warning"
      >
        You are using localhost; changes will not appear in production and will
        be lost when this server is updated.
      </v-alert>
    </div>
  </div>
</template>

<script>
// no-v-html allowed as the text will come only from super_curators...
import moment from "moment";
import { mapState } from "vuex";

export default {
  name: "PublicMessages",
  computed: {
    ...mapState("messages", ["publicMessages", "loading"]),
  },
  methods: {
    moment(date) {
      return moment(date).format("dddd, MMMM Do YYYY, H:mm");
    },
    is_development() {
      if (import.meta.env.VITE_API_ENDPOINT.includes("dev-api")) {
        return true;
      }
      return false;
    },
    is_localhost() {
      if (
        import.meta.env.VITE_API_ENDPOINT.includes("localhost:3000") ||
        import.meta.env.VITE_API_ENDPOINT.includes("127.0.0.1:3000")
      ) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped></style>
