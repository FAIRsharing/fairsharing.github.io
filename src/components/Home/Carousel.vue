<template>
  <v-tabs
    v-model="tabsData.selectedTab"
    :show-arrows="$vuetify.display.mdAndDown"
    align-tabs="center"
    slider-size="5"
    class="height-430"
    bg-color="transparent"
    color="accent3"
    slider-color="accent3"
  >
    <v-tab
      v-for="(tab, index) in tabsData.tabs"
      :key="tab.component + '_' + index"
    >
      {{ tab.title }}
    </v-tab>
  </v-tabs>
  <v-tabs-window v-model="tabsData.selectedTab">
    <v-tabs-window-item
      v-for="(tabItem, tabItemIndex) in tabsData.tabs"
      :key="tabItem + '_' + tabItemIndex"
    >
      <TabContent
        :header="tabItem.header"
        :description="tabItem.description"
        :image="tabItem.image"
        :link="tabItem.link"
      />
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script>
import TabContent from "@/components/Home/CarouselContent";
import homePageData from "@/data/homePageData.json";

export default {
  name: "Carousel",
  components: { TabContent },
  data: () => {
    return {
      tabsData: {
        selectedTab: 0,
        tabs: homePageData.blockTabs,
      },
    };
  },
  mounted() {
    this.cycleTabs();
  },
  methods: {
    cycleTabs() {
      setTimeout(() => {
        /* istanbul ignore next */
        this.tabsData.selectedTab =
          this.tabsData.selectedTab < this.tabsData.tabs.length - 1
            ? this.tabsData.selectedTab + 1
            : 0;
        this.cycleTabs();
      }, 8000);
    },
  },
};
</script>

<style scoped></style>
