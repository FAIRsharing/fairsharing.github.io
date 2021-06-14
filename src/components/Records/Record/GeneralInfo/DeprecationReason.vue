<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="currentRecord.fairsharingRecord['deprecationReason']"
    v-linkified:options="{ className: 'underline-effect' }"
    class="mt-5 red--text"
    v-html="currentRecord.fairsharingRecord['deprecationReason']"
  />
  <!-- eslint-enable vue/no-v-html -->
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
