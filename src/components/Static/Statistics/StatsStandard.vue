<template>
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
          ref-name="barSubjectsStand2"
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
          :ref-name="'barCountriesStand2'"
          :fields-chart="chartCountries"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import BarChart from "@/components/Static/Statistics/BarChart.vue"
  export default {
    name: "StatsStandard",
    components: {
      BarChart
    },
    props: {
      chartSubjects:{
        type: Object,
        default: null
      },
      chartCountries:{
        type: Object,
        default: null
      }
    }
  }
</script>
