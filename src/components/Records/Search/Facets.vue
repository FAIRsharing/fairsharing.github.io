<template>
  <v-container
    id="facets"
    fluid
    class="pa-0 ma-0"
  >
    <v-row>
      <v-col
        cols="12"
        class="py-0"
      >
        <v-card>
          <v-card-title class="primary white--text">
            <h3> Facets </h3>
          </v-card-title>
          <v-card-text class="filters">
            <v-container fluid>
              <v-row>
                <v-col
                  v-for="(facetVal, key) in $store.state.records.facets"
                  :key="'Facet' + key"
                  cols="3"
                >
                  <v-card
                    height="100%"
                    tile
                  >
                    <v-card-title>
                      <h3> {{ facetVal.filterLabel }} </h3>
                    </v-card-title>
                    <v-card-text>
                      <div
                        v-for="(facet, subKey) in $store.getters['records/getFacet'](facetsSize[facetVal.filterName], facetVal.filterName)['values']"
                        :key="facetVal.filterName + subKey"
                        class="facet"
                        @click="addParam(facetVal.filterName, facet)"
                      >
                        <div
                          v-if="!Object.prototype.hasOwnProperty.call(facet, 'key_as_string')"
                          class="facetName"
                        >
                          {{ cleanString(facet.key) }}
                        </div>
                        <div
                          v-else
                          class="facetName"
                        >
                          {{ cleanString(facet['key_as_string']) }}
                        </div>
                        <em> {{ facet['doc_count'] }}</em>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        type="button"
                        class="primary"
                        @click="changeSize(facetVal.filterName, 100)"
                      >
                        Show more
                      </v-btn>
                      <v-btn
                        type="button"
                        class="primary"
                        @click="changeSize(facetVal.filterName, defaultSize)"
                      >
                        Show Less
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import paramBuilder from "../utils.js"


    /** Component to handle the faceting systems of the search pages.
     * @vue-data {Boolean} [defaultSize = 4] - the default number of items to show for facets.
     * @vue-computed {String} facetsSize - get the size of each facet from the recordsStore
     */
    export default {
        name: "Facets",
        data() {
            return {
                defaultSize: 4,
            }
        },
        computed: {
            facetsSize: function(){
                let sizes = {};
                this.$store.state.records.facets.forEach(function(facet){
                    sizes[facet.filterName] = 4;
                });
                return sizes;
            }
        },
        methods: {
            /**
             * Change the size of the given facet
             * @param {String} facetName - the name of the facet to change
             * @param {Number} size - the new size to set for the given facet name
             */
            changeSize: function(facetName, size){
                this.facetsSize[facetName] = size;
                this.$forceUpdate();
            },
            /**
             * Method to add the given facet as a parameter to the router query
             * @param {String} facetName - the name of the facet
             * @param {Object} facetVal - the facet value coming from the store
             */
            addParam: async function(facetName, facetVal){
                let _module = this;
                let currentQuery = paramBuilder(this.$route.query, {name: facetName, value: facetVal});

                // Only trigger the API call if the query is different
                if (JSON.stringify(currentQuery) !== JSON.stringify(this.$route.query)){
                    currentQuery["page"] = 1;
                    await _module.$router.push({
                        name: _module.$route.name,
                        query: currentQuery
                    })
                }
            },
            /**
             * Removes all underscores from given string
             * @param {String} string - any input string
             * @returns {String} updatedString - string stripped of underscores
             */
            cleanString: function(string){
              if (typeof string === "string") {
                return string.replace(/_/g, " ");
              }
              return string;
            }
        }
    }
</script>

<style scoped>

    .facet {
        text-align: left;
    }

    .facet em {
        float:right;
    }

    .facetName {
        display:inline-block;
        white-space: nowrap;
        width: 400px;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .facets button {
        right:0;
        position: relative;
    }

</style>
