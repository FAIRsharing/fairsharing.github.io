<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col
        md="12"
        sm="12"
        lg="6"
      >
        <v-card
          v-if="chartSubjects"
          class="pa-2"
          outlined
          tile
        >
          <BarChart
            ref-name="barSubjectsPol2"
            :fields-chart="chartSubjects"
          />
        </v-card>
      </v-col>
      <v-col
        md="12"
        sm="12"
        lg="6"
      >
        <v-card
          v-if="chartCountries"
          class="pa-2"
          outlined
          tile
        >
          <BarChart
            :ref-name="'barCountriesPol2'"
            :fields-chart="chartCountries"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        md="12"
        sm="12"
        lg="6"
      >
        <v-card
          v-if="chartSpecies"
          class="pa-2"
          outlined
          tile
        >
          <BarChart
            ref-name="barSpeciesPol2"
            :fields-chart="chartSpecies"
          />
        </v-card>
      </v-col>
      <v-col
        md="12"
        sm="12"
        lg="6"
      >
        <v-card
          v-if="chartLinks"
          class="pa-2"
          outlined
          tile
        >
          <PieChart
            ref-name="pieLinkPol2"
            :fields-chart="chartLinks"
            :link-work="false"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        md="12"
        sm="12"
        lg="6"
      >
        <v-card
          v-if="chartFunders"
          class="pa-2"
          outlined
          tile
        >
          <BarChart
            :ref-name="'barFundersPol2'"
            :fields-chart="chartFunders"
          />
        </v-card>
      </v-col>
      <v-col
        md="12"
        sm="12"
        lg="6"
      >
        <v-card
          v-if="chartNonFunders"
          class="pa-2"
          outlined
          tile
        >
          <BarChart
            ref-name="barNonFundersPol2"
            :fields-chart="chartNonFunders"
          />
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        md="12"
        sm="12"
        lg="6"
      >
        <v-card
          v-if="chartMaintainers"
          class="pa-2"
          outlined
          tile
        >
          <PieChart
            ref-name="pieMaintainerPol2"
            :fields-chart="chartMaintainers"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import BarChart from "@/components/Static/Statistics/BarChart.vue"
  import PieChart from "@/components/Static/Statistics/PieChart.vue"

  export default {
    name: "StatsPolicy",
    components: {
      BarChart,
      PieChart
    },
    props: {
      chartSubjects:{
        type: Object,
        default: null
      },
      chartCountries:{
        type: Object,
        default: null
      },
      chartSpecies:{
        type: Object,
        default: null
      },
      chartLinks:{
        type: Object,
        default: null
      },
      chartFunders:{
        type: Object,
        default: null
      },
      chartNonFunders:{
        type: Object,
        default: null
      },
      chartMaintainers:{
        type: Object,
        default: null
      }
    }
  }
</script>
