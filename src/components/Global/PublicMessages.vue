<template>
  <div
    v-if="publicMessages.length && !loading"
    class="my-1"
  >
    <!-- eslint-disable vue/no-v-html -->
    <v-alert
      v-for="(messageObj,index) in publicMessages"
      :key="messageObj.message+'_'+index"
      dense
      type="warning"
      class="mb-2 mx-2 flex-grow-1"
      v-html="`${moment(messageObj.updatedAt)}: ${messageObj.message}`"
    />
    <!-- eslint-enable vue/no-v-html -->
  </div>
</template>

<script>
// no-v-html allowed as the text will come only from super_curators...
import {mapState} from "vuex";
import moment from "moment";

export default {
  name: "PublicMessages",
  computed: {
    ...mapState('messages', ["publicMessages", "loading"])
  },
  methods: {
    moment(date) {
      return moment(date).format('dddd, MMMM Do YYYY, H:mm');
    }
  }
}
</script>

<style scoped>

</style>