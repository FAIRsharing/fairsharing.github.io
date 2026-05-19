<template>
  <v-sheet color="transparent">
    <v-tabs
      v-model="tabsData.selectedTab"
      :show-arrows="isMounted ? $vuetify.display.mdAndDown : false"
      align-tabs="center"
      bg-color="transparent"
      class="height-430"
      color="accent3"
      slider-color="accent3"
      slider-size="5"
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
          :description="tabItem.description"
          :header="tabItem.header"
          :image="tabItem.image"
          :link="tabItem.link"
        />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script>
import TabContent from "@/components/Home/CarouselContent";
import homePageData from "@/data/homePageData.json";

export default {
  name: "Carousel",
  components: { TabContent },
  data: () => {
    return {
      isMounted: false,
      tabsData: {
        selectedTab: 0,
        tabs: homePageData.blockTabs,
      },
    };
  },
  mounted() {
    this.isMounted = true;
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
