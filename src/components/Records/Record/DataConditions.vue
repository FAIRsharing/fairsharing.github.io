<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <!-- Data Conditions -->
    <SectionTitle
      title="Data Conditions"
      :inactive-section="(getField('metadata')['data_processes']===undefined || !getField('metadata')['data_processes'].length) && (getField('licences')===undefined || !getField('licences').length)"
    />
    <!--  container  -->
    <div class="d-flex flex-column ml-2 min-height-40">
      <div v-if="(getField('metadata')['data_processes'] && getField('metadata')['data_processes'].length) || (getField('licences').length && getField('licences'))">
        <v-card
          v-for="(item,key,index) in generateDataConditions()"
          :key="key+'_'+index"
          class="pa-4 mt-15 d-flex flex-column"
          outlined
          color="white"
          tile
          elevation="3"
        >
          <Icon :item="item.icon" />
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
    </div>
    <section />
  </v-card>
</template>

<script>
import {mapGetters} from "vuex";
import SectionTitle from '@/components/Records/Record/SectionTitle';
import clearString from '@/utils/stringUtils'
import Icon from "@/components/Icon";

export default {
  name: "DataConditions",
  components: {
    SectionTitle,
    Icon
  },
  mixins: [clearString],
  computed: {
    ...mapGetters("record", ["getField"]),
  },
  methods:{
    generateDataConditions() {
      let processedDataConditions = {}
      const data_processes =  this.getField('metadata')['data_processes']
      const licences = this.getField('licences')
      // initializing object's key and data dynamically based on any number of types coming from API
      if (data_processes) {
        data_processes.forEach(item => {
          if (!Object.prototype.hasOwnProperty.call(processedDataConditions, item.type)) {
            processedDataConditions[item.type] = {
              data: [],
              icon: null
            }
          }
        });
        // assigning data and icon to the different types came from API.
        data_processes.forEach(item => {
          processedDataConditions[item.type].icon = item.type.replace(/\s/g, '_')
          processedDataConditions[item.type].data.push(item)
        })
      }
      // adding licenses if available
      if (licences.length) {
        processedDataConditions['licences'] = {
          data:[],
          icon:'licences'
        }
        licences.forEach(licence => {
          processedDataConditions['licences'].data.push(licence)
        })
      }
      return processedDataConditions
    },
    getLicenceRelation(licenceId) {
      return this.getField('licenceLinks').find(obj=>obj.licence.id === licenceId).relation
    }
  }
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none;

  &:hover, &:focus {
    text-decoration: underline;
    outline: 0;
  }
}
</style>
