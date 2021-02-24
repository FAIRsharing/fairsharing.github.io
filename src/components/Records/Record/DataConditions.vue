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
          <div class="icon-container d-flex justify-center">
            <v-icon large>
              {{ Object.keys($vuetify.icons.values).includes(item.icon)?$vuetify.icons.values[item.icon]:$vuetify.icons.values['undefined'] }}
            </v-icon>
          </div>
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
import SectionTitle from '@/components/Records/Record/SectionTitle';
import clearString from '@/utils/stringUtils'
import {mapGetters} from "vuex";
export default {
  name: "DataConditions",
  components: {
    SectionTitle,
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

.icon-container {
  position: absolute;
  top: -45px;
  background: white;
  border: #b3b3b3 dotted 3px;
  border-radius: 50% !important;
  -moz-border-radius: 50% !important;
  -webkit-border-radius: 50% !important;
  width: 85px;
  height: 85px;
  cursor: help;
}

.card-title-customize {
  position: absolute;
  top: 5px;
  left: 120px
}

.v-card-hover {
  -webkit-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0) 0 1px 7px 0 !important;
  -moz-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0) 0 1px 7px 0 !important;
  box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0) 0 1px 7px 0 !important;
  transition: box-shadow .4s linear;
  -webkit-transition: box-shadow .4s linear;
  -moz-transition: box-shadow .4s linear;
  -o-transition: box-shadow .4s linear;
}

.v-card-hover:hover {
  transform: scale(1.004);
  -webkit-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0.2) 0 1px 7px 0 !important;
  -moz-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0.2) 0 1px 7px 0 !important;
  box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0.2) 0 1px 7px 0 !important;
}
</style>
