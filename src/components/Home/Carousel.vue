<template>
  <v-tabs
    v-model="tabsData.selectedTab"
    :show-arrows="$vuetify.breakpoint.mdAndDown"
    centered
    slider-size="5"
    class="height-430"
    background-color="transparent"
    color="accent3"
    slider-color="accent3"
  >
    <v-tab
      v-for="(tab,index) in tabsData.tabs"
      :key="tab.component + '_' + index"
    >
      {{ tab.title }}
    </v-tab>
    <v-tabs-items v-model="tabsData.selectedTab">
      <v-tab-item
        v-for="(tabItem,tabItemIndex) in tabsData.tabs"
        :key="tabItem + '_' + tabItemIndex"
      >
        <tab-content
          :header="tabItem.header"
          :description="tabItem.description"
          :image="tabItem.image"
          :link="tabItem.link"
        />
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import {blockTabs} from "@/data/homePageData.json";
import TabContent from "@/components/Home/BlockTabs/TabContent";

export default {
name: "Carousel",
  components: {TabContent},
  data: () => {
    return {
      tabsData: {
        selectedTab: 0,
        tabs: blockTabs,
      }
    }
  },
  mounted(){
    this.cycleTabs();
  },
  methods: {
    cycleTabs(){
      setTimeout(() => {
        this.tabsData.selectedTab = (this.tabsData.selectedTab < this.tabsData.tabs.length -1) ? this.tabsData.selectedTab + 1 : 0;
        this.cycleTabs()
      }, 5000);
    }
  }
}
</script>

<style scoped>

</style>
