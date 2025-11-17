<template>
  <div class="d-flex flex-row mt-4 align-center">
    <span
      class="d-flex align-baseline width-15-percent-flex"
    >
      <v-tooltip bottom>
        <template #activator="{ on }">
          <v-icon
            class="mr-2"
            size="15"
            v-on="on"
          >
            fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips['record_type'] }}
      </v-tooltip>
      <b>Type</b>
    </span>
    <p
      class="ma-0 full-width ml-md-12 ml-8"
      :class="{'text-end' : $vuetify.breakpoint.smAndDown}"
    >
      {{ cleanString(getField('type')) | capitalize }}
      <a
        v-if="gupri"
        href="https://fairsharing.gitbook.io/fairsharing/additional-information/globally-unique-persistent-and-resolvable-identifier-schemas"
      >
        GUPRI
      </a>
    </p>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

import stringUtils from "@/utils/stringUtils";
export default {
  name: "Type",
  mixins: [stringUtils],
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("editor", ["recordTooltips"]),
    ...mapState("record", ["currentRecord"]),
  },
  methods: {
    // This value may be undefined in various places if the records have not
    // had this field added.
    gupri() {
      try {
        if (this.currentRecord.fairsharingRecord.metadata['gupri']) {
          return true;
        }
        return false;
      }
      catch (e) {
        return false;
      }
    }
  }
}
</script>
