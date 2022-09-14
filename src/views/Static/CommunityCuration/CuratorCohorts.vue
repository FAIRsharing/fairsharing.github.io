<template>
  <main class="pa-15 mb-10">
    <div v-if="error">
      <NotFound />
    </div>
    <div v-else>
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="card in currentCohort"
            :key="card.id"
            cols="12"
            sm="12"
            md="4"
            lg="3"
            xl="2"
          >
            <v-card
              class="full-width"
            >
              <v-img
                :src="card.logo ? card.logo : profilePlaceholder"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                cover
                aspect-ratio="1"
              >
                <v-card-actions>
                  <v-btn
                      icon
                      @click="show = !show"
                  >
                    <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </v-card-actions>
                <v-card-title>
                  <h4 style="word-break: initial">
                    {{ card.name }}
                  </h4>
                </v-card-title>
                <v-card-subtitle
                  v-if="card.early_adopter"
                >
                  <v-chip
                    class="ma-0"
                    color="pink"
                    label
                    text-color="white"
                    append-icon="mdi-label"
                    small
                  >
                    Early Adopter
                  </v-chip>
                </v-card-subtitle>
              </v-img>

              <v-card-text
                class="text--primary"
                style="height:70px"
              >
                <div v-if="card.organisation">
                  Organisation : {{ card.organisation }}
                </div>

                <div v-if="card.scope">
                  Scope : {{ card.scope }}
                </div>
              </v-card-text>

              <v-card-actions
                v-if="card.id"
                class="pa-0 full-width"
              >
                <v-btn
                  elevation="2"
                  dark
                  color="primary"
                  :href="`/users/${card.id}`"
                  rel="external"
                  target="_blank"
                  class="full-width py-6"
                  tile
                >
                  <v-icon
                    left
                    class="mr-2"
                  >
                    {{ 'fa fa-user-circle' }}
                  </v-icon>
                  <span
                    class="text-truncate text-capitalize full-width"
                    :style=" $vuetify.breakpoint.xs ? 'max-width: 166px': 'max-width: 236px'"
                  > Meet {{ card.name }}</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </main>
</template>

<script>
import communityCurationCohorts from '@/data/communityCurationCohorts.json';
import NotFound from "@/views/Errors/404"
import profilePlaceholder from "@/assets/placeholders/profile.png"


export default {
  name: "CuratorCohorts",
  components: { NotFound },
  data: () => {
    return {
      communityCurationCohorts: communityCurationCohorts,
      currentCohort: [],
      year: 0,
      error: false,
      profilePlaceholder: profilePlaceholder
    }
  },
  async mounted() {
    this.year = this.$route.params.year;
    if (this.year in communityCurationCohorts) {
      this.currentCohort = communityCurationCohorts[this.year];
    }
    else {
      this.error = true;
    }
  }
}
</script>

<style scoped>


</style>