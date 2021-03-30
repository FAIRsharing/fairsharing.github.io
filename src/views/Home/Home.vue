<template>
  <v-main>
    <v-container
      fluid
      class="text-center pa-0"
    >
      <BlockHero />
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
import BlockHero from "@/components/Home/BlockHero";
    /** Component to handle the front page (landing page)
     *
     */
    export default {
      name: "Home",
      components:{BlockHero, BlockCategories, HomeTabContent},
      data: () => {
        return {
          tabsData: {
            selectedTab: 0,
            tabs: tabs,
            backHeader:{

            }
          }
        }
      }
    };
</script>
