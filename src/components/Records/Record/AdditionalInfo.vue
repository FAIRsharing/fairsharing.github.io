<template>
  <v-card
    v-if="(allowedFields.properties && anyDataAvailable.includes(true) )|| getField('metadata').deprecation_reason"
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <!-- Additional Information -->
    <SectionTitle title="Additional Information" />
    <!--  dataset_pid  -->
    <DatasetBoolean field-name="dataset_pid" />
    <!--  dataset_citation  -->
    <DatasetBoolean field-name="dataset_citation" />
    <!--  dataset_contacts  -->
    <DatasetBoolean field-name="dataset_contacts" />
    <!--  dataset_versioning  -->
    <DatasetBoolean field-name="dataset_versioning" />
    <!--  dataset_versioning  -->
    <DatasetBoolean field-name="dataset_prepubreview" />
    <!--  deprecation_reason  -->
    <div
      v-if="getField('metadata').deprecation_reason"
      class="d-flex pa-4 data-holder flex-row mt-4 align-center min-height-40"
    >
      <b class="width-200">Dataset Deprecation reason</b>
      <div class="d-flex full-width ml-md-12 ml-13">
        <p class="ma-0">
          {{ getField('metadata').deprecation_reason }}
        </p>
      </div>
    </div>
    <!--  dataset_preservation  -->
    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_preservation && getField('metadata').dataset_preservation!=='' && getField('metadata').dataset_preservation"
      class="d-flex pa-4 data-holder mb-4 flex-row mt-4 align-center min-height-40"
    >
      <b class="width-200">Dataset Preservation</b>
      <div class="d-flex full-width ml-md-12 ml-13">
        <a
          class="underline-effect"
          :href="getField('metadata').dataset_preservation"
          target="_blank"
        >
          {{ getField('metadata').dataset_preservation }}
        </a>
      </div>
    </div>
    <!--  access_points  -->
    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.access_points && getField('metadata').access_points && checkDataAvailableCurrentRecord(getField('metadata').access_points)"
      class="pa-4 data-holder mb-4"
    >
      <b class="text-h6">Access Points</b>
      <div
        v-for="(access_point,index) in getField('metadata').access_points"
        :key="access_point+''+index"
      >
        <div
          v-if="access_point.url"
          class="d-flex flex-row align-center min-height-40"
        >
          <b class="width-200">URL</b>
          <div class="d-flex full-width ml-md-12 ml-13">
            <a
              class="underline-effect"
              :href="access_point.url"
              target="_blank"
            >
              {{ access_point.url }}
            </a>
          </div>
        </div>
        <div
          v-if="access_point.name"
          class="d-flex flex-row align-center min-height-40"
        >
          <b class="width-200">Name</b>
          <div class="d-flex full-width ml-md-12 ml-13">
            {{ access_point.name }}
          </div>
        </div>
        <div
          v-if="access_point.type"
          class="d-flex flex-row align-center min-height-40"
        >
          <b class="width-200">Type</b>
          <div class="d-flex full-width ml-md-12 ml-13">
            <p class="ma-0">
              {{ access_point.type }}
            </p>
          </div>
        </div>
        <div
          v-if="access_point.example_url"
          class="d-flex flex-row align-center min-height-40"
        >
          <b class="width-200">Example URL</b>
          <div class="d-flex full-width ml-md-12 ml-13">
            <a
              class="underline-effect"
              target="_blank"
              :href="access_point.example_url"
            >
              {{ access_point.example_url }}
            </a>
          </div>
        </div>
        <div
          v-if="access_point.documentation_url"
          class="d-flex flex-row align-center min-height-40"
        >
          <b class="width-200">Documentation URL</b>
          <div class="d-flex full-width ml-md-12 ml-13">
            <a
              class="underline-effect"
              target="_blank"
              :href="access_point.documentation_url"
            >
              {{ access_point.documentation_url }}
            </a>
          </div>
        </div>
        <v-divider v-if="getField('metadata').access_points.length-1!==index" />
      </div>
    </div>
    <!--  dataset_curation  -->
    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_curation && getField('metadata').dataset_curation && checkDataAvailableCurrentRecord(getField('metadata').dataset_curation)"
      class="pa-4 data-holder mb-4"
    >
      <b class="text-h6">Dataset Curation</b>
      <div
        v-if="Object.keys(getField('metadata').dataset_curation).includes('url') && getField('metadata').dataset_curation.url.length && getField('metadata').dataset_curation.url"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">URL</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <a
            class="underline-effect"
            :href="getField('metadata').dataset_curation.url"
            target="_blank"
          >
            {{ getField('metadata').dataset_curation.url }}
          </a>
        </div>
      </div>
      <div
        v-if="Object.keys(getField('metadata').dataset_curation).includes('steps') && getField('metadata').dataset_curation.steps.length && getField('metadata').dataset_curation.steps"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">Steps</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').dataset_curation.steps }}
          </p>
        </div>
      </div>
    </div>
    <!--  dataset_metrics  -->
    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_metrics && getField('metadata').dataset_metrics && checkDataAvailableCurrentRecord(getField('metadata').dataset_metrics)"
      class="pa-4 data-holder mb-4"
    >
      <b class="text-h6">Dataset Metrics</b>
      <div
        v-if="Object.keys(getField('metadata').dataset_metrics).includes('url') && getField('metadata').dataset_metrics.url.length && getField('metadata').dataset_metrics.url"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">URL</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <a
            class="underline-effect"
            :href="getField('metadata').dataset_metrics.url"
            target="_blank"
          >
            {{ getField('metadata').dataset_metrics.url }}
          </a>
        </div>
      </div>
      <div
        v-if="Object.keys(getField('metadata').dataset_metrics).includes('metrics') && getField('metadata').dataset_metrics.metrics.length && getField('metadata').dataset_metrics.metrics && getField('metadata').dataset_metrics.metrics!=='no'"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">Metrics</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').dataset_metrics.metrics }}
          </p>
        </div>
      </div>
    </div>
    <!--  dataset_deposition  -->
    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_deposition && getField('metadata').dataset_deposition && checkDataAvailableCurrentRecord(getField('metadata').dataset_deposition)"
      class="pa-4 data-holder mb-4"
    >
      <b class="text-h6">Dataset Deposition</b>
      <div
        v-if="Object.keys(getField('metadata').dataset_deposition).includes('url') && getField('metadata').dataset_deposition.url.length && getField('metadata').dataset_deposition.url"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">URL</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <a
            class="underline-effect"
            :href="getField('metadata').dataset_deposition.url"
            target="_blank"
          >
            {{ getField('metadata').dataset_deposition.url }}
          </a>
        </div>
      </div>
      <div
        v-if="Object.keys(getField('metadata').dataset_deposition).includes('restrictions') && getField('metadata').dataset_deposition.restrictions.length && getField('metadata').dataset_deposition.restrictions && getField('metadata').dataset_deposition.restrictions!=='no'"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">Restrictions</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').dataset_deposition.restrictions }}
          </p>
        </div>
      </div>
    </div>
    <!--  data_access_condition  -->
    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.data_access_condition && getField('metadata').data_access_condition && checkDataAvailableCurrentRecord(getField('metadata').data_access_condition)"
      class="pa-4 data-holder mb-4"
    >
      <b class="text-h6">Data Access Condition</b>
      <div
        v-if="Object.keys(getField('metadata').data_access_condition).includes('url') && getField('metadata').data_access_condition.url.length && getField('metadata').data_access_condition.url"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">URL</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <a
            class="underline-effect"
            :href="getField('metadata').data_access_condition.url"
            target="_blank"
          >
            {{ getField('metadata').data_access_condition.url }}
          </a>
        </div>
      </div>
      <div
        v-if="Object.keys(getField('metadata').data_access_condition).includes('type') && getField('metadata').data_access_condition.type.length && getField('metadata').data_access_condition.type"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">Type</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').data_access_condition.type }}
          </p>
        </div>
      </div>
    </div>
    <!--  dataset_sustainability  -->
    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_sustainability && getField('metadata').dataset_sustainability && checkDataAvailableCurrentRecord(getField('metadata').dataset_sustainability)"
      class="pa-4 data-holder mb-4"
    >
      <b class="text-h6">Dataset Sustainability</b>
      <div
        v-if="Object.keys(getField('metadata').dataset_sustainability).includes('url') && getField('metadata').dataset_sustainability.url.length && getField('metadata').dataset_sustainability.url"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">URL</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <a
            class="underline-effect"
            :href="getField('metadata').dataset_sustainability.url"
            target="_blank"
          >
            {{ getField('metadata').dataset_sustainability.url }}
          </a>
        </div>
      </div>
      <div
        v-if="Object.keys(getField('metadata').dataset_sustainability).includes('plan') && getField('metadata').dataset_sustainability.plan.length && getField('metadata').dataset_sustainability.plan"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">Plan</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').dataset_sustainability.plan }}
          </p>
        </div>
      </div>
    </div>
    <!--  community_certification  -->
    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.community_certification && getField('metadata').community_certification && checkDataAvailableCurrentRecord(getField('metadata').community_certification)"
      class="pa-4 data-holder"
    >
      <b class="text-h6">Community Certification</b>
      <div
        v-if="Object.keys(getField('metadata').community_certification).includes('url') && getField('metadata').community_certification.url.length && getField('metadata').community_certification.url"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">URL</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <a
            class="underline-effect"
            :href="getField('metadata').community_certification.url"
            target="_blank"
          >
            {{ getField('metadata').community_certification.url }}
          </a>
        </div>
      </div>
      <div
        v-if="Object.keys(getField('metadata').community_certification).includes('type') && getField('metadata').community_certification.type.length && getField('metadata').community_certification.type"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">Type</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').community_certification.type }}
          </p>
        </div>
      </div>
    </div>
    <!--  cos_top_guidelines  -->
    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.cos_top_guidelines && getField('metadata').cos_top_guidelines && checkDataAvailableCurrentRecord(getField('metadata').cos_top_guidelines)"
      class="d-flex pa-4 data-holder flex-column mt-4 min-height-40"
    >
      <div
        v-if="getField('metadata').cos_top_guidelines.ranking"
        class="d-flex flex-wrap flex-md-nowrap"
      >
        <b
          class="mr-4"
          style="white-space: pre"
        >TOP Level Data Transparency</b>
        <p class="ma-0">
          {{ getField('metadata').cos_top_guidelines.ranking }}
        </p>
      </div>

      <div
        v-if="getField('metadata').cos_top_guidelines.comment"
        class="d-flex flex-wrap flex-md-nowrap"
      >
        <b
          class="mr-4"
          style="white-space: pre"
        >TOP qualifying comments</b>
        <p class="ma-0">
          {{ getField('metadata').cos_top_guidelines.comment }}
        </p>
      </div>
    </div>
    <!--  cross_references  -->
    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.cross_references && getField('metadata').cross_references && checkDataAvailableCurrentRecord(getField('metadata').cross_references)"
      class="pa-4 mt-4 data-holder"
    >
      <b class="text-h6">Cross References</b>
      <div
        v-for="(crossRefObj,index) in getField('metadata').cross_references"
        :key="crossRefObj+''+index"
      >
        <div class="d-flex flex-row align-center min-height-40">
          <b class="width-200">Name</b>
          <div class="d-flex full-width ml-md-12 ml-13">
            <a
              class="underline-effect"
              :href="crossRefObj.url"
              target="_blank"
            >
              {{ crossRefObj.name }}
            </a>
          </div>
        </div>
        <div class="d-flex flex-row align-center min-height-40">
          <b class="width-200">Portal</b>
          <div class="d-flex full-width ml-md-12 ml-13">
            <p class="ma-0">
              {{ crossRefObj.portal }}
            </p>
          </div>
        </div>
        <v-divider v-if="getField('metadata').cross_references.length-1!==index" />
      </div>
    </div>
  </v-card>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import SectionTitle from "@/components/Records/Record/SectionTitle";
