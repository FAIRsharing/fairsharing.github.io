<template>
  <div
    v-if="currentField && currentField.length > 0"
    class="pa-4 mt-4 data-holder"
  >
    <v-tooltip
      v-if="getDescription('head')"
      bottom
      class="d-inline-block mr-2"
    >
      <template #activator="{ on }">
        <v-icon
          size="15"
          class="mb-1"
          v-on="on"
        >
          fa-question-circle
        </v-icon>
      </template>
      {{ getDescription('head') }}
    </v-tooltip>
    <b class="text-h6 text-capitalize">{{ setTitle(cleanString(title)) }}</b>
    <div
      v-for="(item,index) in currentField"
      :key="item.name+'_'+index"
    >
      <!--  URLs    -->
      <div
        v-for="(key, keyindex) in Object.keys(item)"
        :key="key+'_'+keyindex"
      >
        <div
          class="d-flex flex-row align-center min-height-40"
        >
          <v-tooltip
            v-if="getDescription(item[key])"
            bottom
            class="d-inline-block mr-2"
          >
            <template #activator="{ on }">
              <v-icon v-on="on">
                fa-question-circle
              </v-icon>
            </template>
            {{ getDescription(item[key]) }}
          </v-tooltip>
          <b class="width-200 text-capitalize">{{ setTitle(cleanString(key)) }}</b>
          <div
            v-if="checkRegex(item[key])"
            class="d-flex full-width ml-md-12 ml-13"
          >
            <!-- See: https://github.com/FAIRsharing/fairsharing.github.io/issues/2021 -->
            <a
              class="underline-effect"
              :href="item[key]"
              target="_blank"
            >
              {{ item[key] }}
            </a>
          </div>
          <div
            v-else
            class="d-flex full-width ml-md-12 ml-13"
          >
            {{ item[key] }}
          </div>
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
    currentKey: {default: null, type: String},
    currentTooltips: {default: () => {}, type: Object},
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
        "mandated dmp creation": "Mandated DMP creation",
        "url": "URL"
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
    },
    getDescription(field) {
      let _module = this;
      if (field === 'head') {
        return _module.currentTooltips['description'] || false;
      }
      else if (_module.currentTooltips['properties'] !== undefined) {
        if (_module.currentTooltips['properties'][field] !== undefined) {
          if (_module.currentTooltips['properties'][field]['description']) {
            return _module.currentTooltips['properties'][field]['description']
          }
        }
      }
      return false;
    },
    // This is to see if the string is a URL, for the purpose of hyperlinking any which are found
    // in the record's metadata.
    checkRegex(string) {
      const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      const regex = new RegExp(expression);
      return string.match(regex);
    }
  }
}
</script>

<style scoped>

</style>