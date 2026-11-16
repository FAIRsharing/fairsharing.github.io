<template>
  <v-container>
    <v-row class="block-category">
      <v-col cols="12" lg="4" md="4" sm="12">
        <v-card
          class="mx-auto block-category__card d-flex flex-column"
          height="100%"
          max-width="350"
        >
          <v-card-title
            :data-target="statsData.resources"
            class="d-inline counter text-h2 font-weight-bold"
          />
          <v-card-subtitle class="text--primary mt-0 text-h6 font-weight-bold">
            {{ statisticsData.firstColumn.title }}
          </v-card-subtitle>
          <v-card-text class="text--primary">
            {{ statisticsData.firstColumn.description }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" md="4" sm="12">
        <v-card
          class="mx-auto block-category__card d-flex flex-column"
          height="100%"
          max-width="350"
        >
          <v-card-title
            :data-target="statsData.contributors"
            class="d-inline counter text-h2 font-weight-bold"
          />
          <v-card-subtitle class="text--primary mt-0 text-h6 font-weight-bold">
            {{ statisticsData.secondColumn.title }}
          </v-card-subtitle>
          <v-card-text class="text--primary">
            {{ statisticsData.secondColumn.description }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" md="4" sm="12">
        <v-card
          class="mx-auto block-category__card d-flex flex-column"
          height="100%"
          max-width="350"
        >
          <v-card-title
            :data-target="statsData.views"
            class="d-inline counter text-h2 font-weight-bold"
          />
          <v-card-subtitle class="text--primary mt-0 text-h6 font-weight-bold">
            {{ statisticsData.thirdColumn.title }}
          </v-card-subtitle>
          <v-card-text class="text--primary">
            {{ statisticsData.thirdColumn.description }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import homePageData from "@/data/homePageData.json";
import RestClient from "@/lib/Client/RESTClient.js";
import { truncate } from "@/utils/stringUtils";

const restClient = new RestClient();

export default {
  name: "StatisticsBlock",
  mixins: [truncate],
  data() {
    return {
      statsData: {
        contributors: 1,
        resources: 1,
        views: 1,
      },
      blockCategories: homePageData.blockCategories,
      statisticsData: homePageData.statisticsData,
    };
  },

  mounted() {
    this.getStatisticsCount();
  },
  methods: {
    async getStatisticsCount() {
      this.statsData = await restClient.getStatisticsData();
      this.updateStaticsData();
    },
    updateStaticsData() {
      const counters = this.$el.querySelectorAll(".counter");
      const speed = 200;

      counters.forEach((counter) => {
        counter.innerText = "0";
        const updateCounter = () => {
          const target = +counter.getAttribute("data-target");
          const count = +counter.innerText;
          const increment = target / speed;
          if (count < target) {
            counter.innerText = String(Math.ceil(count + increment));
            setTimeout(updateCounter, 1);
          } else {
            counter.innerText = String(this.updateNumbers(target));
          }
        };
        updateCounter();
      });
    },
    updateNumbers(labelValue) {
      // Nine Zeroes for Billions
      if (labelValue >= 1.0e9) {
        return Math.round(Number(labelValue) / 1.0e9) + "B";
      }
      // Six Zeroes for Millions
      else if (labelValue >= 1.0e6) {
        return Math.round(Number(labelValue) / 1.0e6) + "M";
      }
      // Three Zeroes for Thousands
      else if (labelValue >= 1.0e4) {
        return Math.round(Number(labelValue) / 1.0e3) + "K";
      } else {
        return labelValue;
      }
    },
  },
};
</script>

<style scoped>
#container-wrp {
  text-align: center;
  margin: 0 auto;
  color: white;
}
</style>
