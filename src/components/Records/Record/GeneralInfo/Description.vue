<template>
  <div class="d-flex flex-row mt-4 min-height-40">
    <span class="d-flex align-baseline width-15-percent-flex">
      <v-tooltip location="bottom">
        <template #activator="{ props }">
          <v-icon class="mr-2" size="15" v-bind="props">
            fas fa-question-circle
          </v-icon>
        </template>
        {{ recordTooltips["description"] }}
      </v-tooltip>
      <b>Description</b>
    </span>
    <p
      class="ma-0 full-width ml-md-12 ml-8"
      :class="{ 'text-end': $vuetify.display.smAndDown }"
    >
      {{ $filters.capitalize(getField("description")) }}
    </p>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
export default {
  name: "Description",
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("editor", ["recordTooltips"]),
  },
};
</script>
