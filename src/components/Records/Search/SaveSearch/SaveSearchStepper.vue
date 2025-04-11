<template>
  <v-row justify="center">
    <v-dialog
        :model-value="stepperDialog"
        width="900"
        persistent
        :retain-focus="false"
        @keydown.esc="closeStepperDialog()"
    >
      <!--Dialog Header -->
      <StepperDialogHeader @restart-stepper="restartStepper" />
      <!--Stepper Form -->
      <div v-if="getShowStepper">
        <v-stepper
            :model-value=steps
            non-linear
            class="rounded-t-0"
        >

          <!--Stepper Header -->
          <v-stepper-header class="rounded-0">
            <!--Header 1 -->
            <v-stepper-item
                editable
                :complete="steps > 0"
                value="1"
                title="Create Policy Link"
                subtitle="Optional"
                @click="steps=0"
            >
            </v-stepper-item>

            <v-divider />
            <!--Header 2 -->
            <v-stepper-item
                v-if="user().is_super_curator"
                editable
                :complete="steps > 1"
                value="2"
                title="Create Organisation Link"
                subtitle="Optional"
                @click="steps=1"
            >
            </v-stepper-item>

            <v-divider v-if="user().is_super_curator" />
            <!--Header 3 -->
            <v-stepper-item
                v-if="user().is_super_curator"
                editable
                :complete="steps > 2"
                value="3"
                title="Create User Link"
                subtitle="Optional"
                @click="steps=2"
            >
            </v-stepper-item>

            <v-divider v-if="user().is_super_curator" />
            <!--Header 4 -->
            <v-stepper-item
                editable
                :value="user().is_super_curator ? 4 : 2"
            >
              Save Search
            </v-stepper-item>
          </v-stepper-header>

          <!--Stepper Body -->
          <v-stepper-window>
            <!--Stepper Content 1 Policy List-->
            <v-stepper-window-item value="1">
              <PolicyStepper />
              <v-btn
                  class="float-md-right my-3"
                  :class="{ 'full-width': $vuetify.display.smAndDown }"
                  color="primary"
                  variant="elevated"
                  @click="steps = 1"
              >
                Continue
              </v-btn>
            </v-stepper-window-item>

            <!--Stepper Content 2 Organisation List-->
            <v-stepper-window-item
                v-if="user().is_super_curator"
                value="2"
            >
              <OrganisationStepper />

              <div
                  class="d-flex flex-column flex-md-row justify-md-space-between my-3"
              >
                <v-btn
                    class="order-md-2"
                    :class="{
                    'mb-3': $vuetify.display.smAndDown,
                  }"
                    color="primary"
                    variant="elevated"
                    @click="steps = 2"
                >
                  Continue
                </v-btn>
                <v-btn
                    class="text-white order-md-1"
                    color="accent3"
                    variant="elevated"
                    @click="steps = 0"
                >
                  Back
                </v-btn>
              </div>
            </v-stepper-window-item>

            <!--Stepper Content 3 Save Search Form-->
            <v-stepper-window-item
                v-if="user().is_super_curator"
                value="3"
            >
              <UserStepper />

              <div
                  class="d-flex flex-column flex-md-row justify-md-space-between my-3"
              >
                <v-btn
                    class="order-md-2"
                    :class="{
                    'mb-3': $vuetify.display.smAndDown,
                  }"
                    color="primary"
                    variant="elevated"
                    @click="steps = 3"
                >
                  Continue
                </v-btn>
                <v-btn
                    class="text-white order-md-1"
                    color="accent3"
                    variant="elevated"
                    @click="steps = 1"
                >
                  Back
                </v-btn>
              </div>
            </v-stepper-window-item>

            <!--Stepper Content 4 Save Search Form-->
            <v-stepper-window-item :value="user().is_super_curator ? 4 : 2">
              <v-form
                  ref="searchFormRef"
                  v-model="searchForm"
              >
                <v-text-field
                    v-model="searchName"
                    label="Search Name"
                    :rules="[isRequired()]"
                />
                <v-text-field
                    v-model="searchComment"
                    :counter="100"
                    maxlength="100"
                    label="Comments"
                />
              </v-form>
              <div
                  class="d-flex flex-column flex-md-row justify-md-space-between my-3"
              >
                <v-btn
                    class="order-md-2"
                    :class="{
                    'mb-3': $vuetify.display.smAndDown,
                  }"
                    color="success order-md-1"
                    :disabled="!searchForm"
                    :loading="loading"
                    variant="elevated"
                    @click="saveSearch"
                >
                  Save
                </v-btn>
                <v-btn
                    class="text-white"
                    color="accent3"
                    variant="elevated"
                    @click="steps = user().is_super_curator ? 2 : 0"
                >
                  Back
                </v-btn>
              </div>
            </v-stepper-window-item>
          </v-stepper-window>

        </v-stepper>
      </div>
      <ResultCard
          v-else
          @restart-stepper="restartStepper"
      />
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
      steps: 0,
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
      }
      else {
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

    /**
     * Restart the Save Search from step 1
     * @param value - Value number 1
     */
    restartStepper(value) {
      this.steps = value;
    },
  },
};
</script>
