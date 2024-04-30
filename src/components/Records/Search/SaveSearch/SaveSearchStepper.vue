<template>
  <v-row justify="center">
    <v-dialog
      :value="stepperDialog"
      width="900"
      persistent
      :retain-focus="false"
      @keydown.esc="closeStepperDialog()"
    >
      <!--Close Button -->
      <v-card class="d-flex rounded-0">
        <v-card-title class="mx-auto my-0">
          Save Your Search
        </v-card-title>
        <v-card-actions class="justify-end">
          <v-btn
            icon
            dark
            @click="closeStepperDialog()"
          >
            <v-icon
              color="black"
              size="40px"
            >
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
      <!--Stepper Form -->
      <div>
        <v-stepper
          v-model="steps"
          non-linear
          class="rounded-t-0"
        >
          <!--Stepper Header -->
          <v-stepper-header class="rounded-0">
            <!--Header 1 -->
            <v-stepper-step
              editable
              :complete="steps > 1"
              step="1"
            >
              Select Policy
              <small>Optional</small>
            </v-stepper-step>

            <v-divider />
            <!--Header 2 -->
            <v-stepper-step
              editable
              :complete="steps > 2"
              step="2"
            >
              Select Organisation
              <small>Optional</small>
            </v-stepper-step>

            <v-divider />
            <!--Header 3 -->
            <v-stepper-step
              editable
              step="3"
            >
              Save Search
            </v-stepper-step>
          </v-stepper-header>

          <!--Stepper Body -->
          <v-stepper-items>
            <!--Stepper Content 1 Policy List-->
            <v-stepper-content step="1">
              <v-text-field
                v-if="user().is_super_curator"
                id="searchPolicyRecord"
                v-model="searchPolicy"
                label="Search Policy"
                single-line
                clearable
              />
              <v-checkbox
                v-for="({ id, name }, index) in policyList"
                :key="index"
                v-model="policySelected"
                :label="name"
                :value="id"
              />
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
                <v-btn
                  class="white--text"
                  color="accent3"
                  @click="steps = 2"
                >
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

import OrganisationStepper from "@/components/Records/Search/SaveSearch/StepperComponents/OrganisationStepper.vue";
import RESTClient from "@/lib/Client/RESTClient";
import saveSearch from "@/store";
import { isRequired } from "@/utils/rules.js";

const restClient = new RESTClient();

export default {
  name: "SaveSearchStepper",
  components: { OrganisationStepper },
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
    ...mapGetters("saveSearch", ["getSaveSearchStepper"]),
    ...mapGetters("users", ["getUserRecords"]),
    ...mapGetters("advancedSearch", ["getAdvancedSearchQuery"]),
    ...mapGetters("organisationSearch", ["getSearchOrganisations"]),
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
          this.policyList = this.fetchUserPolicyRecordData();
        }
        //If the user IS super curator
        if (this.user().is_super_curator) {
          this.isSuperCurator = true;
        }
        this.searchForm = false;
      }
    },
    async searchPolicy(val) {
      if (!val || val.length < 3) {
        return;
      }
      val = val.trim();
      this.loading = true;
      await this.getUsersList(val);
      this.loading = false;
    },
  },

  methods: {
    isRequired,

    ...mapActions("users", ["getUser"]),

    /**
     * Return FairSharing Records of the Policy records maintained
     * by the user
     * @return {Array} - Policy record name used in the stepper
     */
    fetchUserPolicyRecordData() {
      let maintainedRecordsArr = this.getUserRecords.user["maintainedRecords"];
      if (maintainedRecordsArr && maintainedRecordsArr.length) {
        return maintainedRecordsArr.filter(
          (record) => record["registry"] === "Policy"
        );
      }
    },

    /**
     * Save Search method
     */
    async saveSearch() {
      // this.$refs.searchFormRef.validate();
      //Below checks if it normal user/supercurator/iscurator
      console.log("this.user()::", this.user());
      let saveSearchObj = {
        name: this.searchName,
        comments: this.searchComment,
        url:
          process.env.VUE_APP_HOSTNAME + this.$route.fullPath.replace(/\//, ""),
        fairsharing_record_ids: this.policySelected,
        user_ids: [this.user()["id"]],
        organisation_ids: this.organisationSelected,
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
