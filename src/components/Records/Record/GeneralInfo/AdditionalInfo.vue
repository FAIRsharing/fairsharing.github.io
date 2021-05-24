<template>
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <!-- Additional Information -->
    <SectionTitle
      title="Additional Information"
      :inactive-section="allowedFields.properties===undefined || allowedFields.properties===null"
    />
    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_pid && getField('metadata').dataset_pid==='yes'"
      class="d-flex flex-row mt-4 align-center min-height-40"
    >
      <b class="width-200">Dataset pid</b>
      <div class="d-flex full-width ml-md-12 ml-13">
        <p class="ma-0">
          {{ getField('metadata').dataset_pid }}
        </p>
      </div>
    </div>

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_citation && getField('metadata').dataset_citation==='yes'"
      class="d-flex flex-row mt-4 align-center min-height-40"
    >
      <b class="width-200">Dataset Citation</b>
      <div class="d-flex full-width ml-md-12 ml-13">
        <p class="ma-0">
          {{ getField('metadata').dataset_citation }}
        </p>
      </div>
    </div>

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_contacts && getField('metadata').dataset_contacts==='yes'"
      class="d-flex flex-row mt-4 align-center min-height-40"
    >
      <b class="width-200">Dataset Contacts</b>
      <div class="d-flex full-width ml-md-12 ml-13">
        <p class="ma-0">
          {{ getField('metadata').dataset_contacts }}
        </p>
      </div>
    </div>

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_versioning && getField('metadata').dataset_versioning==='yes'"
      class="d-flex flex-row mt-4 align-center min-height-40"
    >
      <b class="width-200">Dataset Versioning</b>
      <div class="d-flex full-width ml-md-12 ml-13">
        <p class="ma-0">
          {{ getField('metadata').dataset_versioning }}
        </p>
      </div>
    </div>

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_prepubreview && getField('metadata').dataset_prepubreview==='yes'"
      class="d-flex flex-row mt-4 align-center min-height-40"
    >
      <b class="width-200">Dataset Pre-Publication review</b>
      <div class="d-flex full-width ml-md-12 ml-13">
        <p class="ma-0">
          {{ getField('metadata').dataset_prepubreview }}
        </p>
      </div>
    </div>

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.deprecation_reason && getField('metadata').deprecation_reason==='yes'"
      class="d-flex flex-row mt-4 align-center min-height-40"
    >
      <b class="width-200">Dataset Deprecation reason</b>
      <div class="d-flex full-width ml-md-12 ml-13">
        <p class="ma-0">
          {{ getField('metadata').deprecation_reason }}
        </p>
      </div>
    </div>

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_preservation && (getField('metadata').dataset_preservation!=='' && getField('metadata').dataset_preservation!==null && getField('metadata').dataset_preservation!==undefined)"
      class="d-flex flex-row mt-4 align-center min-height-40"
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

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_curation && checkDataAvailable(getField('metadata').dataset_curation)"
      class="pa-4 data-holder"
    >
      <b class="text-h6">Dataset Curation</b>
      <div
        v-if="Object.keys(getField('metadata').dataset_curation).includes('url') && getField('metadata').dataset_curation.url!=='' && getField('metadata').dataset_curation.url!==null && getField('metadata').dataset_curation.url!==undefined"
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
        v-if="Object.keys(getField('metadata').dataset_curation).includes('steps') && getField('metadata').dataset_curation.steps!=='' && getField('metadata').dataset_curation.steps!==null && getField('metadata').dataset_curation.steps!==undefined"
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

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_metrics && checkDataAvailable(getField('metadata').dataset_metrics)"
      class="pa-4 mt-4 data-holder"
    >
      <b class="text-h6">Dataset Metrics</b>
      <div class="d-flex flex-row align-center min-height-40">
        <b class="width-200">URL</b>
        <div
          v-if="Object.keys(getField('metadata').dataset_metrics).includes('url') && getField('metadata').dataset_metrics.url!=='' && getField('metadata').dataset_metrics.url!==null && getField('metadata').dataset_metrics.url!==undefined"
          class="d-flex full-width ml-md-12 ml-13"
        >
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
        v-if="Object.keys(getField('metadata').dataset_metrics).includes('metrics') && getField('metadata').dataset_metrics.metrics!=='' && getField('metadata').dataset_metrics.metrics!==null && getField('metadata').dataset_metrics.metrics!==undefined"
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

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_deposition && checkDataAvailable(getField('metadata').dataset_deposition)"
      class="pa-4 mt-4 data-holder"
    >
      <b class="text-h6">Dataset Deposition</b>
      <div
        v-if="Object.keys(getField('metadata').dataset_deposition).includes('url') && getField('metadata').dataset_deposition.url!=='' && getField('metadata').dataset_deposition.url!==null && getField('metadata').dataset_deposition.url!==undefined"
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
        v-if="Object.keys(getField('metadata').dataset_deposition).includes('restrictions') && getField('metadata').dataset_deposition.restrictions!=='' && getField('metadata').dataset_deposition.restrictions!==null && getField('metadata').dataset_deposition.restrictions!==undefined"
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

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.data_access_condition && checkDataAvailable(getField('metadata').data_access_condition)"
      class="pa-4 mt-4 data-holder"
    >
      <b class="text-h6">Data Access Condition</b>
      <div
        v-if="Object.keys(getField('metadata').data_access_condition).includes('url') && getField('metadata').data_access_condition.url!=='' && getField('metadata').data_access_condition.url!==null && getField('metadata').data_access_condition.url!==undefined"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">URL</b>
        <div
          class="d-flex full-width ml-md-12 ml-13"
        >
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
        v-if="Object.keys(getField('metadata').data_access_condition).includes('type') && getField('metadata').data_access_condition.type!=='' && getField('metadata').data_access_condition.type!==null && getField('metadata').data_access_condition.type!==undefined"
        class="d-flex flex-row align-center min-height-40"
      >
        <b class="width-200">Type</b>
        <div
          class="d-flex full-width ml-md-12 ml-13"
        >
          <p class="ma-0">
            {{ getField('metadata').data_access_condition.type }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.dataset_sustainability && checkDataAvailable(getField('metadata').dataset_sustainability)"
      class="pa-4 mt-4 data-holder"
    >
      <b class="text-h6">Dataset Sustainability</b>
      <div
        v-if="Object.keys(getField('metadata').dataset_sustainability).includes('url') && getField('metadata').dataset_sustainability.url!=='' && getField('metadata').dataset_sustainability.url!==null && getField('metadata').dataset_sustainability.url!==undefined"
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
        v-if="Object.keys(getField('metadata').dataset_sustainability).includes('plan') && getField('metadata').dataset_sustainability.plan!=='' && getField('metadata').dataset_sustainability.plan!==null && getField('metadata').dataset_sustainability.plan!==undefined"
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

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.community_certification && checkDataAvailable(getField('metadata').community_certification)"
      class="pa-4 mt-4 data-holder"
    >
      <b class="text-h6">Community Certification</b>
      <div
        v-if="Object.keys(getField('metadata').community_certification).includes('url') && getField('metadata').community_certification.url!=='' && getField('metadata').community_certification.url!==null && getField('metadata').community_certification.url!==undefined"
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
        v-if="Object.keys(getField('metadata').community_certification).includes('type') && getField('metadata').community_certification.type!=='' && getField('metadata').community_certification.type!==null && getField('metadata').community_certification.type!==undefined"
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

    <div
      v-if="Object.keys(allowedFields).includes('properties') && allowedFields.properties.cross_references"
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
            <p class="ma-0">
              {{ crossRefObj.name }}
            </p>
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
        <div class="d-flex flex-row align-center min-height-40">
          <b class="width-200">URL</b>
          <div class="d-flex full-width ml-md-12 ml-13">
            <a
              class="underline-effect"
              :href="crossRefObj.url"
              target="_blank"
            >
              {{ crossRefObj.url }}
            </a>
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

export default {
  name: "AdditionalInfo",
  components: {SectionTitle},
  computed: {
    ...mapState('record', ["currentRecord"]),
    ...mapState('editor', ["allowedFields"]),
    ...mapGetters("record", ["getField",'getRecordType']),
  },
  async mounted() {
    this.$nextTick(async () => {
        await this.getAllowedFields({
          type: this.getRecordType
        })
    })
  },
  methods: {
    ...mapActions("editor", ["getAllowedFields"]),
    checkDataAvailable(selectedNode) {
      let anyDataAvailable = [];
      if(selectedNode===undefined) return false
      Object.keys(selectedNode).forEach(key => {
        if (selectedNode[key].length > 0) {
          anyDataAvailable.push(true);
        }
      })
      return anyDataAvailable.includes(true);
    }
  },
}
</script>

<style scoped>
.data-holder {
  border: 1px lightgrey solid;
}
</style>
