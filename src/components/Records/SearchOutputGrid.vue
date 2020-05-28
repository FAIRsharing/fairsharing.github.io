<template>
  <div class="container-fluid">
    <v-row>
      <!-- top toolbar -->
      <v-col
        cols="12"
        class="mb-2"
      >
        <search-toolbar />
      </v-col>

      <!-- CHIPS -->
      <v-col
        cols="12"
        class="my-0 py-0"
      >
        <FiltersChip />
        <v-divider />
      </v-col>

      <!-- NO RESULTS -->
      <v-col v-if="hits === 0">
        <v-col cols="12">
          <div class="alert alert-danger">
            No results found for given filters.
          </div>
        </v-col>
      </v-col>

      <!-- MAIN -->
      <v-col
        v-for="record in records"
        :key="'record'+record.id"
        class="col-xl-4 col-lg-3 col-sm-6"
      >
        <v-card height="100%">
          <!-- TITLE -->
          <v-list class="my-0 py-0">
            <v-list-item
              :class="getColor(record.status, record.registry)"
              :href="'#/' + record.id"
              style="height:95px"
            >
              <v-list-item-avatar>
                <v-img
                  v-if="Object.keys(icons).includes(record.type)"
                  :src="icons[record.type]"
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="headline title white--text">
                  {{ record.name }} <span v-if="record['abbreviation']">({{ record['abbreviation'] }})</span>
                </v-list-item-title>
                <v-list-item-subtitle class="white--text">
                  {{ cleanString(record.type) }} <br>
                  <b v-if="record.registry !== 'collection'">
                    {{ cleanString(record.status) }}
                  </b>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <!-- DESCRIPTION -->
          <v-card-text class="pt-5 pb-0">
            <v-list-item three-line>
              <v-list-item-content>
                <v-list-item-title>
                  Description
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ record.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="pa-0" />
          </v-card-text>

          <!-- OTHERS -->
          <v-card-text class="py-0">
            <!-- ASSOCIATED RECORDS -->
            <v-list class="my-0 py-0">
              <v-list-item three-line>
                <v-list-item-content>
                  <v-list-item-title>
                    Associated Records:
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-layout
                      row
                      wrap
                      align-center
                      class="justify-center"
                    >
                      <v-col
                        v-for="(association, associationName, assocKey ) in associatedRecords(record)"
                        :key="'linkedRecord_' + assocKey"
                        cols="6"
                      >
                        <v-card :class="{'orange--border': association.val > 0, 'grey--border': association.val <= 0}">
                          <v-card-title
                            class="justify-center"
                            :class="{'orange--text': association.val > 0, 'grey--text': association.val <= 0}"
                          >
                            {{ association.label.toUpperCase() }}
                          </v-card-title>
                          <v-card-text
                            class="text-center display-2"
                            :class="{'orange--text': association.val > 0, 'grey--text': association.val <= 0}"
                          >
                            {{ association.val }}
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-layout>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- DOMAINS -->
            <v-list class="my-0 py-0">
              <v-list-item three-line>
                <v-list-item-content class="py-0">
                  <v-list-item-title>
                    Domains ({{ record.domains.length }} terms):
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-chip-group>
                      <v-chip
                        v-for="(term, termIndex) in record.domains"
                        :key="'term_' + termIndex"
                        class="mr-3 mb-3 blue white--text"
                      >
                        {{ term.label }}
                      </v-chip>
                    </v-chip-group>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- TAXONOMIES -->
            <v-list class="my-0 py-0">
              <v-list-item three-line>
                <v-list-item-content class="py-0">
                  <v-list-item-title>
                    Taxa types ({{ record.taxonomies.length }} terms):
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-layout
                      row
                      wrap
                      align-center
                    >
                      <v-col
                        cols="12"
                        class="py-0"
                      >
                        <v-row justify="space-around">
                          <v-col
                            cols="12"
                            class="py-0"
                          >
                            <v-chip-group>
                              <v-chip
                                v-for="(term, termIndex) in record.taxonomies"
                                :key="'term_' + termIndex"
                                class="mr-3 mb-3 green white--text"
                              >
                                {{ term.label }}
                              </v-chip>
                            </v-chip-group>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-layout>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- SUBJECTS -->
            <v-list class="my-0 py-0">
              <v-list-item three-line>
                <v-list-item-content class="py-0">
                  <v-list-item-title>
                    Subjects ({{ record.subjects.length }} terms):
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-layout
                      row
                      wrap
                      align-center
                    >
                      <v-col
                        cols="12"
                        class="py-0"
                      >
                        <v-row justify="space-around">
                          <v-col
                            cols="12"
                            class="py-0"
                          >
                            <v-chip-group>
                              <v-chip
                                v-for="(term, termIndex) in record.subjects"
                                :key="'term_' + termIndex"
                                class="mr-3 mb-3 orange white--text"
                              >
                                {{ term.label }}
                              </v-chip>
                            </v-chip-group>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-layout>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="hits === null">
      <h1 class="py-5 blue white--text text-center">
        LOADING
      </h1>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import FiltersChip from "../../components/Records/Search/FiltersChip";
  import SearchToolbar from "./Search/searchToolbar";

  export default {
    name: "SearchOutputGrid",
    components: {SearchToolbar, FiltersChip},
    data(){
      return  {
        icons: {
          collection: require("@/assets/records/collection-icon.svg"),
          journal: require("@/assets/records/policy.png"),
          society: require("@/assets/records/policy.png"),
          funder: require("@/assets/records/policy.png"),
          terminology_artefact: require("@/assets/records/terminology_artifact.png"),
          model_and_format: require("@/assets/records/model_and_format.png"),
          reporting_guideline: require("@/assets/records/reporting_guidelines.png"),
          identifier_schema: require("@/assets/records/identifier_schema.png"),
          metric: require("@/assets/records/std-metric.png"),
          repository: require("@/assets/records/db-icon.png"),
        }
      }
    },
    computed: {
      ...mapState('records', ["records", "hits", "loading"])
    },
    methods: {
      associatedRecords: function(record){
        let records = {
          standard: {
            val: 0,
            label: "standards"
          },
          database: {
            val: 0,
            label: "databases"
          },
          policy: {
            val: 0,
            label: "policies"
          },
          collection: {
            val: 0,
            label: "collections"
          },
        };
        record['recordAssociations'].forEach(function(association){
          records[association['linkedRecord'].registry].val += 1
        });
        record['reverseRecordAssociations'].forEach(function(association){
          records[association['fairsharingRecord'].registry].val += 1
        });
        return records;
      },
      getColor: function(recordStatus, recordRegistry){
        let colors = {
          ready: "primary",
          in_development: "orange",
          deprecated: "blue-grey",
          uncertain: "blue-grey lighten-3"

        };
        if (recordRegistry === "collection") return "primary";
        return colors[recordStatus];
      },
      cleanString: function(string){
        if (string) return string.replace(/_/g, " ").toUpperCase()
        return null
      }
    }
  }
</script>

<style scoped>
  a:hover {
    text-decoration: none;
  }

  .orange--border {
    border: 2px orange solid;
  }
  .grey--border {
    border: 2px #ccc solid;
  }

</style>

<style>

</style>
