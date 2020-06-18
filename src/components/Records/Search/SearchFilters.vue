<template>
  <v-container
    id="advancedSearch"
    fluid
    class="pa-0 ma-0"
  >
    <v-row>
      <v-col
        cols="12"
        class="py-0"
      >
        <form v-if="filters.length > 0">
          <v-card>
            <v-card-title class="primary white--text">
              <h3> Advanced search </h3>
            </v-card-title>

            <v-card-text class="pt-3 pb-0">
              <v-container fluid class="pb-0 mb-0">
                <v-row>
                  <v-col
                    v-for="(filter, key) in filters"
                    :key="key"
                    cols="2"
                  >
                    <div
                      v-if="filter.values"
                      class="filter"
                    >
                      <v-autocomplete
                        v-model="form.data[filter.filterName]"
                        :items="cleanStrings(filter.values)"
                        solo
                        rounded
                        :label="filter.filterLabel"
                      />
                    </div>
                    <div
                      v-else
                      class="filter"
                    >
                      <v-text-field
                        v-model="form.data[filter.filterName]"
                        :label="filter.filterLabel"
                        solo
                        rounded
                      />
                    </div>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-model="form.data['q']"
                      type="text"
                      label="Search for any string"
                      solo
                      rounded
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                type="button"
                class="success"
                @click="applyFilters()"
              >
                Search
              </v-btn>
              <v-btn
                type="button"
                class="error"
                @click="reset()"
              >
                Reset
              </v-btn>
            </v-card-actions>
          </v-card>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import {mapState} from "vuex"

    /** Component to handle the advanced search filters for the searchFairsharingRecords query.
     * @vue-data {Object} [form = {}] - variable bound to the form data through v-model
     * @vue-data {Object} [stringsReplacement = {}] - mapping between cleaned filters names and raw filters names
     * @vue-computed {Array} filters - the array of ready to use filters coming from the store
     */
    export default {
        name: "SearchFilters",
        components: {},
        data() {
            return {
                form: {
                    data: {}
                },
                stringsReplacement: {}
            }
        },
        computed: {
            ...mapState("searchFilters", ["filters"])
        },
        methods: {
            /**
             * Apply the filters by building the new query parameters using the form data.
             */
            applyFilters: function () {
                let _module = this;
                let formData = {};
                console.log(_module.form.data)
                Object.keys(_module.form.data).forEach(function (key) {
                    // Need to validate/sanitize data before sending.
                    const paramValue = _module.form.data[key];
                    formData[key] = encodeURIComponent(_module.form.data[key].trim());
                    if (Object.prototype.hasOwnProperty.call(_module.stringsReplacement, paramValue)) {
                        formData[key] = encodeURIComponent(_module.stringsReplacement[paramValue].trim());
                    }
                });
                this.$router.push({
                    name: _module.$route.name,
                    query: formData
                });
                _module.form.data = {}
            },
            /**
             * Reset the form/filters/parameters to default (go so /search?page=1)
             */
            reset: function () {
                this.form.data = {};
                this.$router.push({name: this.$route.name});
            },
            /**
             * Clean up the given string by removing underscores and fills the stringsReplacement mapper variable.
             * @param {String} string - the raw string to clean
             * @returns {String} cleanedString - the string stripped of underscores.
             */
            cleanString: function (string) {
                let cleanedString = string;
                if (string.includes('_')) {
                    cleanedString = string.replace(/_/g, " ");
                    this.stringsReplacement[cleanedString] = string;
                }
                return cleanedString;
            },
            /**
             * Clean up all the filters names using the cleanString() method of each of them.
             * @param {Array} stringArray - an array of raw filters name
             * @returns {Array} output - an array of cleaned filters name
             */
            cleanStrings: function (stringArray) {
                let output = [];
                const _module = this;
                stringArray.forEach(function (string) {
                    output.push(_module.cleanString(string))
                });
                return output;
            },
        },
    }
</script>

<style scoped>
    .filters {
        text-align: left;
    }

    div.filter {
        display: inline-block;
        width: 300px;
        float: right;
        max-height: 30px;
    }

    div.filter div {
        max-height: 100%;
    }

    div.filter select, div.filter input {
        width: 100%;
    }

    button {
        margin-left: 15px;
    }

    input {
        background: lightgrey;
    }

</style>

<style>
</style>
