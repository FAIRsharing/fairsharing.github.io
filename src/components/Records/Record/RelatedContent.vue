<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    v-if="!tabsDataExist"
    class="pa-4 d-flex flex-column"
    outlined
    :color="backColor"
    tile
    elevation="3"
  >
    <SectionTitle title="Related Content" />
    <div class="d-flex flex-column ml-2 min-height-40">
      <div class="d-flex flex-wrap mt-5">
        <!--  search autocomplete    -->
        <v-autocomplete
          v-if="!tabsDataExist"
          v-model="selectedValues"
          :disabled="tabsData.tabs[Object.keys(tabsData.tabs)[tabsData.selectedTab]].data.length<5"
          :items="getValues"
          solo
          :attach="true"
          dense
          clearable
          prepend-inner-icon="fa-search"
          :placeholder="`Search through ${cleanString(Object.keys(tabsData.tabs)[tabsData.selectedTab])}`"
          item-text="name"
          item-value="name"
          :filter="nameAbbrFilter"
        >
          <template #item="data">
            <span class="filterValueName">
              {{ data.item.name }}
            </span>
          </template>
        </v-autocomplete>
      </div>
      <!--  tabs    -->
      <v-tabs
        v-if="!tabsDataExist"
        v-model="tabsData.selectedTab"
        :show-arrows="$vuetify.breakpoint.mdAndDown"
        background-color="transparent"
        grow
        color="accent3"
        slider-color="accent3"
        class="mb-5"
        :hide-slider="tabsData.tabs[Object.keys(tabsData.tabs)[tabsData.selectedTab]].data.length===0"
      >
        <v-tab
          v-for="(tabName,tabIndex) in Object.keys(tabsData.tabs)"
          :key="tabName+'_'+tabIndex"
          :disabled="tabsData.tabs[tabName].data.length===0"
          @change="selectedValues=null"
        >
          {{ cleanString(tabName) }} ({{ tabsData.tabs[tabName].count }})
        </v-tab>
      </v-tabs>
      <!--  tab content  -->
      <v-tabs-items
        v-if="!tabsDataExist"
        v-model="tabsData.selectedTab"
        class="transparent height-430"
      >
        <v-tab-item
          v-for="(tabItem,tabItemIndex) in filterList"
          :key="tabItem+'_'+tabItemIndex"
        >
          <v-virtual-scroll
            :items="tabItem.data"
            height="400"
            item-height="130"
            class="ma-4 overflow-x-hidden"
          >
            <template #default="{ item,index }">
              <router-link
                :to="'/'+item.id"
                @click.native="()=>$scrollTo('body',0,{})"
              >
                <v-card
                  :key="item.id + '_' + index"
                  class="pa-4 d-flex flex-column v-card-hover mx-2 height-120"
                  flat
                  outlined
                >
                  <div class="d-flex align-center">
                    <record-status
                      :record="item"
                      :show-status="false"
                    />
                    <div class="ml-10 underline-effect text-ellipses-height-2lines line-height-20">
                      {{ item.name }}
                    </div>
                  </div>
                  <p class="grey--text relation-style text-ellipses-height-2lines line-height-14 pr-5">
                    {{ item.object }}
                    <v-tooltip top>
                      <template #activator="{ on }">
                        <span
                          v-for="(label, indexLabel) in item.recordAssocLabel"
                          :key="label+'_'+ indexLabel"
                          class="red--text mouse-info"
                          v-on="on"
                        >
                          {{ label }}
                          <span
                            v-if="indexLabel !== 0 && item.recordAssocLabel.length!==1"
                            style="color: black!important"
                          >and</span>
                        </span>
                      </template>
                      <span
                        v-for="(label2,indexHint) in item.recordAssocLabel"
                        :key="label2+'_'+indexHint"
                      >
                        <span>{{ indexHint !== 0 && item.recordAssocLabel.length>1?relationDefinition[item.recordAssocLabel[item.recordAssocLabel.length-1-indexHint]].toLowerCase():relationDefinition[item.recordAssocLabel[item.recordAssocLabel.length-1-indexHint]] }}
                          <span
                            v-if="indexHint !== item.recordAssocLabel.length-1 && item.recordAssocLabel.length!==1"
                            style="color: white!important;margin-left: -2px!important;"
                          >; </span>
                        </span>
                      </span>
                    </v-tooltip>
                    {{ item.subject }}
                  </p>
                </v-card>
              </router-link>
            </template>
          </v-virtual-scroll>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-card>
</template>

<script>
import {mapState} from "vuex";

