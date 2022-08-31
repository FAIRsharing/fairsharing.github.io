<template>
  <v-card
    v-if="(allowedFields.properties)"
    class="pa-4 mt-15 d-flex flex-column"
    elevation="3"
    outlined
    color="white"
    tile
  >
    <OtherDatasetArray
      v-for="(item,key,index) in finalData"
      :key="item.name+'_'+index+'_'+key"
      :title="key"
      :current-item="finalData[key]"
      :current-key="key"
    />
  </v-card>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import clearString from '@/utils/stringUtils'
import {isArray} from "lodash";
import OtherDatasetArray from "@/components/Records/Record/DataProcessesAndConditions/OtherDatasetArray";

export default {
  name: "OtherDataProcesses",
  components: {
    OtherDatasetArray
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
      const other_data_info = [ 'data_access_condition', 'data_curation', 'data_deposition_condition', 'data_preservation_policy'];
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
