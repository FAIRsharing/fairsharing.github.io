<template>
  <div>
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <div
          v-bind="attrs"
          v-on="on"
        >
          {{ keyword.label }}
        </div>
      </template>
      <div class="tooltip">
        <div :class="getChipColor(keyword)">
          <b class="mr-1">Type:</b> {{ keyword.type }}
        </div>
        <div><b class="mr-1">Name:</b> {{ keyword.label }}</div>
        <div><b class="mr-1">URL:</b> {{ keyword['iri'] }}</div>
        <div><b class="mr-1">Definition:</b> <i> {{ keyword.definitions[0] }} </i></div>
        <div>
          <b
            v-if="processArray(keyword['synonyms'])"
            class="mr-1"
          >Synonyms:</b> {{ processArray(keyword['synonyms']) }}
        </div>
      </div>
    </v-tooltip>
  </div>
</template>

<script>
    import recordsCardUtils from "@/utils/recordsCardUtils";
    export default {
        name: "KeywordTooltip",
        mixins: [recordsCardUtils],
        props: {
            keyword: {default: null, type: Object}
        },
        data() {
          return {
            tooltip: ""
          }
        },
        methods: {
          processArray(array){
            if (array.length === 0) return null;
            return JSON.stringify(array)
                  .replace(/,/g, ", ")
                  .replace(/"/g, "")
                  .replace("[", "")
                  .replace("]", "")
                  .replace(/:/g, ": ")
                  + "."
          },
        },
    }
</script>

<style scoped>
  .tooltip {
    max-width: 300px;
    padding: 5px 0;
  }

  b {
    text-decoration: underline;
  }
</style>
