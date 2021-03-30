<template>
  <v-main>
    <v-container
      fluid
      class="text-center"
    >
      <div class="px-md-10">
        <h1 class="text-body-1 text-sm-h6 my-4 my-sm-4 my-lg-8 text-md-h6 text-lg-h5 text-xl-h4 font-weight-black secondary--text">
          A curated, informative and educational resource on data and metadata standards, inter-related to databases and data policies.
        </h1>
        <h2 class="text-body-2 text-sm-h5 my-8 my-sm-4 my-lg-8 text-md-h5 text-lg-h4 text-xl-h3 font-weight-medium">
          How can we help?
        </h2>
        <h3 :class="['lato-font-medium my-sm-4 my-lg-8 my-8 primary--text px-10 font-weight-thin',{'lato-text-md':$vuetify.breakpoint.mdOnly,'lato-text-lg':$vuetify.breakpoint.lgAndUp,'lato-text-sm':$vuetify.breakpoint.smAndDown}]">
          We guide consumers to discover, select and use these resources with confidence, and producers to make their resource more discoverable, more widely adopted and cited.
        </h3>
      </div>

      <v-tabs
        v-model="tabsData.selectedTab"
        :grow="$vuetify.breakpoint.lgAndDown"
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
            <home-tab-content
              :header="tabItem.header"
              :description="tabItem.description"
              :image="tabItem.image"
              :link="tabItem.link"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
      <block-categories class="mb-4" />
      <v-row style="height: 250px;background: blue">
        <v-col
          sm="12"
          md="6"
        >
          Left
        </v-col>
        <v-col
          sm="12"
          md="6"
        >
          Right
        </v-col>
      </v-row>
      <v-row style="height: 250px;background: white;">
        <v-col
          style="border: 5px solid red"
          sm="12"
          md="4"
        >
          column 1
        </v-col>
        <v-col
          style="border: 5px solid red"
          sm="12"
          md="4"
        >
          column 2
        </v-col>
        <v-col
          style="border: 5px solid red"
          sm="12"
          md="4"
        >
          column 3
        </v-col>
      </v-row>
      <div style="height: 300px">
        Our Community of 76 Journals, Funders, and Databases Includes
      </div>
    </v-container>
  </v-main>
</template>

<script>
import HomeTabContent from "@/components/Home/HomeTabContent";
import {tabs} from "@/data/homePageData.json"
import BlockCategories from "@/components/Home/BlockCategories";
    /** Component to handle the front page (landing page)
     *
     */
    export default {
      name: "Home",
      components:{BlockCategories, HomeTabContent},
      data: () => {
        return {
          tabsData: {
            selectedTab: 0,
            tabs: tabs
          }
        }
      }
    };
</script>
