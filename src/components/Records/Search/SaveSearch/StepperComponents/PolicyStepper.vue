<template>
  <div>
    <template v-if="user().is_super_curator">
      <v-autocomplete
        v-model="organisationSelected"
        :items="getSearchOrganisations"
        :search-input.sync="searchOrganisation"
        class="mb-7"
        hide-no-data
        hide-details
        multiple
        closable-chips
        chips
        item-value="id"
        item-text="name"
        label="Enter text to search policy record"
        no-data-text="No organisation found"
      >
        <template #selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.name"
            close
            @click="data.select"
            @click:close="remove(data.item['name'])"
          >
            {{ data.item["name"] }}
          </v-chip>
        </template>
      </v-autocomplete>
    </template>
    <template v-else>
      <template v-if="policyList && policyList.length">
        <v-checkbox
          v-for="({ id, name }, index) in policyList"
          :key="index"
          v-model="policySelected"
          :label="name"
          :value="id"
        />
      </template>
      <template v-else>
        No policy found.
      </template>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import { removeItem } from "@/utils/advancedSearchUtils";

export default {
  name: "PolicyStepper",
  props: {
    isSuperCurator: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      policySelected: [],
      policyList: [],
      searchPolicy: null,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapGetters("users", ["getUserRecords"]),
    ...mapGetters("organisationSearch", ["getSearchOrganisations"]),
  },
  watch: {
    isSuperCurator: {
      async handler(newValue) {
        if (!newValue) {
          this.policySelected = await this.fetchUserPolicyRecordData();
        }
      },
      deep: true,
      immediate: true,
    },
    searchPolicy(val) {
      if (!val || val.length < 3) return;
      val = val.trim();
      this.getUsersList(val);
    },
  },

  methods: {
    ...mapActions("organisationSearch", ["fetchSearchOrganisations"]),
    ...mapActions("users", ["getUser"]),

    /**
     * Return FairSharing Records of the Policy records maintained
     * by the user
     * @return {Array} - Policy record name used in the stepper
     */
    async fetchUserPolicyRecordData() {
      await this.getUser();
      let maintainedRecordsArr = await this.getUserRecords.user[
        "maintainedRecords"
      ];
      if (maintainedRecordsArr && maintainedRecordsArr.length) {
        return maintainedRecordsArr.filter(
          (record) => record["registry"] === "Policy"
        );
      }
      return [];
    },

    /**
     * Remove the selected item from selection
     * @param item
     * @return {Array}
     */
    remove(item) {
      return removeItem(item, this.organisationSelected);
    },
  },
};
</script>
