<template>
  <div>
    <template v-if="user().is_super_curator">
      <v-autocomplete
        v-model="organisationSelected"
        :items="getSearchOrganisations"
        :search-input.sync="searchOrganisation"
        class="mb-7"
        :loading="getLoadingStatus"
        hide-details
        multiple
        closable-chips
        chips
        item-value="id"
        item-text="name"
        label="Enter text to search for organisation(s) to associate with this saved search"
        no-data-text="No organisation found"
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
        <p v-if="!loading">
          No organisation found
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
     * Returns Organisation List associated to use
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
