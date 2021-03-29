<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <SectionTitle
      title="Collections"
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
        :class="['transparent',tabsDataExist]"
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
                  <div class="ml-10 text-ellipses-height-2lines">
                    {{ item.name }}
                  </div>
                </div>
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
export default {
  name: "Collections",
  components: {
    RecordStatus,
    SectionTitle,
  },
  mixins:[stringUtils],
  data: () => {
    return {
      selectedValues: null,
      tabsData: {
        selectedTab: 0,
        tabs: {
          in_collections: {relation: 'collects', data: []},
          in_recommendations: {relation: 'recommends', data: []},
        }
      }
    }
  },
  computed: {
    ...mapState("record", ["currentRecord"]),
    /** Fetch content related to each tab and feed search autocomplete*/
    getValues() {
      let selectedTabKey = Object.keys(this.tabsData.tabs)
      return this.tabsData.tabs[selectedTabKey[this.tabsData.selectedTab]].data;
    },
    tabsDataExist() {
      let inactiveTabs = true
      for (const [key] of Object.entries(this.filterList)) {
        if (this.filterList[key].data.length >= 1) {
          inactiveTabs = false
          break
        }
      }
      return inactiveTabs
    },
    filterList() {
      const _module = this
      // here I deep copied object so the references are gone and my object is a new object with unique reference
      const output = JSON.parse(JSON.stringify(_module.tabsData.tabs));

      if (this.selectedValues !== null && this.selectedValues !== "" && this.selectedValues !== undefined) {
        let foundItem = output[Object.keys(_module.tabsData.tabs)[_module.tabsData.selectedTab]].data.find(item => item.name === _module.selectedValues)
        if (foundItem) {
          output[Object.keys(output)[_module.tabsData.selectedTab]].data = []
          output[Object.keys(output)[_module.tabsData.selectedTab]].data.push(foundItem)
        }
        return output
      }
      return output
    }
  },
  beforeMount() {
    this.prepareTabsData();
  },
  methods: {
    /** Dynamically sets data for each tabs based on the data received from recordAssociations and reverseAssociations*/
    prepareTabsData() {
      const _module = this;
      if (Object.keys(_module.currentRecord['fairsharingRecord']).includes('recordAssociations') || Object.keys(_module.currentRecord['fairsharingRecord']).includes('reverseRecordAssociations')) {
        Object.keys(_module.tabsData.tabs).forEach(tabName => {
          _module.tabsData.tabs[tabName].data = _module.prepareAssociations(_module.currentRecord['fairsharingRecord'].recordAssociations, _module.currentRecord['fairsharingRecord']['reverseRecordAssociations'])
              .filter(item => item.recordAssocLabel === _module.tabsData.tabs[tabName].relation)
        })
      }
      else {
        return false
      }
    },
    /** Combines associations and reserveAssociations into a single array and prepare the data for the search table */
    prepareAssociations(associations, reverseAssociations) {
      let _module = this;
      let recordAssociations = []
      let joinedArrays = associations.concat(reverseAssociations);
      const properties = ['fairsharingRecord', 'linkedRecord'];

      joinedArrays.forEach(item => {
        let object = {};
        properties.forEach(prop => {
          if (Object.prototype.hasOwnProperty.call(item, prop)) {
            object.recordAssocLabel = _module.cleanString(item.recordAssocLabel);
            object.id = item[prop].id;
            object.registry = item[prop].registry;
            object.name = item[prop].name;
            object.subject = _module.currentRecord['fairsharingRecord'].name;
            object.type = item[prop].type;
          }
        });
        recordAssociations.push(object);
      });
      return recordAssociations;
    }
  }
}
</script>
