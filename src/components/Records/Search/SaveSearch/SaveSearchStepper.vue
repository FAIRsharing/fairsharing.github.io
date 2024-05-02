<template>
  <v-row justify="center">
    <v-dialog
      :value="stepperDialog"
      width="900"
      persistent
      :retain-focus="false"
      @keydown.esc="closeStepperDialog()"
    >
      <!--Dialog Header -->
      <StepperDialogHeader />
      <!--Stepper Form -->
      <div>
        <v-stepper v-model="steps" non-linear class="rounded-t-0">
          <!--Stepper Header -->
          <v-stepper-header class="rounded-0">
            <!--Header 1 -->
            <v-stepper-step editable :complete="steps > 1" step="1">
              Select Policy
              <small>Optional</small>
            </v-stepper-step>

            <v-divider />
            <!--Header 2 -->
            <v-stepper-step editable :complete="steps > 2" step="2">
              Select Organisation
              <small>Optional</small>
            </v-stepper-step>

            <v-divider />
            <!--Header 3 -->
            <v-stepper-step editable step="3"> Save Search </v-stepper-step>
          </v-stepper-header>

          <!--Stepper Body -->
          <v-stepper-items>
            <!--Stepper Content 1 Policy List-->
            <v-stepper-content step="1">
              <PolicyStepper :is-super-curator="isSuperCurator" />
              <v-btn
                class="float-md-right my-3"
                :class="{ 'full-width': $vuetify.breakpoint.smAndDown }"
                color="primary"
                @click="steps = 2"
              >
                Continue
              </v-btn>
            </v-stepper-content>

            <!--Stepper Content 2 Organisation List-->
            <v-stepper-content step="2">
              <OrganisationStepper :is-super-curator="isSuperCurator" />

              <div
                class="d-flex flex-column flex-md-row justify-md-space-between my-3"
              >
                <v-btn
                  class="order-md-2"
                  :class="{
                    'mb-3': $vuetify.breakpoint.smAndDown,
                  }"
                  color="primary"
                  @click="steps = 3"
                >
                  Continue
                </v-btn>
                <v-btn
                  class="white--text order-md-1"
                  color="accent3"
                  @click="steps = 1"
                >
                  Back
                </v-btn>
              </div>
            </v-stepper-content>

            <!--Stepper Content 3 Save Search Form-->
            <v-stepper-content step="3">
              <v-form ref="searchFormRef" v-model="searchForm">
                <v-text-field
                  v-model="searchName"
                  label="Search Name"
                  :rules="[isRequired()]"
                />
                <v-text-field
                  v-model="searchComment"
                  :counter="100"
                  label="Comments"
                />
              </v-form>
              <div
                class="d-flex flex-column flex-md-row justify-md-space-between my-3"
              >
                <v-btn
                  class="order-md-2"
                  :class="{
                    'mb-3': $vuetify.breakpoint.smAndDown,
                  }"
                  color="success order-md-1"
                  :disabled="!searchForm"
                  @click="saveSearch"
                >
                  Save
                </v-btn>
                <v-btn class="white--text" color="accent3" @click="steps = 2">
                  Back
                </v-btn>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </div>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import RESTClient from "@/lib/Client/RESTClient";
import saveSearch from "@/store";
import { isRequired } from "@/utils/rules.js";

import {
  OrganisationStepper,
  PolicyStepper,
  StepperDialogHeader,
} from "./StepperComponents";

const restClient = new RESTClient();

export default {
  name: "SaveSearchStepper",
  components: { StepperDialogHeader, PolicyStepper, OrganisationStepper },
  data() {
    return {
      stepperDialog: false,
      steps: 1,
      policySelected: [],
      organisationSelected: [],
      policyList: [],
      organisationList: [],
      searchForm: false,
      searchName: "",
      searchComment: "",
      searchPolicy: "",
      isSuperCurator: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapGetters("saveSearch", [
      "getSaveSearchStepper",
      "getOrganisationSelected",
      "getPolicySelected",
    ]),
    ...mapGetters("advancedSearch", ["getAdvancedSearchQuery"]),
  },

  watch: {
    async getSaveSearchStepper(newValue) {
      this.stepperDialog = newValue;
      //When the search stepper is visible
      if (newValue) {
        await this.getUser();
        //If the user is not super curator
        if (!this.user().is_super_curator) {
          this.isSuperCurator = false;
        }
        //If the user IS super curator
        if (this.user().is_super_curator) {
          this.isSuperCurator = true;
        }
        this.searchForm = false;
      }
    },
  },

  methods: {
    isRequired,

    ...mapActions("users", ["getUser"]),

    /**
     * Save Search method
     */
    async saveSearch() {
      // console.log("this.user()::", this.user());
      let saveSearchObj = {
        name: this.searchName,
        comments: this.searchComment,
        url:
          process.env.VUE_APP_HOSTNAME + this.$route.fullPath.replace(/\//, ""),
        fairsharing_record_ids: this.getPolicySelected,
        user_ids: [this.user().id],
        organisation_ids: this.getOrganisationSelected,
        params: this.getAdvancedSearchQuery,
      };

      const outcome = await restClient.saveSearch(
        saveSearchObj,
        this.user().credentials.token
      );

      this.saveSearchProfile(outcome);
    },

    /**
     * Save the search result for the user profile
     */
    saveSearchProfile(data) {
      saveSearch.commit("saveSearch/setSaveSearchResult", data);
    },

    /**
     * Close Stepper Dialog Box method
     */
    closeStepperDialog() {
      saveSearch.commit("saveSearch/setSaveSearchStepper", false);
    },
  },
};
</script>
