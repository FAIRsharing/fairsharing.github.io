<template>
  <div class="d-flex flex-row mt-4 align-center">
    <span class="d-flex align-baseline width-15-percent-flex">
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-icon class="mr-2" size="15" v-bind="props">
            fas fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips["record_type"] }}
      </v-tooltip>
      <b>Type</b>
    </span>
    <p
      class="ma-0 full-width ml-md-12 ml-8"
      :class="{ 'text-end': $vuetify.display.smAndDown }"
    >
      {{ $filters.capitalize(cleanString(getField("type"))) }}
      <a
        v-if="currentRecord.fairsharingRecord.metadata['globally_unique']"
        href="https://fairsharing.gitbook.io/fairsharing/additional-information/globally-unique-persistent-and-resolvable-identifier-schemas"
      >
        <v-chip
          label
          color="primary"
          variant="flat"
          x-small
          style="margin-right: 1px; margin-bottom: 1px; padding-top: 1px;"
        >
          GLOBALLY UNIQUE
        </v-chip>
      </a>
      <a
        v-if="currentRecord.fairsharingRecord.metadata['persistent']"
        href="https://fairsharing.gitbook.io/fairsharing/additional-information/globally-unique-persistent-and-resolvable-identifier-schemas"
      >
        <v-chip
          label
          color="primary"
          variant="flat"
          x-small
          style="margin-right: 1px; margin-bottom: 1px; padding-top: 1px;"
        >
          PERSISTENT
        </v-chip>
      </a>
      <a
        v-if="currentRecord.fairsharingRecord.metadata['resolvable']"
        href="https://fairsharing.gitbook.io/fairsharing/additional-information/globally-unique-persistent-and-resolvable-identifier-schemas"
      >
        <v-chip
          label
          color="primary"
          variant="flat"
          x-small
          style="margin-right: 1px; margin-bottom: 1px; padding-top: 1px;"
        >
          RESOLVABLE
        </v-chip>
      </a>
    </p>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import stringUtils from "@/utils/stringUtils";
export default {
  name: "Type",
  mixins: [stringUtils],
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("editor", ["recordTooltips"]),
    ...mapState("record", ["currentRecord"]),
  }
}
</script>
