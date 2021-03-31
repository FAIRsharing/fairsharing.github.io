<template>
  <v-main>
    <v-container
      fluid
      class="text-center pa-0"
    >
      <BlockHero />
      <block-tabs />
      <block-categories class="mb-4" />
      <block-search />
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
import BlockCategories from "@/components/Home/BlockCategories";
import BlockHero from "@/components/Home/BlockHero";
import BlockTabs from "@/components/Home/BlockTabs";
import BlockSearch from "@/components/Home/BlockSearch";
    /** Component to handle the front page (landing page)
     *
     */
    export default {
      name: "Home",
      components:{BlockSearch, BlockTabs, BlockHero, BlockCategories},
    };
</script>
