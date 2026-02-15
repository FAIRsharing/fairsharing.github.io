<template>
  <div>
    <v-container v-if="error" class="pa-0" fluid>
      <p class="pa-10">Sorry, something went wrong!</p>
    </v-container>
    <v-container v-else fluid>
      <v-data-iterator
        :items="reformatLinks(organisation.organisationLinks)"
        :items-per-page="itemsPerPage"
        :page="page"
        :search="search"
        :sort-by="sortData"
        multi-sort
      >
        <!-- headers start -->
        <template #header="{ pagination, options, updateOptions }">
          <v-data-table-footer
            v-if="!noPagination"
            :options="options"
            :pagination="pagination"
            items-per-page-text="Records per page:"
            @update:options="updateOptions"
          />
          <v-toolbar class="mb-5 px-4 py-1" color="blue-lighten-1" dark>
            <v-text-field
              :model-value="search"
              clearable
              flat
              hide-details
              label="Filter these results"
              prepend-inner-icon="fas fa-solid fa-filter"
              variant="solo"
              width="125"
              @update:model-value="search = $event"
            />
            <template v-if="$vuetify.display.mdAndUp">
              <v-spacer />
              <v-select
                v-model="sortBy"
                :items="keys"
                flat
                hide-details
                label="Sort by"
                prepend-inner-icon="fas fa-solid fa-arrow-up-short-wide"
                variant="solo"
                width="125"
              />
              <v-spacer />
              <v-btn-toggle
                :model-value="sortDesc"
                mandatory
                @update:model-value="sortDesc = $event"
              >
                <v-btn :value="false" color="blue" size="large" variant="flat">
                  <v-icon icon="fas fa-solid fa-arrow-up" />
                </v-btn>
                <v-btn :value="true" color="blue" size="large" variant="flat">
                  <v-icon icon="fas fa-solid fa-arrow-down" />
                </v-btn>
              </v-btn-toggle>
            </template>
          </v-toolbar>
        </template>
        <!-- headers stop -->
        <!-- data section begins -->
        <template #default="{ items }">
          <v-row>
            <v-col v-for="item in items" :key="item.raw.name" cols="12">
              <v-card>
                <v-card-title
                  class="text-title-1 font-weight-bold d-flex align-center"
                >
                  <RecordStatus :record="item.raw" />
                  <a
                    :href="fairSharingURL + item.raw.id"
                    class="ml-10"
                    style="white-space: normal"
                    target="_blank"
                  >
                    {{ item.raw.name }} {{ getAbbr(item) }}
                  </a>
                </v-card-title>
                <p
                  class="mt-2 ml-3 pr-2 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height-2lines"
                >
                  {{ item.raw.description }}
                </p>
                <p
                  class="mt-2 ml-3 pr-2 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height-2lines"
                >
                  <v-chip color="blue" variant="outlined">
                    Relation: &nbsp;<b>{{
                      capitaliseText(cleanString(item.raw.relation))
                    }}</b>
                  </v-chip>
                  <v-chip
                    v-if="item.isLead"
                    class="ml-2"
                    color="pink"
                    label
                    size="x-small"
                    variant="flat"
                  >
                    LEAD ORGANISATION
                  </v-chip>
                </p>
                <TagChips :record="item.raw" class="ml-10" />
                <p class="pb-5" />
              </v-card>
            </v-col>
          </v-row>
        </template>
        <!-- data section ends -->
        <!-- footer start -->
        <template
          v-if="!noPagination"
          #footer="{ pagination, options, updateOptions }"
        >
          <v-data-table-footer
            :options="options"
            :pagination="pagination"
            items-per-page-text="Records per page:"
            @update:options="updateOptions"
          />
        </template>
        <!-- footer ends -->
        <template #no-data> No results found.</template>
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
    // When there is no data in the table, hide pagination
    noPagination() {
      return (
        Array.isArray(
          this.reformatLinks(this.organisation.organisationLinks),
        ) && !this.reformatLinks(this.organisation.organisationLinks).length
      );
    },

    sortData() {
      switch (this.sortBy) {
      case "Name":
        return [{ key: "name", order: this.sortDesc ? "desc" : "asc" }];
      case "Registry":
        return [{ key: "registry", order: this.sortDesc ? "desc" : "asc" }];
      case "Type":
        return [{ key: "type", order: this.sortDesc ? "desc" : "asc" }];
      case "Status":
        return [{ key: "status", order: this.sortDesc ? "desc" : "asc" }];
      case "Description":
        return [
          { key: "description", order: this.sortDesc ? "desc" : "asc" },
        ];
      default:
        return [{ key: "name", order: this.sortDesc ? "desc" : "asc" }];
      }
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
