<template>
  <!-- Commented code is kept if the radio button needs to be changed to checkbox in future -->
  <!--  <v-checkbox-->
  <!--    v-model="model"-->
  <!--    background-color="white"-->
  <!--    color="success"-->
  <!--    class="mt-0"-->
  <!--  />-->
  <v-radio-group
    v-model="model"
    row
    class="mt-0 ml-1"
  >
    <v-radio
      color="success"
      value="true"
      class="mr-6"
    >
      <template #label>
        <div class="white--text">
          Yes
        </div>
      </template>
    </v-radio>
    <v-radio
      color="error"
      value="false"
    >
      <template #label>
        <div class="white--text">
          No
        </div>
      </template>
    </v-radio>
  </v-radio-group>
</template>

<script>

export default {
  name: "RadioComponent",
  props: {
    itemValue: {
      type: String,
      default: null,
    }
  },

  computed: {
    model: {
      get() {
        return this.itemValue;
      },
      set(itemValue) {
        this.$emit("input", itemValue);
      },
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/advancedSearchComponents";
</style>
