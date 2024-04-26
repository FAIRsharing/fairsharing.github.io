<template>
  <v-row justify="center">
    <v-dialog
      :value="stepperDialog"
      persistent
      :retain-focus="false"
      @keydown.esc="closeStepperDialog()"
    >
      <div>
        <v-stepper v-model="steps">
          <v-stepper-header>
            <!--Header 1 -->
            <v-stepper-step :complete="steps > 1" step="1">
              Select Policy
              <small>Optional</small>
            </v-stepper-step>

            <v-divider />
            <!--Header 2 -->
            <v-stepper-step :complete="steps > 2" step="2">
              Select Organisation
              <small>Optional</small>
            </v-stepper-step>
            <v-divider />
            <!--Header 3 -->
            <v-stepper-step step="3"> Save Search </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <!--Content 1 Policy List-->
            <v-stepper-content step="1">
              <v-checkbox
                v-for="({ id, name }, index) in policyList"
                :key="index"
                v-model="policySelected"
                :label="name"
                :value="id"
              />
              <v-btn color="primary" @click="steps = 2"> Continue </v-btn>
            </v-stepper-content>
            <!--Content 2 Organisation List-->
            <v-stepper-content step="2">
              <v-checkbox
                v-for="({ id, name }, index) in organisationList"
                :key="index"
                v-model="organisationSelected"
                :label="name"
                :value="id"
              />
              <v-btn text @click="steps = 1"> Back </v-btn>
              <v-btn color="primary" @click="steps = 3"> Continue </v-btn>
            </v-stepper-content>
            <!--Content 3 Save Search Form-->
            <v-stepper-content step="3">
              <v-btn text @click="steps = 2"> Back </v-btn>
              <v-btn color="primary" @click="steps = 3"> Continue </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </div>
      <v-card-actions>
        <v-btn
          color="green"
          variant="text"
          class="white--text order-md-2"
          :class="{
            'mb-3': $vuetify.breakpoint.smAndDown,
          }"
          :width="$vuetify.breakpoint.smAndDown ? '100%' : '250'"
        >
          Proceed
        </v-btn>
        <v-btn
          color="accent3"
          variant="text"
          class="white--text order-md-1 ml-0"
          :width="$vuetify.breakpoint.smAndDown ? '100%' : '250'"
          @click="closeStepperDialog()"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import saveSearch from "@/store";

export default {
  name: "SaveSearchStepper",
  data() {
    return {
      stepperDialog: false,
      steps: 1,
      policySelected: [],
      organisationSelected: [],
      policyList: [],
      organisationList: [],
    };
  },
  computed: {
    ...mapGetters("saveSearch", ["getSaveSearchStepper"]),
    ...mapGetters("users", ["getUserRecords"]),
  },
  watch: {
    async getSaveSearchStepper(newValue) {
      this.stepperDialog = newValue;
      if (newValue) {
        await this.getUser();
        this.policyList = this.fetchUserRecordData();
        this.organisationList = this.fetchUserOrganisationData();
      }
    },
  },
  async mounted() {},
  methods: {
    ...mapActions("users", ["getUser"]),
    /**
     * Return FairSharing Records of the Policy records maintained
     * by the user
     * @return {Array} - Policy record name used in the stepper
     */
    fetchUserRecordData() {
      console.log("this.getUserRecords", this.getUserRecords);
      let maintainedRecordsArr = this.getUserRecords.user["maintainedRecords"];
      if (maintainedRecordsArr && maintainedRecordsArr.length) {
        return maintainedRecordsArr.filter(
          (record) => record["registry"] === "Policy"
        );
      }
    },

    /**
     * Returns Organisation List associated to use
     * @return {Array} - Organisation List
     */
    fetchUserOrganisationData() {
      let organisationsArr = this.getUserRecords.user["organisations"];

      if (organisationsArr && organisationsArr.length) {
        return organisationsArr;
      }
    },

    closeStepperDialog() {
      saveSearch.commit("saveSearch/setSaveSearchStepper", false);
    },
  },
};
</script>
