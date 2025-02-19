<template>
  <div class="d-flex flex-row mt-4 align-center min-height-40">
    <span
      class="d-flex align-baseline width-15-percent-flex"
    >
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-icon
            class="mr-2"
            size="15"
            v-bind="props"
          >
            fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips['year'] }}
      </v-tooltip>
      <b>Year of Creation</b>
    </span>
    <div
      class="d-flex ma-0 full-width ml-md-12 ml-8"
      :class="{'justify-end' : $vuetify.display.smAndDown}"
    >
      <p
        v-if="getField('metadata').year_creation"
        class="ma-0"
        :class="{'text-end' : $vuetify.display.smAndDown}"
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
