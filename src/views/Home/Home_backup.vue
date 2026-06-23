<template>
  <v-container class="text-center pa-0" fluid>
    <Carousel />
    <InfoBlock class="mb-12" />
    <SearchBlock />
    <CategoryBlock class="mt-12" />
    <CommunityBlock class="mt-12" />
    <v-lazy>
      <ClientOnly>
        <StatisticsBlock class="my-12" />
      </ClientOnly>
    </v-lazy>

    <ClientOnly>
      <component :is="'script'" type="application/ld+json">
        <span v-safe-html="JSONLD" />
      </component>
    </ClientOnly>
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
import {ClientOnly} from "vike-vue/ClientOnly";

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
    ClientOnly,
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
    if (typeof window !== "undefined" && this.$scrollTo) {
      this.$scrollTo("body", 0, {});
    }
  },
  methods: {
    async getJsonld() {
      this.JSONLD = await restClient.getHomepageJsonld();
    },
  },
};
</script>