import SectionTitle from '@/components/Records/Record/SectionTitle';
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import recordRelationShipsDefinitions from "@/data/RecordRelationShipsDefinitions.json";
import recordTabUtils from "@/utils/recordTabUtils";
import stringUtils from "@/utils/stringUtils";

export default {
  name: "RelatedContent",
  components: {
    RecordStatus,
    SectionTitle,
  },
  mixins:[stringUtils,recordTabUtils],
  props:{
    backColor:{
      default:null,
      type: String,
    }
  },
  data: () => {
    return {
      relationDefinition: recordRelationShipsDefinitions,
      selectedValues: null,
      tabsData: {
        selectedTab: 0,
        tabs: {
          related_standards: {registry: ["Standard"], data: [], count:0},
          related_databases: {registry: ["Database"], data: [], count:0}
        }
      }
    }
  },
  computed: {
    ...mapState("record", ["currentRecord"]),
  },
  methods: {
    /** Dynamically sets data for each tabs based on the data received from recordAssociations and reverseAssociations*/
    // This code is a bit of a mess due to multiple rewrites related to vague/changing requirements. It would be better
    // off being re-written or replaced with the original plan (a single table for all relations, with filters).
    prepareTabsData() {
      const _module = this;
      // A policy may recommend collections; other records may be collected.
      if (_module.currentRecord['fairsharingRecord'].registry === 'Policy') {
        _module.$set(_module.tabsData.tabs, 'related_collections', {registry: ["Collection"], data: [], count:0});
      }
      if (_module.currentRecord['fairsharingRecord'].registry === 'FAIRassist' ||
          _module.currentRecord['fairsharingRecord'].registry === 'Standard') {
        _module.$set(_module.tabsData.tabs, 'related_fairassist_components', {registry: ["FAIRassist"], data: [], count:0});
      }
      if (Object.keys(_module.currentRecord['fairsharingRecord']).includes('recordAssociations') ||
          Object.keys(_module.currentRecord['fairsharingRecord']).includes('reverseRecordAssociations')) {
        Object.keys(_module.tabsData.tabs).forEach(tabName => {
          _module.tabsData.tabs[tabName].data = _module.prepareAssociations(
              _module.currentRecord['fairsharingRecord'].recordAssociations,
              _module.currentRecord['fairsharingRecord'].reverseRecordAssociations
          ).filter(item => _module.tabsData.tabs[tabName].registry.includes(item.registry))
          // This replacement code is rather clunky, as it performs an operation in three stages, but it is at
          // least readable (well, by this non-javascript-programmer).
          // 0. This hack is related to this comment:
          // https://github.com/FAIRsharing/fairsharing.github.io/pull/2255#issuecomment-1963978178
          if (tabName === 'related_collections') {
            _module.tabsData.tabs['related_collections'].data =  _module.tabsData.tabs['related_collections'].data
                .filter((item) => item.recordAssociationLabel === 'recommends');
          }
          // 1. Create a hash with keys for each linked record ID of all the relations, containing an
          // array of all relations.
          let duplicates = {};
          _module.tabsData.tabs[tabName].data.forEach((item) => {
            if (!(item.id in duplicates)) {
              duplicates[item.id] = [];
            }
            if (!duplicates[item.id].includes(item.recordAssociationLabel)) {
              duplicates[item.id].push(item.recordAssociationLabel);
            }
          })
          // 2. Update the tabs data with the duplicated labels.
          _module.tabsData.tabs[tabName].data.forEach((item) => {
            item.recordAssocLabel = duplicates[item.id];
          })
          // 3. Delete extraneous entries.
          // Thanks, Stack Overflow!
          // https://stackoverflow.com/questions/2218999/how-to-remove-all-duplicates-from-an-array-of-objects#comment72641733_36744732
          _module.tabsData.tabs[tabName].data = _module.tabsData.tabs[tabName].data.filter((thing, index, self) => self.findIndex(t => t.id === thing.id) === index);

          // Duplicates removed, now do the count.
          _module.tabsData.tabs[tabName].count = _module.tabsData.tabs[tabName].data.length;
        });
      }
      else {
        return false
      }
    },
    nameAbbrFilter(item, queryText) {
      const search = queryText.toLowerCase()
      const name = item.name.toLowerCase();

      if (item.abbreviation == null) {
        let answer = name.indexOf(search) > -1
        return answer;
      }
      else {
        let answer = (name.indexOf(search) > -1 || item.abbreviation.toLowerCase().indexOf(search) > -1)
        return answer;
      }
    }
  }
}
</script>

