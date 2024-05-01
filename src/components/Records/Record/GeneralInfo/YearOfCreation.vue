<template>
  <div class="d-flex flex-row mt-4 align-center min-height-40">
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
      {{ recordTooltips['year'] }}
    </v-tooltip>
    <b class="width-15-percent-flex">Year of Creation</b>
    <div class="d-flex full-width ml-md-6 ml-2">
      <p
        v-if="getField('metadata').year_creation"
        class="ma-0"
      >
        {{ getField('metadata').year_creation }}
      </p>
      <NoneFound
        v-else
        :string-field="getField('metadata').year_creation"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

import NoneFound from "@/components/Records/Record/NoneFound";
export default {
  name: "YearOfCreation",
  components:{NoneFound},
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("editor", ["recordTooltips"])
  }
}
</script>
