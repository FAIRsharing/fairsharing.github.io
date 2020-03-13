<template>
    <div
            id="advancedSearch"
            class="container"
    >
        <form
                v-if="filters.length > 0"
                class="card"
        >
            <div class="card-header">
                <h2>Advanced search</h2>
            </div>
            <div class="card-body filters">
                <div
                        v-for="(filter, key) in filters"
                        :key="computedKey(filter,key)"
                >
                    <!--                    {{filter.hasOwnProperty('key')?filtersKey[key].key:key}}-->
                    <b>{{ filter.filterLabel }}:</b>

                    <div
                            v-if="filter.values"
                            class="filter"
                    >
                        <v-autocomplete
                                v-model="form.data[filter.filterName]"
                                :items="cleanStrings(filter.values)"
                                autocomplete="true"
                                attach
                        />
                    </div>
                    <div
                            v-else
                            class="filter"
                    >
                        <input v-model="form.data[filter.filterName]">
                    </div>
                    <hr>
                </div>
            </div>
            <div class="card-footer">
                <b>String search:</b>
                <input
                        v-model="form.data['q']"
                        type="text"
                >
                <button
                        type="button"
                        class="btn btn-success"
                        @click="applyFilters()"
                >
                    Search
                </button>
                <button
                        type="button"
                        class="btn btn-danger"
                        @click="reset()"
                >
                    Reset
                </button>
            </div>
        </form>
    </div>
</template>

<script>
    import {mapState} from "vuex"
    import {isEmpty} from "lodash"

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
                    data: {},
                },
                filtersKey: [],
                stringsReplacement: {}
            }
        },
        computed: {
            ...mapState("searchFilters", ["filters"]),
        },
        created() {
            for (let i = 0; i < 13; i++) {
                this.filtersKey.push({})
            }
        },
        updated() {
            this.filtersKey = this.filters;
            let Key = 0;
            this.filtersKey.forEach(function (filter) {
                    if (Key !== 0) {
                        filter["key"] = filter.filterName + '_' + Key;
                        Key++
                    } else {
                        Key++
                    }
                }
            );
        },
        methods: {
            /**
             * Apply the filters by building the new query parameters using the form data.
             */
            applyFilters: function () {
                let _module = this;
                let formData = {};
                Object.keys(_module.form.data).forEach(function (key) {
                    // Need to validate/sanitize data before sending.
                    const paramValue = _module.form.data[key];
                    formData[key] = encodeURIComponent(_module.form.data[key].trim());
                    if (Object.prototype.hasOwnProperty.call(_module.stringsReplacement, paramValue)) {
                        formData[key] = encodeURIComponent(_module.stringsReplacement[paramValue].trim());
                    }
                });

              console.log(isEmpty(this.$route.query));
              if (isEmpty(this.$route.query) && !isEmpty(this.form.data) ) {
                this.$router.push({
                  name: _module.$route.name,
                  query: formData
                });
              }
              this.clearAdvancedSearch();

            },
            /**
             * Reset the form/filters/parameters to default (go so /search?page=1)
             */
            reset: function () {
                this.clearAdvancedSearch();
                if (!isEmpty(this.$route.query)) {
                    this.$router.push({name: this.$route.name});
                }
            },
            /**
             * Clean up the given string by removing underscores and fills the stringsReplacement mapper variable.
             * @param {String} string - the raw string to clean
             * @returns {String} cleanedString - the string stripped of underscores.
             */
            cleanString: function (string) {
                let cleanedString = string;
                if (string.indexOf("_") > -1) {
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
            computedKey: function (filter, key) {
                if (filter.hasOwnProperty('key')) {
                    if (this.filtersKey[key] !== undefined) {
                        return this.filtersKey[key].key;
                    } else {
                        return key
                    }
                } else {
                    return key
                }
            },
            clearAdvancedSearch: function () {

                this.form.data = {};


                this.filtersKey.forEach(function (filter) {
                  let Key = filter["key"];
                    if (Key !== 0) {
                        filter["key"] = filter.filterName + '_' + Key+1;
                    }
                })
            }
        }
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
    .v-autocomplete__content {
        max-width: 300px !important;
    }

    .filters .v-input {
        margin-top: 0;
        padding-top: 0;
    }

    .v-list-item__mask {
        color: black;
        background: yellowgreen !important;
    }
</style>
