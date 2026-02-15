<template>
  <v-tooltip
    v-if="abbreviation !== null && abbreviation.length > 40"
    location="bottom"
  >
    <template #activator="{ props }">
      <h2
        class="text-body-2 text-md-body-1 text-lg-h6 text-xl-h5 min-height-25 ellipse-width-600"
        v-bind="props"
      >
        {{ abbreviation }}
      </h2>
    </template>
    <div class="tooltip">
      {{ abbreviation }}
    </div>
  </v-tooltip>
  <h2
    v-else-if="abbreviation !== null"
    class="text-body-2 text-md-body-1 text-lg-h6 text-xl-h5 min-height-25 ellipse-width-600"
  >
    {{ abbreviation }}
  </h2>
  <!-- else if there is no data keep the height of abbreviation for the sake of consistency -->
  <h2
    v-else
    class="text-body-2 text-md-body-1 text-lg-h6 text-xl-h5 min-height-25 ellipse-width-600"
  />
</template>

<script>
export default {
  name: "AbbreviationTooltip",
  props: {
    abbreviation: { default: null, type: String },
  },
};
</script>

<style scoped>
.tooltip {
  padding: 5px 0;
}
</style>
