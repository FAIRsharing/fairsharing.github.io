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
      <v-checkbox
        v-for="({ id, name }, index) in organisationList"
        :key="index"
        v-model="organisationSelected"
        :label="name"
        :value="id"
      />
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";

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
    ...mapGetters("organisationSearch", ["getSearchOrganisations"]),
  },
  watch: {
    isSuperCurator(newValue) {
      if (!newValue) {
        this.organisationSelected = this.fetchUserOrganisationData();
      }
    },
    searchOrganisation(val) {
      if (!val || val.length < 3) return;
      val = val.trim();
      this.fetchSearchOrganisations(val);
    },
  },

  methods: {
    ...mapActions("organisationSearch", ["fetchSearchOrganisations"]),

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
