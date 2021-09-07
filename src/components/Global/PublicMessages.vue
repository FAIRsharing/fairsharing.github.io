<template>
  <div
    v-if="publicMessages.length && !loading"
    class="my-1"
  >
    <v-alert
      v-for="(messageObj,index) in publicMessages"
      :key="messageObj.message+'_'+index"
      dense
      type="warning"
      class="mb-0 mx-2 flex-grow-1"
    >
      {{ `${momentify(messageObj.updatedAt)}: ${messageObj.message}` }}
    </v-alert>
  </div>
</template>

<script>
import {mapState} from "vuex";
import moment from "moment";

export default {
  name: "PublicMessages",
  computed: {
    ...mapState('messages', ["publicMessages", "loading"])
  },
  methods: {
    momentify(date) {
      return moment(date).format('dddd, MMMM Do YYYY, H:mm');
    }
  }
}
</script>

<style scoped>

</style>