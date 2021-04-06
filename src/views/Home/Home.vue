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
      <block-info class="mb-4" />
    </v-container>
  </v-main>
</template>

<script>
import BlockCategories from "@/components/Home/BlockCategories";
import BlockHero from "@/components/Home/BlockHero";
import BlockTabs from "@/components/Home/BlockTabs";
import BlockSearch from "@/components/Home/BlockSearch";
import BlockInfo from "@/components/Home/BlockInfo";
    /** Component to handle the front page (landing page)
     *
     */
    export default {
      name: "Home",
      components:{BlockInfo, BlockSearch, BlockTabs, BlockHero, BlockCategories},
    };
</script>
