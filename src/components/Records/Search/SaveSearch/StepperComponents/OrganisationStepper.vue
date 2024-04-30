<template>
  <div>
    <template v-if="user().is_super_curator">
      <v-autocomplete
        v-model="organisationSelected"
        :items="getSearchOrganisations"
        :search-input.sync="searchOrganisation"
        class="mx-4"
        flat
        hide-no-data
        hide-details
        solo
        multiple
        closable-chips
        chips
      >
        <template #selection="data">
          <v-chip
            v-bind="data.attrs"
            :input-value="data.selected"
            close
            @click="data.select"
            @click:close="remove(data.item)"
          >
            {{ data.item }}
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
      if (this.getSearchOrganisations.length) return;
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

    remove(item) {
      return removeItem(item, this.model);
    },
  },
};
</script>
