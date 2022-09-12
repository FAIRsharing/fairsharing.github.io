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
            :key="card.title"
            cols="12"
            sm="12"
            md="4"
            lg="3"
            class="my-md-4 my-xl-12"
          >
            <v-card
              max-width="300px"
              class="mx-auto"
            >
              <v-img
                :src="card.logo? card.logo : profilePlaceholder"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
                cover
              >
                <v-card-title v-text="card.name" />
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
                v-if="card.orcid"
              >
                <v-btn
                  elevation="2"
                  dark
                  color="success"
                  :href="`https://orcid.org/${card.orcid}`"
                  rel="external"
                  target="_blank"
                  max-width="284px"
                  class="full-width"
                >
                  <v-icon
                    left
                    class="mr-2"
                  >
                    {{ 'fab fa-orcid' }}
                  </v-icon>
                  <span
                    class="text-truncate"
                    :style=" $vuetify.breakpoint.xs ? 'max-width: 166px': 'max-width: 236px'"
                  > Meet {{ card.name }}</span>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <pre>
        {{ currentCohort }}
      </pre>
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

.text-truncate {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  max-width: 236px;
  text-transform: capitalize;
}

</style>