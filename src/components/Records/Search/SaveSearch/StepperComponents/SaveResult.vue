<template>
  <!--Success -->
  <v-card v-if="getSaveSearchStatus" class="mx-auto rounded-t-0 pb-2">
    <v-card-title
      class="justify-center white--text mb-4"
      style="background-color: green"
    >
      Success !!
    </v-card-title>
    <v-card-text class="pb-0">
      <p class="text-body-1">
        Your search is saved successfully. Please check saved search table under
        profile page.
      </p>
    </v-card-text>

    <v-card-actions
      class="flex-column flex-md-row justify-md-space-between my-3"
    >
      <v-btn
        class="white--text order-md-2"
        :class="{
          'mb-3': $vuetify.breakpoint.smAndDown,
        }"
        color="accent2"
      >
        Goto Profile page
      </v-btn>
      <v-btn
        class="white--text order-md-1"
        color="accent3"
        @click="closeStepperDialog"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>

  <!-- Error -->
  <v-card v-else-if="!getSaveSearchStatus" class="mx-auto pb-2">
    <v-card-title
      class="justify-center white--text mb-4"
      style="background-color: darkred"
    >
      Error
    </v-card-title>
    <v-card-text class="pb-0">
      <p class="text-body-1">Something went wrong. Please try again.</p>
    </v-card-text>
    <v-card-actions
      class="flex-column flex-md-row justify-md-space-between my-3"
    >
      <v-btn
        class="white--text order-md-2"
        :class="{
          'mb-3': $vuetify.breakpoint.smAndDown,
        }"
        color="accent2"
        @click="openStepperDialog"
      >
        Start Again
      </v-btn>
      <v-btn
        class="white--text order-md-1"
        color="secondary"
        @click="closeStepperDialog"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import saveSearch from "@/store";

export default {
  name: "SaveResult",
  data() {
    return {};
  },
  computed: {
    ...mapGetters("saveSearch", ["getSaveSearchStatus"]),
  },

  methods: {
    ...mapActions("saveSearch", ["resetSaveSearchDialog"]),
    /**
     * Open Stepper Dialog Box method
     */
    openStepperDialog() {
      saveSearch.commit("saveSearch/setShowStepper", true);
      this.resetSaveSearchDialog();
    },

    /**
     * Close Stepper Dialog Box method
     */
    closeStepperDialog() {
      saveSearch.commit("saveSearch/setSaveSearchStepperDialog", false);
    },
  },
};
</script>
