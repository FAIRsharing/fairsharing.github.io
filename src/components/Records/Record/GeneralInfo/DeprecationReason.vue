<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="currentRecord.fairsharingRecord.metadata['deprecation_reason']"
    v-linkified:options="{ className: 'underline-effect' }"
    class="mt-5 red--text"
    v-html="currentRecord.fairsharingRecord.metadata['deprecation_reason']"
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
