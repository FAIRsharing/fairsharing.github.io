<template>
  <div
    v-if="publicMessages.length && !loading"
    class="my-2"
  >
    <v-alert
      v-for="(messageObj,index) in publicMessages"
      :key="messageObj.message+'_'+index"
      dense
      type="warning"
      class="mb-2 mx-2 flex-grow-1"
    >
      {{ `${messageObj.updatedAt}: ${messageObj.message} ` }}
    </v-alert>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "PublicMessages",
  computed: {
    ...mapState('messages', ["publicMessages","loading"])
  }
}
</script>

<style scoped>

</style>