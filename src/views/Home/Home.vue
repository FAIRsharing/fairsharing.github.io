<template>
  <v-main>
    <v-container
      fluid
      class="text-center pa-0"
    >
      <Carousel />
      <InfoBlock class="mb-12" />
      <SearchBlock />
      <CategoryBlock class="mt-12" />
      <CommunityCarousel class="mt-12 mb-12" />
      <v-lazy>
        <StatisticsBlock class="my-12" />
      </v-lazy>
    </v-container>
    <!-- This html is from a safe source -->
    <!-- eslint-disable vue/no-v-html -->
    <script
      type="application/ld+json"
      v-html="JSONLD"
    />
    <!-- eslint-enable vue/no-v-html -->
  </v-main>
</template>

<script>
import Carousel from "@/components/Home/Carousel";
import InfoBlock from "@/components/Home/InfoBlock";
import SearchBlock from "@/components/Home/SearchBlock";
import CategoryBlock from "@/components/Home/CategoryBlock";
import CommunityCarousel from "@/components/Home/CommunityCarousel";
import StatisticsBlock from "@/components/Home/StatisticsBlock";
import RestClient from "@/lib/Client/RESTClient.js"

const restClient = new RestClient();

/** Component to handle the front page (landing page)
 *
 */
export default {
  name: "Home",
  components:{CommunityCarousel, Carousel, InfoBlock, SearchBlock, CategoryBlock, StatisticsBlock },
  data() {
    return {
      JSONLD: {}
    }
  },
  mounted() {
    this.getJsonld();
  },
  destroyed() {
    this.$scrollTo('body',0,{});
  },
  methods: {
    async getJsonld() {
      this.JSONLD = await restClient.getHomepageJsonld();
    },
  }
};
</script>
