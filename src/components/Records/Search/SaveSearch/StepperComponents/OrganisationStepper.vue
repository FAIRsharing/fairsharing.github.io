<template>
  <div>
    <template v-if="user().is_super_curator">
      <v-autocomplete
        v-model="organisationSelected"
        v-model:search="searchOrganisation"
        :items="getSearchOrganisations"
        :loading="getLoadingStatus"
        chips
        class="mb-7 full-width stepperField"
        closable-chips
        color="primary"
        flat
        hide-details="auto"
        item-title="name"
        item-value="id"
        label="Enter text to search for organisation(s) to associate with this saved search"
        multiple
        variant="underlined"
      >
        <template #no-data>
          <div v-show="!getLoadingStatus" class="py-3 px-4">
            No organisation found
          </div>
          <div v-show="getLoadingStatus" class="py-3 px-4">Loading...</div>
        </template>
      </v-autocomplete>
    </template>
    <template v-else>
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        color="primary"
        height="6"
        rounded
      />
      <template v-if="organisationList && organisationList.length">
        <v-checkbox
          v-for="({ id, name }, index) in organisationList"
          :key="index"
          v-model="organisationSelected"
          :label="name"
          :value="id"
        />
      </template>
      <template v-else>
        <p v-if="!loading">No organisation found</p>
      </template>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

import saveSearch from "@/store";
import { removeItem } from "@/utils/advancedSearchUtils";

export default {
  name: "OrganisationStepper",
  data() {
    return {
      organisationSelected: [],
      organisationList: [],
      searchOrganisation: null,
      loading: false,
    };
  },
  computed: {
    ...mapState("users", ["user"]),
    ...mapGetters("users", ["getUserRecords"]),
    ...mapGetters("organisationSearch", [
      "getSearchOrganisations",
      "getLoadingStatus",
    ]),
  },
  watch: {
    searchOrganisation(val) {
      if (!val || val.length < 3) return;
      val = val.trim();
      this.fetchSearchOrganisations(val);
    },
    organisationSelected(val) {
      saveSearch.commit("saveSearch/setOrganisationSelected", val);
    },
  },

  async mounted() {
    if (!this.user().is_super_curator) {
      this.loading = true;
      this.organisationList = await this.fetchUserOrganisationData();
      this.loading = false;
    }
  },

  methods: {
    ...mapActions("organisationSearch", ["fetchSearchOrganisations"]),
    ...mapActions("users", ["getUser"]),

    /**
     * Returns Organisation List associated to user
     * @return {Array} - Organisation List
     */
    async fetchUserOrganisationData() {
      await this.getUser();
      let organisationsArr = this.getUserRecords.user["organisations"];
      if (organisationsArr && organisationsArr.length) {
        return organisationsArr;
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
