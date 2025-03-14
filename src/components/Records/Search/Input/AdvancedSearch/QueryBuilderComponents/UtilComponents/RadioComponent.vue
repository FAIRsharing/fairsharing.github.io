<template>
  <!-- Commented code is kept if the radio button needs to be changed to checkbox in future -->
  <!--  <v-checkbox-->
  <!--    v-model="model"-->
  <!--    background-color="white"-->
  <!--    color="success"-->
  <!--    class="mt-0"-->
  <!--  />-->
  <div>
  <v-radio-group
    inline
    class="mt-0 ml-1 advancedSearchRadio"
    hide-details="auto"
  >
    <v-radio
      color="success"
      value="true"
      class="mr-6"
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
    >
      <template #label>
        <div class="text-white">
          No
        </div>
      </template>
    </v-radio>
  </v-radio-group>
  </div>
</template>

<script>
import { ref } from 'vue'
export default {
  name: "RadioComponent",
  props: {
    itemValue: {
      type: String,
      default: null,
    }
  },
  emits: ["input"],
  setup() {
    const model = ref(null)
    return { model };
  },
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
