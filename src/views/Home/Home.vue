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
  </v-container>
</template>

<script>
import Carousel from "@/components/Home/Carousel";
import CategoryBlock from "@/components/Home/CategoryBlock";
import CommunityBlock from "@/components/Home/CommunityBlock";
import InfoBlock from "@/components/Home/InfoBlock";
import SearchBlock from "@/components/Home/SearchBlock";
import StatisticsBlock from "@/components/Home/StatisticsBlock";

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
      isMounted: false,
    };
  },
  mounted() {
    this.isMounted = true;
  },
  unmounted() {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  },
};
</script>