import DatasetBoolean from "@/components/Records/Record/AdditionalInfo/DatasetBoolean";

export default {
  name: "AdditionalInfo",
  components: {DatasetBoolean, SectionTitle},
  data: () => {
    return {
      anyDataAvailable:[]
    }
  },
  computed: {
    ...mapState('record', ["currentRecord"]),
    ...mapState('editor', ["allowedFields"]),
    ...mapGetters("record", ["getField",'getRecordType']),
  },
  async mounted() {
    await this.getAllowedFields({
      type: this.getRecordType
    });
    await this.initializeData()
  },
  methods: {
    ...mapActions("editor", ["getAllowedFields"]),
    async initializeData () {
      const excludedTypes = ['associated_tools','data_processes']
      const allAllowedTypes = Object.keys(this.allowedFields.properties).filter(key => !excludedTypes.includes(key));
      for (const key of allAllowedTypes) {
        if (Object.prototype.hasOwnProperty.call(this.getField('metadata'), key)) {
          await this.checkDataAvailable(this.getField('metadata')[key]);
        }
      }
    },
    async checkDataAvailable(selectedNode) {
        Object.keys(selectedNode).forEach(key => {
        if (Object.keys(selectedNode[key]).length) {
          this.anyDataAvailable.push(true);
        }
      })
    },
    checkDataAvailableCurrentRecord(selectedNode) {
      let anyAvailableData = [];
      if(selectedNode===undefined) return false
      Object.keys(selectedNode).forEach(key => {
        if (selectedNode[key]!=="" && selectedNode[key]!=="no") {
          anyAvailableData.push(true);
        }
      })
      return anyAvailableData.includes(true);
    }
  },
}
</script>

<style scoped>
.data-holder {
  border: 1px lightgrey solid;
}
</style>
