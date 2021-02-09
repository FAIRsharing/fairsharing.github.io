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
      :inactive-section="getField('metadata')['data_processes']===undefined || !getField('metadata')['data_processes'].length"
    />
    <!--  container  -->
    <div class="d-flex flex-column ml-2 min-height-40">
      <div v-if="getField('metadata')['data_processes']">
        <v-card
          v-for="(item,key,index) in generateDataConditions"
          :key="key+'_'+index"
          class="pa-4 mt-15 d-flex flex-column"
          outlined
          color="white"
          tile
          elevation="3"
        >
          <div class="icon-container d-flex justify-center">
            <v-icon large>
              {{ $vuetify.icons.values[item.icon] }}
            </v-icon>
          </div>
          <v-card-title class="pa-0 text--primary card-title-customize">
            {{ key }}
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
                :href="subItem.url"
                target="_blank"
              >
                {{ subItem.name }}
              </a>
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
import {mapGetters} from "vuex";
export default {
  name: "Tools",
  components: {
    SectionTitle,
  },
  computed: {
    ...mapGetters("record", ["getField"]),
    generateDataConditions() {
      const processedDataCondtions = {
        'data access': {
          data: [],
          icon: null
        },
        'data curation': {
          data: [],
          icon: null
        },
        'data release': {
          data: [],
          icon: null
        }
      }
      let data_processes = this.getField('metadata')['data_processes']
      data_processes.forEach(item => {
        if (processedDataCondtions[item.type]) {
          processedDataCondtions[item.type].icon = item.type.replace(/\s/g, '_');
          processedDataCondtions[item.type].data.push(item)
        }
      })
      return processedDataCondtions
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
  border-radius: 50%!important;
  -moz-border-radius: 50%!important;
  -webkit-border-radius: 50%!important;
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
