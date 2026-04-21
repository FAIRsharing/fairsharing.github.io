<template>
  <div class="rounded-0 bg-white py-3" style="position: relative">
    <h2 class="text-center">Save Your Search</h2>

    <v-btn
      elevation="0"
      icon
      style="position: absolute; top: 10px; right: 15px"
    >
      <v-icon
        icon="fas fa-xmark fa-solid"
        size="40px"
        @click="closeStepperDialog()"
      />
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import saveSearch from "@/store";

export default {
  name: "StepperDialogHeader",
  emits: ["restartStepper"],

  computed: {
    ...mapGetters("saveSearch", ["getSaveSearchStatus"]),
  },

  methods: {
    ...mapActions("saveSearch", ["resetSaveSearchDialog"]),
    /**
     * Close Stepper Dialog Box method
     */
    closeStepperDialog() {
      if (this.getSaveSearchStatus) {
        this.resetSaveSearchDialog();
        this.$emit("restartStepper", 0);
      }
      saveSearch.commit("saveSearch/setSaveSearchStepperDialog", false);
    },
  },
};
</script>
