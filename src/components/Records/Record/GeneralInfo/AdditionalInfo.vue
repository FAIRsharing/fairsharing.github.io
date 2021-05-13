<template>
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <!-- General Info -->
    <SectionTitle title="Additional Information" />
    <div
      v-if="getField('metadata').dataset_pid"
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
      v-if="getField('metadata').dataset_citation"
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
      v-if="getField('metadata').dataset_contact"
      class="d-flex flex-row mt-4 align-center min-height-40"
    >
      <b class="width-200">Dataset Contact</b>
      <div class="d-flex full-width ml-md-12 ml-13">
        <p class="ma-0">
          {{ getField('metadata').dataset_contact }}
        </p>
      </div>
    </div>

    <div
      v-if="getField('metadata').dataset_versioning"
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
      v-if="getField('metadata').dataset_prepubreview"
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
      v-if="getField('metadata').deprecation_reason"
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
      v-if="getField('metadata').dataset_preservation"
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
      v-if="getField('metadata').dataset_curation"
      class="pa-4 data-holder"
    >
      <b class="text-h6">Dataset Curation</b>
      <div class="d-flex flex-row align-center min-height-40">
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
      <div class="d-flex flex-row align-center min-height-40">
        <b class="width-200">Steps</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').dataset_curation.steps }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="getField('metadata').dataset_metrics"
      class="pa-4 mt-4 data-holder"
    >
      <b class="text-h6">Dataset Metrics</b>
      <div class="d-flex flex-row align-center min-height-40">
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
      <div class="d-flex flex-row align-center min-height-40">
        <b class="width-200">Metrics</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').dataset_metrics.metrics }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="getField('metadata').dataset_deposition"
      class="pa-4 mt-4 data-holder"
    >
      <b class="text-h6">Dataset Deposition</b>
      <div class="d-flex flex-row align-center min-height-40">
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
      <div class="d-flex flex-row align-center min-height-40">
        <b class="width-200">Restrictions</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').dataset_deposition.restrictions }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="getField('metadata').data_access_condition"
      class="pa-4 mt-4 data-holder"
    >
      <b class="text-h6">Data Access Condition</b>
      <div class="d-flex flex-row align-center min-height-40">
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
      <div class="d-flex flex-row align-center min-height-40">
        <b class="width-200">Type</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').data_access_condition.type }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="getField('metadata').dataset_sustainability"
      class="pa-4 mt-4 data-holder"
    >
      <b class="text-h6">Dataset Sustainability</b>
      <div class="d-flex flex-row align-center min-height-40">
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
      <div class="d-flex flex-row align-center min-height-40">
        <b class="width-200">Plan</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').dataset_sustainability.plan }}
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="getField('metadata').community_certification"
      class="pa-4 mt-4 data-holder"
    >
      <b class="text-h6">Community Certification</b>
      <div class="d-flex flex-row align-center min-height-40">
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
      <div class="d-flex flex-row align-center min-height-40">
        <b class="width-200">Type</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p class="ma-0">
            {{ getField('metadata').community_certification.type }}
          </p>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import SectionTitle from "@/components/Records/Record/SectionTitle";

export default {
  name: "AdditionalInfo",
  components: {SectionTitle},
  computed: {
    ...mapState('record', ["currentRecord"]),
    ...mapGetters("record", ["getField"]),
  }
}
</script>

<style scoped>
.data-holder {
  border: 1px lightgrey solid;
}
</style>
