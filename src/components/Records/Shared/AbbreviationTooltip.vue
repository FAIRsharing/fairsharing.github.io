<template>
  <v-tooltip
    v-if="abbreviation.length > 40"
    bottom
  >
    <template #activator="{ on, attrs }">
      <h2
        v-bind="attrs"
        class="text-body-2 text-md-body-1 text-lg-h6 text-xl-h5 min-height-25 ellipse-width-600"
        v-on="on"
      >
        {{ abbreviation }}
      </h2>
    </template>
    <div class="tooltip">
      {{ abbreviation }}
    </div>
  </v-tooltip>
  <h2
    v-else
    class="text-body-2 text-md-body-1 text-lg-h6 text-xl-h5 min-height-25 ellipse-width-600"
  >
    {{ abbreviation }}
  </h2>
</template>

<script>
export default {
name: "AbbreviationTooltip",
  props: {
    abbreviation: {default: null, type: String}
  }
}
</script>

<style scoped>
.tooltip {
  padding: 5px 0;
}
</style>
