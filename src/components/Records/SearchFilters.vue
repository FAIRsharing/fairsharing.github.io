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
          :key="key"
        >
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
    import { mapState } from "vuex"

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
            ...mapState("searchFilters", ["filters"]),
            currentPath: function(){
              return [this.$route.path,  this.$route.query]
            }
        },
        watch: {
          currentPath: async function (){
            this.$forceUpdate();
          }
        },
        methods: {
          /**
           * Apply the filters by building the new query parameters using the form data.
           */
          applyFilters: function(){
                let _module = this;
                let formData = {};
                Object.keys(_module.form.data).forEach(function(key){
                  // Need to validate/sanitize data before sending.
                  const paramValue = _module.form.data[key];
                  formData[key] = encodeURIComponent(_module.form.data[key].trim());
                  if (Object.prototype.hasOwnProperty.call(_module.stringsReplacement, paramValue)){
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
          reset: function(){
                this.form.data = {};
                this.$router.push({name: this.$route.name});
            },
          /**
           * Clean up the given string by removing underscores and fills the stringsReplacement mapper variable.
           * @param {String} string - the raw string to clean
           * @returns {String} cleanedString - the string stripped of underscores.
           */
          cleanString: function(string){
            let cleanedString = string;
            if (string.indexOf("_") > -1){
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
          cleanStrings: function(stringArray){
              let output = [];
              const _module = this;
              stringArray.forEach(function(string){
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
    float:right;
    max-height:30px;
  }

  div.filter div {
    max-height:100%;
  }

  div.filter select, div.filter input {
    width:100%;
  }

  button {
    margin-left:15px;
  }

  input {
    background: lightgrey;
  }

</style>

<style>
  .v-autocomplete__content {
    max-width:300px !important;
  }

  .filters .v-input {
    margin-top:0;
    padding-top:0;
  }

  .v-list-item__mask {
    color:black;
    background: yellowgreen !important;
  }
</style>
