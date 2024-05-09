<template>
  <div class="rounded-0 white py-3" style="position: relative">
    <h2 class="text-center">Save Your Search</h2>

    <v-btn icon dark style="position: absolute; top: 10px; right: 15px">
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
import saveSearch from "@/store";

export default {
  name: "StepperDialogHeader",

  methods: {
    /**
     * Close Stepper Dialog Box method
     */
    closeStepperDialog() {
      saveSearch.commit("saveSearch/setSaveSearchStepperDialog", false);
    },
  },
};
</script>
