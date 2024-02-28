<template>
  <v-tooltip
    bottom
    class="mr-2"
  >
    <template #activator="{ on, attrs }">
      <v-icon
        v-bind="attrs"
        small
        class="white--text mr-1"
        v-on="on"
      >
        fa-question-circle
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
  },
};
</script>
