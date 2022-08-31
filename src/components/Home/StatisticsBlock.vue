<template>
  <v-card
    id="container-wrp"
    fluid
    tile
    color="primary"
    :height="$vuetify.breakpoint.lgAndUp ? 250 : 'auto'"
    class="pa-4 d-flex flex-column full-width justify-space-between"
  >
    <div class="counter-container d-flex flex-row justify-space-between">
      <v-icon>
        fa fa-user
      </v-icon>
      <span>Contributors</span>
      <div
        class="counter"
        :data-target="statsData.contributors"
      />
    </div>
    <div class="counter-container d-flex flex-row justify-space-between">
      <v-icon>
        fa fa-book-open
      </v-icon>
      <span>Resources</span>
      <div
        class="counter"
        :data-target="statsData.resources"
      />
    </div>
    <div class="counter-container d-flex flex-row justify-space-between">
      <v-icon>
        fa fa-eye
      </v-icon>
      <span>Views</span>
      <div
        class="counter"
        :data-target="statsData.views"
      />
    </div>
  </v-card>
</template>

<script>
import RestClient from "@/lib/Client/RESTClient.js"

const restClient = new RestClient();

export default {
  name: "StatisticsBlock",
  data() {
    return {
      statsData: {
        contributors: 1,
        resources: 1,
        views: 1,
      }
    }
  },

  mounted() {
    this.getStatisticsData();
  },
  methods: {
    async getStatisticsData() {
      this.statsData = await restClient.getStatisticsData();
      this.updateStaticsData()
    },
    updateStaticsData() {
      const counters = document.querySelectorAll(".counter");
      const speed = 200;

      counters.forEach((counter) => {
        counter.innerText = 0;
        const updateCounter = () => {
          const target = +counter.getAttribute("data-target");
          const count = +counter.innerText;
          const increment = target / speed;
          if (count < target) {
            counter.innerText = Math.ceil(count + increment);

            // if(Math.abs(Number(counter.innerText)) >= 1.0e+3) {
            //   counter.innerText = Math.abs(Number(counter.innerText)) / 1.0e+3 + "K"
            //   console.log("counter.innerText::", counter.innerText)
            // }
            setTimeout(updateCounter, 1);

          } else {
            counter.innerText = target;
          }
        };
        updateCounter();
      });
    },
  //    updateNumbers (labelValue) {
  // // Nine Zeroes for Billions
  //     return Math.abs(Number(labelValue)) >= 1.0e+9
  //     ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
  //     // Six Zeroes for Millions
  //     : Math.abs(Number(labelValue)) >= 1.0e+6
  //             ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
  //         // Three Zeroes for Thousands
  //         : Math.abs(Number(labelValue)) >= 1.0e+3
  //             ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"
  //             : Math.abs(Number(labelValue));
  //     }
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
