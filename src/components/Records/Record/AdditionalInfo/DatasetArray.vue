<template>
  <div
    v-if="currentField && currentField.length > 0"
    class="pa-4 mt-4 data-holder"
  >
    <b class="text-h6 text-capitalize">{{ setCOS_title(cleanString(title)) }}</b>
    <div
      v-for="(item,index) in currentField"
      :key="item.name+'_'+index"
    >
      <!--  Name    -->
      <div
        v-if="item.name"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">{{ getUpdatedNameTitle() }}</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          {{ item.name }}
        </div>
      </div>

      <!--  Type    -->
      <div
        v-if="item.type"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">{{ getUpdatedTypeTitle() }}</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ item.type }}
          </p>
        </div>
      </div>

      <!--  URL    -->
      <div
        v-if="item.url"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">URL</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <a
            class="underline-effect"
            :href="item.url"
            target="_blank"
          >
            {{ item.url }}
          </a>
        </div>
      </div>

      <!--  Portal    -->
      <div
        v-if="item.portal"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">Portal</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ item.portal }}
          </p>
        </div>
      </div>

      <!--  ExampleURL    -->
      <div
        v-if="item.example_url"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">Example URL</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <a
            class="underline-effect"
            target="_blank"
            :href="item.example_url"
          >
            {{ item.example_url }}
          </a>
        </div>
      </div>

      <!--  DocumentationURL   -->
      <div
        v-if="item.documentation_url"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">Documentation URL</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <a
            class="underline-effect"
            target="_blank"
            :href="item.documentation_url"
          >
            {{ item.documentation_url }}
          </a>
        </div>
      </div>

      <!--  cos_top_guidelines  -->
      <!--  cos_top_guidelines.ranking    -->
      <div
        v-if="item.ranking"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">TOP Level Data Transparency</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ item.ranking }}
          </p>
        </div>
      </div>
      <!--  cos_top_guidelines.comments    -->
      <div
        v-if="item.comment"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">TOP qualifying comments</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ item.comment }}
          </p>
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
    setCOS_title(title) {
      if (title === "cos top guidelines")
        return "COS TOP Guidelines"
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