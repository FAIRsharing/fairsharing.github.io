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
name: "BlockTabs",
  components: {TabContent},
  data: () => {
    return {
      tabsData: {
        selectedTab: 0,
        tabs: blockTabs,
      }
    }
  }
}
</script>

<style scoped>

</style>
