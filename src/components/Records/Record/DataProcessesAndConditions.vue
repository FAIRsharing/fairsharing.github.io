<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    v-if="Object.keys(getField('metadata')).includes('data_processes_and_conditions') || (getField('licences') && getField('licences').length)"
    class="pa-4 d-flex flex-column"
    outlined
    :color="backColor"
    tile
    elevation="3"
  >
    <!-- Data Conditions -->
    <SectionTitle title="Data Processes And Conditions" />
    <!--  container  -->
    <div class="d-flex flex-column ml-2 min-height-40">
      <div v-if="(getField('metadata')['data_processes_and_conditions'] && getField('metadata')['data_processes_and_conditions'].length) || (getField('licences').length && getField('licences'))">
        <!-- DataProcessAndCondition component -->
        <DataProcessAndCondition />
        <v-card
          v-for="(item,key,index) in generateDataConditions()"
          :key="key+'_'+index"
          class="pa-4 mt-15 d-flex flex-column"
          outlined
          color="white"
          tile
          elevation="3"
        >
          <Icon
            :item="item.icon"
            size="20"
          />
          <v-card-title class="pa-0 text--primary card-title-customize">
            {{ key | capitalize }}
          </v-card-title>
          <v-card-text class="ma-0 pt-8">
            <v-card
              v-for="(subItem,subIndex) in item.data"
              :key="subItem.name+'_'+subIndex"
              class="pa-4 mt-2 d-flex flex-column v-card-hover"
              flat
              outlined
            >
              <a
                v-if="subItem.url"
                :href="subItem.url"
                target="_blank"
                class="underline-effect"
              >
                {{ subItem.name }}
              </a>
              <div
                v-else
                class="d-flex flex-column"
              >
                <span>{{ subItem.name }}</span>
                <span v-if="subItem.id && subItem.id!=='undefined' && getLicenceRelation(subItem.id)!=='undefined' ">
                  relationship:
                  <strong>({{ cleanString(getLicenceRelation(subItem.id)) }})</strong>
                </span>
              </div>
            </v-card>
          </v-card-text>
        </v-card>
      </div>
      <!-- Other data items component -->
      <div v-if="(getField('metadata')['data_access_condition'] && Object.keys('data_access_condition').length) || (getField('metadata')['data_curation'] && Object.keys('data_curation').length) ||(getField('metadata')['data_deposition_condition'] && Object.keys('data_deposition_condition').length) ||(getField('metadata')['data_preservation_policy'] && Object.keys('data_preservation_policy').length)">
        <OtherDataProcesses />
      </div>
    </div>
    <section />
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import SectionTitle from '@/components/Records/Record/SectionTitle';
import clearString from '@/utils/stringUtils'
import Icon from "@/components/Icon";
import OtherDataProcesses from "@/components/Records/Record/DataProcessesAndConditions/OtherDataProcesses";
import DataProcessAndCondition from "@/components/Records/Record/DataProcessesAndConditions/DataProcessAndCondition";

export default {
  name: "DataProcessesAndConditions",
  components: {
    SectionTitle,
    Icon,
    OtherDataProcesses,
    DataProcessAndCondition,
  },
  mixins: [clearString],
  props:{
    backColor:{
      default:null,
      type: String,
    }
  },
  computed: {
    ...mapGetters("record", ["getField"]),
  },
  methods: {
    generateDataConditions: function () {
      let processedLicencesData = {};

      const licences = this.getField('licences');

      // adding licenses if available
      if (licences.length) {
        processedLicencesData['licences'] = {
          data: [],
          icon: 'licences'
        };
        licences.forEach(licence => {
          processedLicencesData['licences'].data.push(licence)
        })
      }
      return processedLicencesData
    },
    getLicenceRelation(licenceId) {
      return this.getField('licenceLinks').find(obj => obj.licence.id === licenceId).relation
    },
  },
}
</script>