<template>
  <div class="facets card">
    <div class="card-header">
      Facets
    </div>

    <div class="card-body">
      <div
        v-for="(facetVal, key) in $store.state.records.facets"
        :key="'Facet' + key"
      >
        <div class="facet">
          <h3>{{ facetVal.filterLabel }}</h3>
        </div>

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

        <button
          type="button"
          class="btn btn-secondary"
          @click="changeSize(facetVal.filterName, 100)"
        >
          Show more
        </button>

        <button
          type="button"
          class="btn btn-secondary"
          @click="changeSize(facetVal.filterName, defaultSize)"
        >
          Show Less
        </button>

        <hr>
      </div>
    </div>
  </div>
</template>

<script>
    import paramBuilder from "./utils.js"

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
            changeSize: function(facetName, size){
                this.facetsSize[facetName] = size;
                this.$forceUpdate();
            },
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