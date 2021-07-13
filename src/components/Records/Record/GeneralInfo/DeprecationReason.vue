<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="currentRecord.fairsharingRecord.metadata['deprecation_reason']"
    v-linkified:options="{ className: 'underline-effect' }"
    class="mt-5 red--text"
    v-html="$sanitize(getReason())"
  />
  <!-- eslint-enable vue/no-v-html -->
</template>

<script>
import {mapState} from "vuex";
export default {
  name: "DeprecationReason",
  computed: {
    ...mapState('record', ["currentRecord"]),
  },
  methods: {
    getReason() {
      let reason = this.currentRecord.fairsharingRecord.metadata['deprecation_reason'];
      let date = this.currentRecord.fairsharingRecord.metadata['deprecation_date'];
      return "This record was deprecated on " + date + " for the following reason(s): " + reason;
    }
  }
}
</script>
