<template>
  <v-tooltip
    location="bottom"
    class="mr-2"
  >
    <template #activator="{ props }">
      <v-icon
        size="x-small"
        :class="textColour"
        class="mr-1 iconStyle"
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
      default: 'text-white'
    }
  },
};
</script>

<style scoped lang="scss">
  .iconStyle {
    align-items: center;
    display: inline-flex;
    font-feature-settings: "liga";
    font-size: 16px;
    justify-content: center;
    letter-spacing: normal;
    line-height: 1;
    position: relative;
    text-indent: 0;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
  }
</style>
