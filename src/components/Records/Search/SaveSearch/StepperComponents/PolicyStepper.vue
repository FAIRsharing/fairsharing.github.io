<template>
  <div>
    <template v-if="user().is_super_curator">
      <v-autocomplete
        v-model="policySelected"
        :items="getPolicyRecords"
        :search-input.sync="searchPolicy"
        class="mb-7"
        :loading="getLoadingStatus"
        hide-details
        multiple
        cache-items
        chips
        deletable-chips
        item-value="id"
        item-text="name"
        label="Enter text to search for policy record(s) to associate with this saved search"
      >
        <template #selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.item['id']"
            close
            @click="data.select"
            @click:close="remove(data.item['id'])"
          >
            {{ data.item["name"] }}
          </v-chip>
        </template>
        <template #no-data>
          <div
            v-show="!getLoadingStatus"
            class="py-3 px-4"
          >
            No Policy found
          </div>
          <div
            v-show="getLoadingStatus"
            class="py-3 px-4"
          >
            Loading...
          </div>
        </template>
      </v-autocomplete>
    </template>
    <template v-else>
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        height="6"
        rounded
        color="primary"
      />
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
        <p v-if="!loading">
          No policy found
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import saveSearch from "@/store";
import { removeItem } from "@/utils/advancedSearchUtils";

export default {
  name: "PolicyStepper",
  data() {
    return {
      policySelected: [],
      policyList: [],
      searchPolicy: null,
      loading: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapGetters("users", ["getUserRecords"]),
    ...mapGetters("saveSearch", ["getPolicyRecords", "getLoadingStatus"]),
  },
  watch: {
    searchPolicy(val) {
      if (!val || val.length < 3) return;
      this.fetchPolicyRecords();
    },

    policySelected(val) {
      saveSearch.commit("saveSearch/setPolicySelected", val);
    },
  },
  async mounted() {
    if (!this.user().is_super_curator) {
      this.loading = true;
      this.policyList = await this.fetchUserPolicyRecordData();
      this.loading = false;
    }
  },

  methods: {
    ...mapActions("users", ["getUser"]),
    ...mapActions("saveSearch", ["fetchPolicyRecords"]),

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
      return removeItem(item, this.policySelected);
    },
  },
};
</script>
