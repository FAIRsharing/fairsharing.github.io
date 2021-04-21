<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <SectionTitle
      title="Related Content"
      :inactive-section="tabsDataExist"
    />
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
          {{ cleanString(tabName) }}
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
                  <div class="ml-10 text-ellipses-height-2lines line-height-20">
                    {{ item.name }}
                  </div>
                </div>
                <p class="grey--text relation-style text-ellipses-height-2lines line-height-14">
                  {{ item.subject }}
                  <v-tooltip top>
                    <template #activator="{ on }">
                      <span
                        class="red--text mouse-info"
                        v-on="on"
                      >
                        {{ item.recordAssocLabel }}
                      </span>
                    </template>
                    <span>{{ relationDefinition[item.recordAssocLabel] }}</span>
                  </v-tooltip>
                  {{ item.name }}
                </p>
              </v-card>
            </template>
          </v-virtual-scroll>
        </v-tab-item>
      </v-tabs-items>
    </div>
  </v-card>
</template>

<script>
import SectionTitle from '@/components/Records/Record/SectionTitle';
import {mapState} from "vuex";
import stringUtils from "@/utils/stringUtils"
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import recordTabUtils from "@/utils/recordTabUtils";
import recordRelationShipsDefinitions from "@/data/RecordRelationShipsDefinitions.json";

export default {
  name: "RelatedContent",
  components: {
    RecordStatus,
    SectionTitle,
  },
  mixins:[stringUtils,recordTabUtils],
  data: () => {
    return {
      relationDefinition: recordRelationShipsDefinitions,
      selectedValues: null,
      tabsData: {
        selectedTab: 0,
        tabs: {
          related_standards: {relation: ['deprecates'], registry: "Standard", data: []},
          related_databases: {relation: ['collects', 'recommends', 'deprecates'], registry: "Database", data: []}
        }
      }
    }
  },
  computed: {
    ...mapState("record", ["currentRecord"]),
  },
  methods: {
    /** Dynamically sets data for each tabs based on the data received from recordAssociations and reverseAssociations*/
    prepareTabsData() {
      const _module = this;
      if (Object.keys(_module.currentRecord['fairsharingRecord']).includes('recordAssociations') || Object.keys(_module.currentRecord['fairsharingRecord']).includes('reverseRecordAssociations')) {
        Object.keys(_module.tabsData.tabs).forEach(tabName => {
          _module.tabsData.tabs[tabName].data = _module.prepareAssociations(_module.currentRecord['fairsharingRecord'].recordAssociations, [])
              .filter(item => !_module.tabsData.tabs[tabName].relation.includes(item.recordAssocLabel) && item.registry === _module.tabsData.tabs[tabName].registry)
        });
      }
      else {
        return false
      }
    },
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

.filterValueName {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
}

.mt-1-pt {
  margin-top: 1pt;
}
</style>
