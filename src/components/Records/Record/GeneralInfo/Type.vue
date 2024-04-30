<template>
  <div class="d-flex flex-row mt-4 align-center">
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
      {{ recordTooltips['fairsharing_registry'] }}
    </v-tooltip>
    <b class="width-15-percent-flex">Type</b>
    <p class="ma-0 full-width ml-md-12 ml-13">
      {{ cleanString(getField('type')) | capitalize }}
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
    ...mapState("editor", ["recordTooltips"])
  }
}
</script>
