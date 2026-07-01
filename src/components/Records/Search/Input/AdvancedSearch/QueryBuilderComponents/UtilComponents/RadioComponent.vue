<template>
  <!-- Commented code is kept if the radio button needs to be changed to checkbox in future -->
  <!--  <v-checkbox-->
  <!--    v-model="model"-->
  <!--    background-color="white"-->
  <!--    color="success"-->
  <!--    class="mt-0"-->
  <!--  />-->
  <v-radio-group
    :model-value="modelValue"
    class="mt-0 ml-1 advancedSearchRadio advancedSearchDialogBoxContent"
    hide-details="auto"
    inline
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-radio class="mr-6 radioButtons" color="success" value="true">
      <template #label>
        <div class="text-white">Yes</div>
      </template>
    </v-radio>
    <v-radio class="radioButtons" color="error" value="false">
      <template #label>
        <div class="text-white">No</div>
      </template>
    </v-radio>
    <!-- Tooltip for the field -->
    <template #prepend>
      <v-tooltip class="mr-2" location="bottom">
        <template #activator="{ props }">
          <v-icon
            class="mr-1 iconStyle text-white opacity-100"
            size="x-small"
            v-bind="props"
          >
            fas fa-question-circle
          </v-icon>
        </template>
        <span> {{ toolTipText }} </span>
      </v-tooltip>
    </template>
  </v-radio-group>
</template>

<script>
export default {
  name: "RadioComponent",
  props: {
    modelValue: {
      type: String,
      default: null,
    },
    toolTipText: {
      type: String,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  // computed: {
  //   model: {
  //     get() {
  //       return this.itemValue;
  //     },
  //     set(itemValue) {
  //       this.$emit("input", itemValue);
  //     },
  //   },
  // },
};
</script>
