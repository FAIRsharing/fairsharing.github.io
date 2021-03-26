<template>
  <v-main>
    <v-container
      fluid
      class="text-center"
    >
      <h1>A curated, informative and educational resource on data and metadata standards, inter-related to databases and data policies. </h1>
      <h2>How can we help?</h2>
      <h3> We guide consumers to discover, select and use these resources with confidence, and producers to make their resource more discoverable, more widely adopted and cited.</h3>
      <v-row>
        <v-col
          sm="12"
          md="5"
          style="background: red"
        >
          pic placeholder
        </v-col>
        <v-col
          sm="12"
          md="7"
          style="background: blue"
        >
          <h4>Developers & curators of resources</h4>
          <p>
            Make your standard, database or repository discoverable, increasing exposure and credit outside your immediate community and promoting adoption...
          </p>
        </v-col>
      </v-row>

      <v-tabs
        v-model="tabsData.selectedTab"
        centered
        slider-color="primary"
        slider-size="5"
      >
        <v-tab
          v-for="(tab,index) in tabsData.tabs"
          :key="tab.component + '_' + index"
        >
          {{ tab.component }}
        </v-tab>
        <v-tabs-items v-model="tabsData.selectedTab">
          <v-tab-item
            v-for="(tabItem,tabItemIndex) in tabsData.tabs"
            :key="tabItem + '_' + tabItemIndex"
          >
            <component :is="tabItem.component" />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
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
      <div style="height: 300px">Our Community of 76 Journals, Funders, and Databases Includes</div>
    </v-container>
  </v-main>
</template>

<script>
import DeveloperCurators from "@/components/Home/DeveloperCurators";
import Funders from "@/components/Home/Funders";
import JournalPublisher from "@/components/Home/JournalPublishers";
import LibrariansTrainers from "@/components/Home/LibrariansTrainers";
import Researcher from "@/components/Home/Researchers";
import SocietiesAlliances from "@/components/Home/SocietiesAlliances";
    /** Component to handle the front page (landing page)
     *
     */
    export default {
      name: "Home",
      components:{
        DeveloperCurators,Funders,JournalPublisher,LibrariansTrainers,Researcher,SocietiesAlliances
      },
      data: () => {
        return {
          tabsData: {
            selectedTab: 0,
            tabs: [
              {component: 'Researcher', title: "Researchers"},
              {component: 'DeveloperCurators', title: "Developers & Curators"},
              {component: 'JournalPublisher', title: "Journal Publishers"},
              {component: 'LibrariansTrainers', title: "Librarians & Trainers"},
              {component: 'SocietiesAlliances', title: "Societies & Alliances"},
              {component: 'Funders', title: "Funders"},
            ]
          }
        }
      }
    };
</script>
