<template>
  <v-card
    v-if="(allowedFields.properties|| getField('metadata').deprecation_reason) && finalDataItemsHasLength"
    class="pa-4 d-flex flex-column"
    outlined
    :color="backColor"
    tile
    elevation="3"
  >
    <!-- Additional Information -->
    <SectionTitle title="Additional Information" />

    <!--  deprecation_reason (one of a kind)  -->
    <div
      v-if="getField('metadata').deprecation_reason"
      class="d-flex pa-4 data-holder flex-row mt-4 align-center min-height-40"
      style="border:2px dotted darkorange"
    >
      <b class="width-200">Dataset Deprecation reason</b>
      <div class="d-flex full-width ml-md-12 ml-13">
        <p class="ma-0 warning white--text">
          {{ getField('metadata').deprecation_reason }}
        </p>
      </div>
    </div>
    <!--  dynamically reading all allowed additionalInfo fields and its items -->
    <dataset-array
      v-for="(item,key,index) in finalData"
      :key="item.name+'_'+index+'_'+key"
      :title="key"
      :current-field="finalData[key]"
      :current-tooltips="allowedFields['properties'][key]"
      :current-key="key"
    />
  </v-card>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import SectionTitle from "@/components/Records/Record/SectionTitle";
import DatasetArray from "@/components/Records/Record/AdditionalInfo/DatasetArray";
import {isArray} from "lodash";

export default {
  name: "AdditionalInfo",
  components: {DatasetArray, SectionTitle},
  props: {
    backColor:{
      default:null,
      type: String,
    }
  },
  data: () => {
    return {
      finalData:{},
      tempData:{},
      finalDataItemsHasLength: true
    }
  },
  computed: {
    ...mapState('editor', ["allowedFields"]),
    ...mapGetters("record", ["getField",'getRecordType']),
  },
  async mounted() {
    await this.getAllowedFields({
      type: this.getRecordType
    });
    await this.initializeData()
    await this.$nextTick()
    this.finalData = this.tempData;
    this.finalDataItemsHasLength = Object.keys(this.finalData).some(key => this.finalData[key].length>=1);
  },
  methods: {
    ...mapActions("editor", ["getAllowedFields"]),
    async initializeData () {
      const excludedTypes = ['associated_tools','data_processes_and_conditions','data_versioning','citation_to_related_publications','data_contact_information','data_access_for_pre_publication_review', 'data_access_condition', 'data_curation', 'data_deposition_condition', 'data_preservation_policy', 'resource_sustainability', 'certifications_and_community_badges']
      /* istanbul ignore else */
      if (this.allowedFields.properties !== undefined) {
        const allAllowedTypes = Object.keys(this.allowedFields.properties).filter(key => !excludedTypes.includes(key));
        for (const key of allAllowedTypes) {
          if (Object.prototype.hasOwnProperty.call(this.getField('metadata'), key)) {
            this.setAvailableData(this.getField('metadata')[key],key);
          }
        }
      }
    },
    setAvailableData(selectedNode, key) {
      // if received node is not an array
      if (!isArray(selectedNode)) {
        this.tempData[key] = []
        Object.keys(selectedNode).forEach(item_key => {
          this.tempData[key].push({[item_key]: selectedNode[item_key]})
        })
        return
      }
      // if received node is an array
      Object.keys(selectedNode).forEach((item) => {
        if (Object.keys(selectedNode[item]).length) {
          if (Object.keys(this.tempData).includes(key)) {
            this.tempData[key].push(selectedNode[item])
          }
          else {
            this.tempData[key] = []
            this.tempData[key].push(selectedNode[item])
          }
        }
      })
    },
  },
}
</script>

<style scoped>
.data-holder {
  border: 1px lightgrey solid;
}
</style>