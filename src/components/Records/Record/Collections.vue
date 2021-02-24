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
    />
    <div class="d-flex flex-column ml-2 min-height-40">
      <div class="d-flex flex-wrap mt-5">
        <!--  search autocomplete    -->
        <v-autocomplete
          v-model="selectedValues"
          :items="getValues"
          solo
          :attach="true"
          dense
          clearable
          prepend-inner-icon="fa-search"
          placeholder="`Search through collections"
          item-text="name"
          item-value="name"
        >
          <template #item="data">
            <span class="filterValueName">
              {{ data.item.name }}
            </span>
          </template>
        </v-autocomplete>
        <v-btn
          color="primary"
          class="ml-2"
        >
          Apply
        </v-btn>
      </div>
      <!--  tabs    -->
      <v-tabs
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
        >
          {{ cleanString(tabName) }}
        </v-tab>
      </v-tabs>
      <!--  tab content  -->
      <v-tabs-items
        v-model="tabsData.selectedTab"
        class="transparent height-450"
      >
        <v-tab-item
          v-for="(tabItem,tabItemIndex) in tabsData.tabs"
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
    getValues: function () {
      let selectedTabKey = Object.keys(this.tabsData.tabs)
      return this.tabsData.tabs[selectedTabKey[this.tabsData.selectedTab]].data;
    }
  },
  beforeMount() {
    this.prepareTabsData();
  },
  methods: {
    /** Dynamically resets data of the tab*/
    reset: function (selectedItem) {
      selectedItem.filterSelected = {};
    },
    /** Dynamically sets data for each tabs based on the data received from recordAssociations and reverseAssociations*/
    prepareTabsData() {
      const _module = this;
      if (Object.keys(_module.currentRecord['fairsharingRecord']).includes('recordAssociations') || Object.keys(_module.currentRecord['fairsharingRecord']).includes('reverseRecordAssociations')) {
        Object.keys(_module.tabsData.tabs).forEach(tabName => {
          _module.tabsData.tabs[tabName].data = _module.prepareAssociations(_module.currentRecord['fairsharingRecord'].recordAssociations, _module.currentRecord['fairsharingRecord']['reverseRecordAssociations'])
              .filter(item => item.recordAssocLabel === _module.tabsData.tabs[tabName].relation)
        })
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

.filterValueName {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
}

.v-slide-item--active{
  height: 0!important;
  color: red;
background: none!important;
}
</style>
