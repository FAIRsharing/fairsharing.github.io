<template>
  <div
    v-if="getField('homepage')"
    class="d-flex flex-row mt-4 align-center min-height-40"
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
      {{ recordTooltips['hompage'] }}
    </v-tooltip>
    <b class="width-15-percent-flex">Homepage</b>
    <div class="d-flex full-width ml-md-6 ml-2">
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