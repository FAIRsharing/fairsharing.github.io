<template>
  <div
    v-if="currentField && currentField.length > 0"
    class="pa-4 mt-4 data-holder"
  >
    <b class="text-h6 text-capitalize">{{ setTitle(cleanString(title)) }}</b>
    <div
      v-for="(item,index) in currentField"
      :key="item.name+'_'+index"
    >

      <!--  URLs    -->
      <div
        v-if="item.url || item.documentation_url || item.example_url "
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">URL</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <a
            class="underline-effect"
            :href="item.url"
            target="_blank"
          >
            {{ item[Object.keys(item)[0]] }}
          </a>
        </div>
      </div>

      <!-- placeholder for whatever else might be used as the key -->
      <div
        v-else
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200 text-capitalize">{{ setTitle(cleanString(Object.keys(item)[0])) }}</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          {{ item[Object.keys(item)[0]] }}
        </div>
      </div>


      <v-divider v-if="currentField.length-1!==index" />
    </div>
  </div>
</template>

<script>
import stringUtils from '@/utils/stringUtils'

export default {
  name: "DatasetArray",
  mixins: [stringUtils],
  props: {
    title: {default: null, type: String},
    currentField: {default: () => [], type: Array},
    currentKey: {default: null, type: String}
  },
  computed: {
    getCurrentKey() {
      return this.currentKey;
    }
  },
  methods: {
    setTitle(title) {
      const titles = {
        "cos top guidelines": "COS TOP Guidelines",
        "dmp development": "DMP Development",
        "updating of dmp": "Updating of DMP",
        "mandated dmp creation": "Mandated DMP creation"
      }
      if (titles[title])
        return titles[title]
      else {
        return title
      }
    },
    getUpdatedTypeTitle() {
      switch (this.getCurrentKey) {
        case "data_curation":
          return "Steps"
        case "data_deposition_condition":
          return "Restrictions"
        default:
          return "Type"
      }
    },
    getUpdatedNameTitle(){
      switch (this.getCurrentKey) {
        case "resource_sustainability":
          return "Plan"
        default:
          return "Name"
      }
    }
  }
}
</script>

<style scoped>

</style>