<template>
  <v-container>
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
            ref-name="barSpeciesStand2"
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
          v-if="chartImplements"
          class="pa-2"
          outlined
          tile
        >
          <BarChart
            :ref-name="'barImplementsStand2'"
            :fields-chart="chartImplements"
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
          v-if="chartLinks"
          class="pa-2"
          outlined
          tile
        >
          <PieChart
            ref-name="pieLinkStand2"
            :fields-chart="chartLinks"
            :link-work="false"
          />
        </v-card>
      </v-col>
      <v-col
        md="12"
        sm="12"
        lg="6"
      >
        <v-card
          v-if="chartJournals"
          class="pa-2"
          outlined
          tile
        >
          <BarChart
            ref-name="barJourStand2"
            :fields-chart="chartJournals"
            :show-percent="false"
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
          v-if="chartLicences"
          class="pa-2"
          outlined
          tile
        >
          <BarChart
            ref-name="barLicencesStand2"
            :fields-chart="chartLicences"
          />
        </v-card>
      </v-col>
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
            :ref-name="'barFundersStand2'"
            :fields-chart="chartFunders"
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
          v-if="chartNonFunders"
          class="pa-2"
          outlined
          tile
        >
          <BarChart
            ref-name="barNonFundersStand2"
            :fields-chart="chartNonFunders"
          />
        </v-card>
      </v-col>
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
            ref-name="pieMaintainerStand2"
            :fields-chart="chartMaintainers"
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
          v-if="chartPublication"
          class="pa-2"
          outlined
          tile
        >
          <PieChart
            ref-name="piePublicationStand"
            :fields-chart="chartPublication"
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
    name: "StatsStandard",
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
      chartImplements:{
        type: Object,
        default: null
      },
      chartLinks:{
        type: Object,
        default: null
      },
      chartJournals:{
        type: Object,
        default: null
      },
      chartLicences:{
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
      },
      chartPublication:{
        type: Object,
        default: null
      }
    }
  }
</script>
