<template>
  <v-card
    v-if="(allowedFields.properties)"
    class="pa-4 mt-15 d-flex flex-column"
    elevation="3"
    outlined
    color="white"
    tile
  >
    <Icon
      item="createdAt"
      size="20"
    />
    <v-card-title class="pa-0 text--primary card-title-customize">
      Attributes and Conditions
    </v-card-title>
    <div class="mt-0 pt-8">
      <OtherDatasetArray
        v-for="(item,key,index) in finalData"
        :key="item.name+'_'+index+'_'+key"
        :title="key"
        :current-item="finalData[key]"
        :current-key="key"
      />
      <!--  dataset_versioning  -->
      <DatasetBoolean field-name="data_versioning" />
      <!--  dataset_contacts  -->
      <DatasetBoolean field-name="data_contact_information" />
      <!--  dataset_citation  -->
      <DatasetBoolean field-name="citation_to_related_publications" />
      <!--  dataset_versioning  -->
      <DatasetBoolean field-name="data_access_for_pre_publication_review" />
    </div>
  </v-card>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import clearString from '@/utils/stringUtils'
import {isArray} from "lodash";
import Icon from "@/components/Icon";
import OtherDatasetArray from "@/components/Records/Record/DataProcessesAndConditions/OtherDatasetArray";
import DatasetBoolean from "@/components/Records/Record/AdditionalInfo/DatasetBoolean";

export default {
  name: "OtherDataProcesses",
  components: {
    OtherDatasetArray,
    DatasetBoolean,
    Icon
  },
  mixins: [clearString],

  data: () => {
    return {
      otherDataConditions: {},
      finalData:{},
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
    await this.getOtherData()
    this.finalData = this.otherDataConditions;
  },
  methods: {
    ...mapActions("editor", ["getAllowedFields"]),

    async getOtherData () {
      const other_data_info = [ 'data_access_condition', 'data_curation', 'resource_sustainability', 'data_deposition_condition', 'data_preservation_policy'];
      // adding data access condition if available
      if (this.allowedFields.properties !== undefined) {
        const otherDataTypes = Object.keys(this.allowedFields.properties).filter(key => other_data_info.includes(key));

        for (const key of otherDataTypes) {
          if (Object.prototype.hasOwnProperty.call(this.getField('metadata'), key)) {
            this.setAvailableData(this.getField('metadata')[key], key);
          }
        }
      }
    },

    setAvailableData(selectedNode, key) {
      // if received node is not an array
      if (!isArray(selectedNode)) {
        this.otherDataConditions[key] =  {...selectedNode}
      }
      // if received node is an array
      Object.keys(selectedNode).forEach((item) => {
        if (Object.keys(selectedNode[item]).length) {
          if (Object.keys(this.otherDataConditions).includes(key)) {
            this.otherDataConditions[key][item] = selectedNode[item]
          }
          else {
            this.otherDataConditions[key] = {}
            this.otherDataConditions[key][item] = selectedNode[item]
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
