<template>
  <div class="facets card">
    <div class="card-header">
      Facets
    </div>
    <div class="card-body">
      <div
        v-for="(facetVal, facetName, key) in $store.state.records.facets"
        :key="key"
      >
        <div class="facet">
          <h3>{{ facetName }}</h3>
        </div>

        <div
          v-for="(facet, subKey) in getTopValues(facetVal.buckets, facetName)"
          :key="subKey"
          class="facet"
          @click="addParam(facetName, facet)"
        >
          <div
            v-if="!Object.prototype.hasOwnProperty.call(facet, 'key_as_string')"
            class="facetName"
          >
            {{ facet.key }}
          </div>
          <div
            v-else
            class="facetName"
          >
            {{ facet['key_as_string'] }}
          </div>
          <em> {{ facet['doc_count'] }}</em>
        </div>

        <button
          type="button"
          class="btn btn-secondary"
          @click="changeSize(facetName, 100)"
        >
          Show more
        </button>

        <hr>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "Facets",
        data() {
            return {
                defaultSize: 4,
                facetsSize: {}
            }
        },
        methods: {
            changeSize: function(facetName, size){
                this.facetsSize[facetName] = size;
                this.$forceUpdate();
            },
            getTopValues: function (buckets, facetName){
                const size = (this.facetsSize.hasOwnProperty(facetName)) ? this.facetsSize[facetName] : this.defaultSize;
                let output = [];
                buckets.forEach(function(bucket){
                    output.push(bucket);
                });
                return output.sort().slice(0, size);
            },
            addParam: async function(facetName, facetVal){
                const currentQuery = {};
                let _module = this;
                Object.keys(_module.$route.query).forEach(function(param){
                    currentQuery[param] = _module.$route.query[param]
                });

                if (Object.prototype.hasOwnProperty.call(this.$route.query, facetName)){
                    let output;
                    const currentParam = this.$route.query[facetName];
                    if (currentParam[0] === "[" && currentParam[currentParam.length -1] === "]"){
                        let b = encodeURI(facetVal.key);
                        //output = [currentParam.slice(0, currentParam.length -2), b, currentParam.slice(currentParam.length -2)].join(',');
                        output = currentParam.replace("]", `,${b}]`)
                    }
                    else {
                        output = `[${currentParam},${encodeURI(facetVal.key)}]`;
                    }
                    currentQuery[facetName] = output;
                }
                else {
                    currentQuery[facetName] = encodeURI(facetVal.key);
                }
                await this.$router.push({
                    name: _module.$route.name,
                    query: currentQuery
                })
            }
        }
        // adds watcher that reset facetsSize when URL changes
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