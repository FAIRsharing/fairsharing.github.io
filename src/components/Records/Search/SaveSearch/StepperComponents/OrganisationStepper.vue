<template>
  <div>
    <template v-if="user().is_super_curator">
      <v-autocomplete
        v-model="organisationSelected"
        :items="getSearchOrganisations"
        :search-input.sync="searchOrganisation"
        class="mb-7"
        :loading="getLoadingStatus"
        hide-no-data
        hide-details
        multiple
        closable-chips
        chips
        item-value="id"
        item-text="name"
        label="Enter text to search organisation"
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
        No Organisation found.
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
  props: {
    isSuperCurator: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      organisationSelected: [],
      organisationList: [],
      searchOrganisation: null,
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
    isSuperCurator: {
      async handler(newValue) {
        if (!newValue) {
          this.organisationList = await this.fetchUserOrganisationData();
        }
      },
      deep: true,
      immediate: true,
    },

    searchOrganisation(val) {
      if (!val || val.length < 3) return;
      val = val.trim();
      this.fetchSearchOrganisations(val);
    },
    organisationSelected(val) {
      saveSearch.commit("saveSearch/setOrganisationSelected", val);
    },
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
