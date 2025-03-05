<template>
  <div
    v-if="getField('homepage')"
    class="d-flex flex-row mt-4 align-center min-height-40"
  >
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
            fas fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips['homepage'] }}
      </v-tooltip>
      <b>Homepage</b>
    </span>
    <div
      class="d-flex ma-0 full-width ml-md-12 ml-8"
      :class="{'justify-end' : $vuetify.display.smAndDown}"
    >
      <a
        v-if="getField('homepage')"
        :href="getField('homepage')"
        target="_blank"
        class="underline-effect"
      >{{ getField('homepage') }}</a>
      <NoneFound
        v-else
        :string-field="getField('homepage')"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

import NoneFound from "@/components/Records/Record/NoneFound";
export default {
  name: "HomePage",
  components: {NoneFound},
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("editor", ["recordTooltips"]),
  }
}
</script>