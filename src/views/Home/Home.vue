<template>
  <v-container class="text-center pa-0" fluid>
    <Carousel v-if="isMounted" />

    <InfoBlock class="mb-12" />
    <SearchBlock />
    <CategoryBlock class="mt-12" />
    <CommunityBlock class="mt-12" />

    <v-lazy>
      <StatisticsBlock class="my-12" />
    </v-lazy>

    <template v-if="isMounted">
      <component
        :is="'script'"
        v-if="Object.keys(JSONLD).length"
        v-safe-html="JSON.stringify(JSONLD)"
        type="application/ld+json"
      />
    </template>
  </v-container>
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

/** Component to handle the front page (landing page) */
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
      isMounted: false,
    };
  },
  mounted() {
    this.getJsonld();
    this.isMounted = true;
  },
  unmounted() {
    // Fixed: Native scroll since the global scroll plugin is disabled
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  },
  methods: {
    async getJsonld() {
      const data = await restClient.getHomepageJsonld();
      // Ensure we assign valid data so the script tag populates correctly
      if (data) {
        this.JSONLD = data;
      }
    },
  },
};
</script>
