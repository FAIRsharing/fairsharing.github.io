<template>
  <v-tooltip
    location="bottom"
    class="mr-2"
  >
    <template #activator="{ props }">
      <v-icon
        size="x-small"
        :class="textColour"
        class="mr-1"
        v-bind="props"
      >
        fas fa-question-circle
      </v-icon>
    </template>
    <span> {{ toolTipText }} </span>
  </v-tooltip>
</template>

<script>
export default {
  name: "TooltipComponent",
  props: {
    toolTipText: {
      type: String,
      default: null,
    },
    textColour: {
      type: String,
      default: 'white--text'
    }
  },
};
</script>
