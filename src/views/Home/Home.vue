<template>
  <v-main>
    <v-container class="text-center pa-0" fluid>
      <Carousel />
      <InfoBlock class="mb-12" />
      <SearchBlock />
      <CategoryBlock class="mt-12" />
      <CommunityBlock class="mt-12" />
      <v-lazy>
        <StatisticsBlock class="my-12" />
      </v-lazy>
    </v-container>
    <!-- This html is from a safe source -->

    <!--    <script-->
    <!--      type="application/ld+json"-->
    <!--      v-safe-html="JSONLD"-->
    <!--    />-->
    <component :is="'script'" type="application/ld+json">
      <span v-safe-html="JSONLD" />
    </component>
  </v-main>
</template>

<script>
import Carousel from "@/components/Home/Carousel";
import CategoryBlock from "@/components/Home/CategoryBlock";
import CommunityBlock from "@/components/Home/CommunityBlock";
import InfoBlock from "@/components/Home/InfoBlock";
import SearchBlock from "@/components/Home/SearchBlock";
import StatisticsBlock from "@/components/Home/StatisticsBlock";
import RestClient from "@/lib/Client/RESTClient.js";

const restClient = new RestClient();

/** Component to handle the front page (landing page)
 *
 */
export default {
  name: "Home",
  components: {
    Carousel,
    InfoBlock,
    SearchBlock,
    CategoryBlock,
    StatisticsBlock,
    CommunityBlock,
  },
  data() {
    return {
      JSONLD: {},
    };
  },
  mounted() {
    this.getJsonld();
  },
  unmounted() {
    this.$scrollTo("body", 0, {});
  },
  methods: {
    async getJsonld() {
      this.JSONLD = await restClient.getHomepageJsonld();
    },
  },
};
</script>
