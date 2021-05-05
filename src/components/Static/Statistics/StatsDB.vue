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
            ref-name="barSubjectsDB2"
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
            :ref-name="'barCountriesDB2'"
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
            ref-name="barSpeciesDB2"
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
            :ref-name="'barImplementsDB2'"
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
            ref-name="pieLinkDB2"
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
            ref-name="barJourDB2"
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
            ref-name="barLicencesDB2"
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
            :ref-name="'barFundersDB2'"
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
            ref-name="barNonFundersDB2"
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
            ref-name="pieMaintainerDB2"
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
            ref-name="piePublicationDB"
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
    name: "StatsDB",
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
