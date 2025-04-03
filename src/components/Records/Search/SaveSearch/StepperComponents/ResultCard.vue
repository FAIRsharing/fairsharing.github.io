<template>
  <div>
  <!--Success -->
  <v-card
    v-if="getSaveSearchStatus"
    class="mx-auto rounded-t-0 pb-2"
  >
    <v-card-title
      class="justify-center text-white mb-4 text-center"
      style="background-color: green"
    >
      Success !!
    </v-card-title>
    <v-card-text class="pb-0 px-6">
      <p class="text-body-1">
        Your search was saved successfully. Please check the saved search table under profile page.
      </p>
    </v-card-text>

    <v-card-actions
      class="flex-column flex-md-row justify-md-space-between my-3 px-6"
    >
      <v-btn
        class="text-white order-md-2"
        :class="{
          'mb-3': $vuetify.display.smAndDown,
        }"
        color="accent2"
        variant="elevated"
        to="/accounts/profile"
        @click="resetSaveSearchDialog()"
      >
        Goto Profile page
      </v-btn>
      <v-btn
        class="text-white order-md-1"
        color="accent3"
        variant="elevated"
        @click="closeStepperDialog"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>

  <!-- Error -->
  <v-card
    v-else-if="!getSaveSearchStatus"
    class="mx-auto pb-2"
  >
    <v-card-title
      class="justify-center text-white mb-4 text-center"
      style="background-color: darkred"
    >
      Error
    </v-card-title>
    <v-card-text class="pb-0 px-6">
      <p class="text-body-1">
        Something went wrong. Please try again.
      </p>
    </v-card-text>
    <v-card-actions
      class="flex-column flex-md-row justify-md-space-between my-3 px-6"
    >
      <v-btn
        class="text-white order-md-2"
        :class="{
          'mb-3': $vuetify.display.smAndDown,
        }"
        color="accent2"
        @click="restartStepper"
      >
        Start Again
      </v-btn>
      <v-btn
        class="text-white order-md-1"
        color="secondary"
        @click="closeStepperDialog"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import saveSearch from "@/store";

export default {
  name: "ResultCard",
  emits: ["restartStepper"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters("saveSearch", ["getSaveSearchStatus"]),
  },

  methods: {
    ...mapActions("saveSearch", ["resetSaveSearchDialog"]),

    /**
     * Open & restart Stepper Dialog Box method
     */
    restartStepper() {
      this.resetSaveSearchDialog();
      this.$emit("restartStepper", 1);
      saveSearch.commit("saveSearch/setShowStepper", true);
      saveSearch.commit("saveSearch/setSaveSearchStepperDialog", true);
    },

    /**
     * Close Stepper Dialog Box method
     */
    closeStepperDialog() {
      if (this.getSaveSearchStatus) {
        this.resetSaveSearchDialog();
      }
      saveSearch.commit("saveSearch/setSaveSearchStepperDialog", false);
      this.resetSaveSearchDialog();
      this.$emit("restartStepper", 0);
    },
  },
};
</script>
