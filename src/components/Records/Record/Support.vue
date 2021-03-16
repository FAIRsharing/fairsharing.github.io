<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <SectionTitle
      title="Support"
      :inactive-section="(getField('metadata')['contacts']===undefined || !getField('metadata')['contacts'].length) && (getField('metadata')['support_links']===undefined || !getField('metadata')['support_links'].length)"
    />
    <div class="d-flex flex-column ml-2 min-height-40">
      <div v-if="(getField('metadata')['contacts'] && getField('metadata')['contacts'].length) || (getField('metadata')['support_links'] && getField('metadata')['support_links'].length)">
        <v-card
          v-for="(item,key,index) in generateSupport()"
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
                v-if="subItem.name && subItem.url"
                :href="subItem.url"
                target="_blank"
              >
                {{ subItem.name }}
              </a>
              <a
                v-if="!subItem.name && subItem.url"
                :href="subItem.url"
                target="_blank"
              >
                {{ subItem.url }}
              </a>
              <div
                v-if="subItem.contact_name || subItem.contact_email"
                class="d-flex flex-column"
              >
                <div
                  v-if="subItem.contact_name"
                  class="d-flex flex-wrap"
                >
                  <span class="min-width-60">Name:</span>
                  <a
                    v-if="subItem.contact_email"
                    :href="'mailto:'+subItem.contact_email"
                    target="_blank"
                  >
                    {{ subItem.contact_name }}
                  </a>
                </div>
                <div
                  v-if="subItem.contact_orcid"
                  class="d-flex flex-wrap"
                >
                  <span class="min-width-60">Orcid ID:</span>
                  <strong>
                    {{ subItem.contact_orcid }}
                  </strong>
                </div>
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
import Icon from "@/components/Icon";
import IconsMixin from "@/utils/iconsMixin.js"

export default {
  name: "Support",
  components: {
    Icon,
    SectionTitle
  },
  mixins: [clearString, IconsMixin],
  computed: {
    ...mapGetters("record", ["getField"]),
  },
  methods:{
    generateSupport() {
      let processedSupport = {}
      const support_links =  this.getField('metadata')['support_links']
      const contacts = this.getField('metadata')['contacts']
      // initializing object's key and data dynamically based on any number of types coming from API
      if (support_links) {
        support_links.forEach(item => {
          if (!Object.prototype.hasOwnProperty.call(processedSupport, item.type)) {
            processedSupport[item.type] = {
              data: [],
              icon: null
            }
          }
        });
        // assigning data and icon to the different types came from API.
        support_links.forEach(item => {
          // Replace parentheses, brackets, space,forward slashes with underscore.
          processedSupport[item.type].icon = this.getIconName(item.type);
          processedSupport[item.type].data.push(item)
        })
      }
      // adding licenses if available
      if (contacts && contacts.length) {
        processedSupport['contacts'] = {
          data:[],
          icon:'contacts'
        }
        contacts.forEach(licence => {
          processedSupport['contacts'].data.push(licence)
        })
      }
      return processedSupport
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
