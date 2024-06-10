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
      <div v-if="getShowStepper">
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
            <v-stepper-step
              v-if="user().is_super_curator"
              editable
              :complete="steps > 3"
              step="3"
            >
              Select User
              <small>Optional</small>
            </v-stepper-step>

            <v-divider v-if="user().is_super_curator" />
            <!--Header 4 -->
            <v-stepper-step editable :step="isSuperCurator ? 4 : 3">
              Save Search
            </v-stepper-step>
          </v-stepper-header>

          <!--Stepper Body -->
          <v-stepper-items>
            <!--Stepper Content 1 Policy List-->
            <v-stepper-content step="1">
              <PolicyStepper />
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
              <OrganisationStepper />

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
            <v-stepper-content v-if="isSuperCurator" step="3">
              <UserStepper />

              <div
                class="d-flex flex-column flex-md-row justify-md-space-between my-3"
              >
                <v-btn
                  class="order-md-2"
                  :class="{
                    'mb-3': $vuetify.breakpoint.smAndDown,
                  }"
                  color="primary"
                  @click="steps = 4"
                >
                  Continue
                </v-btn>
                <v-btn
                  class="white--text order-md-1"
                  color="accent3"
                  @click="steps = 2"
                >
                  Back
                </v-btn>
              </div>
            </v-stepper-content>

            <!--Stepper Content 4 Save Search Form-->
            <v-stepper-content :step="isSuperCurator ? 4 : 3">
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
                  :loading="loading"
                  @click="saveSearch"
                >
                  Save
                </v-btn>
                <v-btn
                  class="white--text"
                  color="accent3"
                  @click="steps = isSuperCurator ? 3 : 2"
                >
                  Back
                </v-btn>
              </div>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </div>
      <ResultCard v-else @restartStepper="restartStepper" />
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
  ResultCard,
  StepperDialogHeader,
  UserStepper,
} from "./StepperComponents";

const restClient = new RESTClient();

export default {
  name: "SaveSearchStepper",
  components: {
    StepperDialogHeader,
    PolicyStepper,
    OrganisationStepper,
    UserStepper,
    ResultCard,
  },
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
      loading: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapGetters("saveSearch", [
      "getSaveSearchStepperDialog",
      "getOrganisationSelected",
      "getPolicySelected",
      "getUserSelected",
      "getShowStepper",
    ]),
    ...mapGetters("advancedSearch", ["getAdvancedSearchQuery"]),
  },

  watch: {
    async getSaveSearchStepperDialog(newValue) {
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
      this.loading = true;
      let saveSearchObj = {
        name: this.searchName,
        comments: this.searchComment,
        url: window.location.origin + this.$route.fullPath,
        fairsharing_record_ids: this.getPolicySelected,
        user_ids:
          this.getUserSelected && this.getUserSelected.length
            ? this.getUserSelected
            : [this.user().id],
        organisation_ids: this.getOrganisationSelected,
        params: this.getAdvancedSearchQuery,
      };

      const searchResult = await restClient.saveSearch(
        saveSearchObj,
        this.user().credentials.token
      );

      //Hide stepper and show result section
      saveSearch.commit("saveSearch/setShowStepper", false);

      //Check the success or error response
      if (searchResult?.error) {
        saveSearch.commit("saveSearch/setSaveSearchStatus", false);
      } else {
        saveSearch.commit("saveSearch/setSaveSearchStatus", true);
      }

      this.saveSearchProfile(searchResult);
      this.loading = false;
    },

    /**
     * Save the search result for the user profile
     */
    saveSearchProfile(data) {
      saveSearch.commit("saveSearch/setSaveSearchResult", data);
      //Reset the textfields
      this.searchName = "";
      this.searchComment = "";
    },

    /**
     * Close Stepper Dialog Box method
     */
    closeStepperDialog() {
      saveSearch.commit("saveSearch/setSaveSearchStepperDialog", false);
    },

    restartStepper(value) {
      this.steps = value;
    },
  },
};
</script>
