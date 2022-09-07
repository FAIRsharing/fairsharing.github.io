<template>
  <v-container>
    <v-row class="block-category">
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
      >
        <v-card
          class="mx-auto block-category__card d-flex flex-column"
          max-width="350"
          height="100%"
        >
          <v-card-title
            class="d-inline counter text-h2 font-weight-bold"
            :data-target="statsData.contributors"
          />
          <v-card-subtitle class="text--primary mt-0 text-h6 font-weight-bold">
            {{ statisticsData.firstColumn.title }}
          </v-card-subtitle>
          <v-card-text class="text--primary">
            {{ statisticsData.firstColumn.description }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
      >
        <v-card
          class="mx-auto block-category__card d-flex flex-column"
          max-width="350"
          height="100%"
        >
          <v-card-title
            class="d-inline counter text-h2 font-weight-bold"
            :data-target="statsData.resources"
          />
          <v-card-subtitle class="text--primary mt-0 text-h6 font-weight-bold">
            {{ statisticsData.secondColumn.title }}
          </v-card-subtitle>
          <v-card-text class="text--primary">
            {{ statisticsData.secondColumn.description }}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
      >
        <v-card
          class="mx-auto block-category__card d-flex flex-column"
          max-width="350"
          height="100%"
        >
          <v-card-title
            class="d-inline counter text-h2 font-weight-bold"
            :data-target="statsData.views"
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
import RestClient from "@/lib/Client/RESTClient.js"
import {truncate} from "@/utils/stringUtils";
import {blockCategories, statisticsData} from "@/data/homePageData.json"

const restClient = new RestClient();

export default {
  name: "StatisticsBlock",
  mixins: [ truncate ],
  data() {
    return {
      statsData: {
        contributors: 1,
        resources: 1,
        views: 1,
      },
      blockCategories: blockCategories,
      statisticsData: statisticsData
    }
  },

  mounted() {
    this.getStatisticsCount();
  },
  methods: {
    async getStatisticsCount() {
      this.statsData = await restClient.getStatisticsData();
      this.updateStaticsData()
    },
    updateStaticsData() {
      const counters = this.$el.querySelectorAll(".counter");
      const speed = 200;

      counters.forEach((counter) => {
        counter.innerText = 0;
        const updateCounter = () => {
          const target = +counter.getAttribute("data-target");
          const count = +counter.innerText;
          const increment = target / speed;
          if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(updateCounter, 1);
          } else {
            counter.innerText = this.updateNumbers(target)
          }
        };
        updateCounter();
      });
    },
    updateNumbers (labelValue) {
      // Nine Zeroes for Billions
      if (labelValue >= 1.0e+9) {
        return Math.abs(Number(labelValue)) / 1.0e+9 + "B"
      }
      // Six Zeroes for Millions
      else if (labelValue >= 1.0e+6) {
        return Math.abs(Number(labelValue)) / 1.0e+6 + "M"
      }
      // Three Zeroes for Thousands
      else if (labelValue >= 1.0e+4) {
        return Math.abs(Number(labelValue)) / 1.0e+3 + "K"
      }
      else{
        return  labelValue
      }
    }
  }
}
</script>

<style scoped>

#container-wrp {
  text-align: center;
  margin: 0 auto;
  color: white;
}

</style>