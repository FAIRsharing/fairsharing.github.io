<template>
  <!-- Commented code is kept if the radio button needs to be changed to checkbox in future -->
  <!--  <v-checkbox-->
  <!--    v-model="model"-->
  <!--    background-color="white"-->
  <!--    color="success"-->
  <!--    class="mt-0"-->
  <!--  />-->
  <v-radio-group
    inline
    class="mt-0 ml-1 advancedSearchRadio"
    hide-details="auto"
    :model-value="model"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-radio
      color="success"
      value="true"
      class="mr-6 radioButtons"
    >
      <template #label>
        <div class="text-white">
          Yes
        </div>
      </template>
    </v-radio>
    <v-radio
      color="error"
      value="false"
      class="radioButtons"
    >
      <template #label>
        <div class="text-white">
          No
        </div>
      </template>
    </v-radio>
    <!-- Tooltip for the field -->
    <template #prepend>
      <v-tooltip
          location="bottom"
          class="mr-2"
      >
        <template #activator="{ props }">
          <v-icon
              size="x-small"
              class="mr-1 iconStyle text-white opacity-100"
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
    itemValue: {
      type: String,
      default: null,
    },
    toolTipText: {
      type: String,
      default: null,
    },
  },
  emits: ["input", "update:modelValue"],
  computed: {
    model: {
      get() {
        return this.itemValue;
      },
      set(itemValue) {
        this.$emit("input", itemValue);
      },
    },
  }
};
</script>
