<template>
  <div
    class="rounded-0 white py-3"
    style="position: relative"
  >
    <h2 class="text-center">
      Save Your Search
    </h2>

    <v-btn
      icon
      dark
      style="position: absolute; top: 10px; right: 15px"
    >
      <v-icon
        color="
          black"
        size="40px"
        @click="closeStepperDialog()"
      >
        mdi-close
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

import saveSearch from "@/store";

export default {
  name: "StepperDialogHeader",

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
        this.$emit("restartStepper", 1);
      }
      saveSearch.commit("saveSearch/setSaveSearchStepperDialog", false);
    },
  },
};
</script>
