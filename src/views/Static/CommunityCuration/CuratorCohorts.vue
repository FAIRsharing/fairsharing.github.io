<template>
  <main class="pa-15 mb-10">
    <div v-if="error">
      <NotFound />
    </div>
    <div v-else>
      <v-container fluid>
        <v-row dense>
          <v-col
            cols="12"
            lg="7"
            md="7"
            sm="12"
          >
            <h1
              class="header"
              :class="{'smallerHeading' : $vuetify.breakpoint.xs}"
            >
              {{ alumniCurator ? "Alumni Community Curators": `Community Curators for ${ year }` }}
            </h1>
          </v-col>
          <v-col
            cols="12"
            lg="3"
            md="3"
            sm="12"
          >
            <v-btn
              class="full-width white--text"
              height="40"
              :class="[alumniCurator ? 'green': 'accent3',{'mb-2': $vuetify.breakpoint.smAndDown}]"
              @click="listAlumni()"
            >
              {{ alumniCurator ? "View Current Curators": "View Alumni" }}
            </v-btn>
          </v-col>
          <v-col
            cols="12"
            lg="2"
            md="2"
            sm="12"
          >
            <v-select
              v-model="year"
              :items="yearList"
              label="Year"
              outlined
              dense
              @change="selectYear()"
            />
          </v-col>
        </v-row>
        <v-row
          v-if="currentCohort.length"
          dense
        >
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
                :src="card.logo ? `/assets/Community/profiles/${card.logo}` : '/assets/Community/profiles/profileplaceholder.png'"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                cover
                aspect-ratio="1"
              >
                <v-card-actions style="position: absolute; top: 0; right: 0">
                  <v-btn
                    icon
                    :class="card.show_more ? 'showMore' : 'showLess'"
                    @click="card.show_more = !card.show_more"
                  >
                    <v-icon
                      class="toggleIcon"
                      color="white"
                      dense
                    />
                  </v-btn>
                </v-card-actions>
                <div
                  class="socialLinks"
                  :class="{'hide': !card.show_more}"
                >
                  <v-list-item class="align-baseline">
                    <v-list-item-content>
                      <v-list-item
                        v-if="card.orcid"
                        dark
                      >
                        <a
                          :href="`https://orcid.org/${card.orcid}`"
                          target="_blank"
                          class="d-flex align-center"
                        >
                          <v-icon
                            left
                            class="mr-2"
                          >
                            {{ 'fab fa-orcid' }}
                          </v-icon><span>{{ card.orcid }}</span></a>
                      </v-list-item>
                      <v-list-item
                        v-if="card.twitter"
                        dark
                      >
                        <a
                          :href="`https://twitter.com/${card.twitter}`"
                          target="_blank"
                          class="d-flex align-center"
                        ><v-icon
                          left
                          class="mr-2"
                        >
                          {{ 'fab fa-twitter' }}
                        </v-icon><span>@{{ card.twitter }}</span></a>
                      </v-list-item>
                      <v-list-item
                        v-if="card.linkedin"
                        dark
                      >
                        <a
                          :href="`https://linkedin.com/in/${card.linkedin}`"
                          target="_blank"
                          class="d-flex align-center"
                        ><v-icon
                          left
                          class="mr-2"
                        >
                          {{ 'fab fa-linkedin' }}
                        </v-icon><span>{{ card.linkedin }}</span></a>
                      </v-list-item>
                    </v-list-item-content>
                  </v-list-item>
                </div>

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
                    small
                  >
                    Early Adopter
                  </v-chip>
                </v-card-subtitle>
              </v-img>

              <v-card-text
                class="text--primary"
                style="height: 100%"
                :style="$vuetify.breakpoint.xl ? 'height: 115px': $vuetify.breakpoint.mdAndUp ? 'height: 135px' : 'height: 100%'"
              >
                <div v-if="card.organisation && card.organisation.length">
                  Organisation :
                  <span
                    v-for="(org, i) in card.organisation"
                    :key="org.id"
                  >
                    <v-tooltip
                      v-if="org.tooltip"
                      bottom
                    >
                      <template #activator="{ on }">
                        <a
                          :href="`/organisations/${org.id}`"
                          class="d-inline-block"
                          v-on="on"
                        >{{ org.name }}
                        </a>
                      </template>
                      <span>{{ org.tooltip }}</span>
                    </v-tooltip>
                    <a
                      v-else
                      :href="`/organisations/${org.id}`"
                      class="d-inline-block"
                    >{{ org.name }}
                    </a>
                    <span v-if="i+1 < card.organisation.length">, </span>
                  </span>
                </div>

                <div v-if="card.scope">
                  Scope : {{ card.scope }}
                </div>
                <div>
                  Years Active : {{ card.year_active.join(", ") }}
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


export default {
  name: "CuratorCohorts",
  components: { NotFound },
  data: () => {
    return {
      communityCurationCohorts: communityCurationCohorts,
      currentCohort: [],
      year: new Date().getFullYear(),
      error: false,
      yearList: [],
      alumniCurator: false
    }
  },
   mounted() {
      this.error = !Object.keys(this.communityCurationCohorts).length
      this.getCuratorsList(this.year)

  },
  methods: {
    getCuratorsList(yearSelected) {
      if (Object.keys(this.communityCurationCohorts).length) {
        this.alumniCurator = false
        this.error = false;
        const yearsActiveList = this.communityCurationCohorts.data.map(el => el.year_active)

        this.yearList = [...new Set(yearsActiveList.flat(1))].sort().reverse()

        this.communityCurationCohorts.data = this.communityCurationCohorts.data.sort((a, b) => a.name.localeCompare(b.name))
        this.currentCohort = this.communityCurationCohorts.data.filter(curator => {
          return curator.year_active.includes(yearSelected.toString())
        })

      }
      else {
        this.error = true;
      }
    },
    selectYear() {
      this.getCuratorsList(parseInt(this.year))
    },
    listAlumni(){
      this.alumniCurator = !this.alumniCurator
      if(this.alumniCurator) {
        this.currentCohort = this.communityCurationCohorts.data.filter(curator => {
          return curator.year_active.every(el => el < new Date().getFullYear())
        })
        this.year = null;
      } else {
        this.year = new Date().getFullYear();
        this.getCuratorsList(new Date().getFullYear())
      }
    },
  }
}
</script>

<style scoped lang="scss">

.showLess {
  &:after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    border: 27px solid transparent;
    border-top: 27px solid var(--v-primary-base);
    border-right: 27px solid var(--v-primary-base);
  }
}

.toggleIcon {
  .showMore & {
    transform: rotate(45deg);
  }
  z-index: 2;
  opacity: 0.9;
  width:18px !important;
  height:18px !important;
  &:before {
    content: "";
    width: 100%;
    height: 2px;
    position: absolute;
    top: 50%;
    opacity: 1;
    background-color: #fff;
    transform: translateY(-50%);
  }
  &:after {
    content: "";
    width: 2px;
    height: 100%;
    position: absolute;
    border-radius: 0;
    left: 50%;
    opacity: 1;
    background-color: #fff;
    transform: translateX(-50%);
  }
}

.socialLinks {
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--v-primary-base);
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.9;
  transition: all 0.4s;
  a {
    color: white;
  }
}
.hide {
  opacity: 0;
  height: 0;
  overflow: hidden;
  transform:translate(50%, 0);
}
.smallerHeading {
  font-size: 1.6em;
}
</style>