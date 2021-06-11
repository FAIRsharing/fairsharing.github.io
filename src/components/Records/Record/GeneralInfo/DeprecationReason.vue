<template>
  <p
    v-if="currentRecord.fairsharingRecord['deprecationReason']"
    class="ml-2 mt-4 pb-0 red--text"
  >
    {{ currentRecord.fairsharingRecord["deprecationReason"] }}
  </p>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "DeprecationReason",
  computed: {
    ...mapState('record', ["currentRecord"]),
  }
}
</script>

<style scoped>

</style>
