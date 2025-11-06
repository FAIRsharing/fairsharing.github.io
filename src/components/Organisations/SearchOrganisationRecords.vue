<template>
  <div>
    <v-container v-if="error" fluid class="pa-0">
      <p class="pa-10">Sorry, something went wrong!</p>
    </v-container>
    <v-container v-else fluid>
      <v-data-iterator
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        :items="reformatLinks(organisation.organisationLinks)"
        :search="search"
        :sort-by="sortBy.toLowerCase()"
        :sort-desc="sortDesc"
        :footer-props="{ 'items-per-page-options': [5, 10, 25, 50, 100] }"
      >
        <!-- headers start -->
        <template #header>
          <v-toolbar dark color="blue-lighten-1" class="mb-5">
            <v-text-field
              v-model="search"
              clearable
              flat
              variant="solo-inverted"
              hide-details
              prepend-inner-icon="fa-filter"
              label="Filter records"
            />
            <template v-if="$vuetify.display.mdAndUp">
              <v-spacer />
              <v-select
                v-model="sortBy"
                flat
                variant="solo-inverted"
                hide-details
                :items="keys"
                prepend-inner-icon="fa-sort"
                label="Sort by"
              />
              <v-spacer />
              <v-btn-toggle v-model="sortDesc" mandatory>
                <v-btn size="large" variant="flat" color="blue" :value="false">
                  <v-icon>fa-arrow-up</v-icon>
                </v-btn>
                <v-btn size="large" variant="flat" color="blue" :value="true">
                  <v-icon>fa-arrow-down</v-icon>
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-toolbar>
        </template>
        <!-- headers stop -->
        <!-- data section begins -->
        <template #default="props">
          <v-row>
            <v-col v-for="item in props.items" :key="item.id" cols="12">
              <v-card>
                <v-card-title class="text-subtitle-1 font-weight-bold">
                  <RecordStatus :record="item" />
                  <a :href="'/' + item.id" target="_blank" class="ml-10">
                    {{ item.name }} {{ getAbbr(item) }}
                  </a>
                </v-card-title>
                <p
                  class="mt-2 ml-3 pr-2 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height-2lines"
                >
                  {{ item.description }}
                </p>
                <p
                  class="mt-2 ml-3 pr-2 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height-2lines"
                >
                  <v-chip variant="outlined" color="blue">
                    Relation: &nbsp;<b>{{
                      capitaliseText(cleanString(item.relation))
                    }}</b>
                  </v-chip>
                  <v-chip
                    v-if="item.isLead"
                    class="ml-2"
                    color="pink"
                    text-color="white"
                    label
                    size="x-small"
                  >
                    LEAD ORGANISATION
                  </v-chip>
                </p>
                <TagChips :record="item" class="ml-3" />

                <!-- TODO: this is a hacky placeholder -->
                <p class="pb-5" />

                <!-- TODO: change below here -->
                <!--
                <v-divider />

                <span>
                  Some information about number of standards etc. can go here. 
                </span>

                -->
                <!-- TODO: change above here -->
              </v-card>
            </v-col>
          </v-row>
        </template>
        <!-- data section ends -->
        <!-- footer ends -->
      </v-data-iterator>
      <v-btn
        class="mb-2"
        color="primary"
        size="small"
        @click="downloadResults()"
      >
        Download Record List
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import RecordStatus from "@/components/Records/Shared/RecordStatus.vue";
import TagChips from "@/components/Records/Shared/TagChips.vue";
import recordsCardUtils from "@/utils/recordsCardUtils";
import stringUtils from "@/utils/stringUtils";

export default {
  name: "SearchOrganisationRecords",
  components: { RecordStatus, TagChips },
  mixins: [recordsCardUtils, stringUtils],
  props: {
    organisation: {
      type: Object,
      default: null,
    },
  },
  // TODO: Passing in these props fails to do what's required.
  data() {
    return {
      itemsPerPageArray: [10, 20, 50, 100, 200],
      search: "",
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 5,
      sortBy: "name",
      records: [],
      loading: true,
      error: false,
      keys: ["Name", "Relation", "Registry", "Type", "Status"],
      fairSharingURL: import.meta.env.VITE_FAIRSHARING_URL,
    };
  },
  computed: {
    currentRouteQuery() {
      return this.$route.query;
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== "Name" && key !== "Description");
    },
  },
  methods: {
    // TODO: Make this work
    downloadResults() {
      var MIME_TYPE = "text/csv";
      let data = ["name,abbreviation,URL\n"];
      this.organisation.organisationLinks.forEach((link) => {
        data.push(
          `${link.fairsharingRecord.name},${link.fairsharingRecord.abbreviation || "n/a"},https://fairsharing.org/${link.fairsharingRecord.id}\n`,
        );
      });
      var blob = new Blob(data, { type: MIME_TYPE });
      window.location.href = window.URL.createObjectURL(blob);
    },
    getAbbr(record) {
      if (record.abbreviation) {
        return `(${record.abbreviation})`;
      }
      return "";
    },
    // This removes nesting from the data structure so the data iterator can handle sorting.
    reformatLinks(links) {
      let newLinks = [];
      if (links) {
        links.forEach(function (link) {
          link.fairsharingRecord.isLead = link.isLead;
          link.fairsharingRecord.relation = link.relation;
          newLinks.push(link.fairsharingRecord);
        });
      }
      return newLinks;
    },
  },
};
</script>
