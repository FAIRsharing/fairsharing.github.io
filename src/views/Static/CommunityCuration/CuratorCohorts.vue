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
            lg="6"
            md="6"
            sm="12"
          >
            <h1
              class="header"
              :class="{'smallerHeading' : $vuetify.display.xs}"
            >
              {{ alumniCurator ? "Alumni Community Champions": `Community Champions for ${ year }` }}
            </h1>
          </v-col>
          <v-col
            cols="12"
            lg="2"
            md="2"
            sm="12"
          >
            <v-btn
              elevation="2"
              class="full-width text-white text-md-caption text-lg-body-1 font-weight-medium"
              height="40"
              :class="[alumniCurator ? 'bg-green': 'bg-accent3',{'mb-2': $vuetify.display.smAndDown}]"
              style="text-transform: uppercase !important;"
              @click="listAlumni()"
            >
              {{ alumniCurator ? "View Current Champions": "View Alumni" }}
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
              variant="solo"
              :items="yearList"
              label="Year"
              density="compact"
              @update:model-value="selectYear()"
            />
          </v-col>
          <v-col
            cols="12"
            lg="2"
            md="2"
            sm="12"
          >
            <v-btn
              elevation="2"
              class="full-width text-white bg-green text-md-caption text-lg-body-1 font-weight-medium"
              :class="{'mt-n4 mb-4' : $vuetify.display.smAndDown}"
              height="40"
              href="/community_champions"
              style="text-transform: uppercase !important;"
            >
              Community champions
            </v-btn>
          </v-col>
        </v-row>
        <v-row
          v-if="curatorQuotes.length"
          class="mt-0"
        >
          <v-col
            v-for="quote in curatorQuotes"
            :key="quote.author"
            cols="12"
            lg="6"
            md="6"
            sm="12"
          >
            <div
              class="mb-2"
            >
              <p style="text-align: initial;">
                <span class="font-italic">
                  {{ quote.text }}
                </span>
                <br>
                <span class="font-weight-bold">
                  {{ quote.author }}
                </span> -
                <span> {{ quote.scope }} </span>
              </p>
            </div>
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
                class="text-white align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                cover
                aspect-ratio="1"
              >
                <v-card-actions style="position: absolute; top: 0; right: 7px">
                  <div
                    :class="card.show_more ? 'showMore' : 'showLess'"
                  >
                    <div
                      class="toggleIcon"
                      @click="card.show_more = !card.show_more"
                    />
                  </div>
                </v-card-actions>
                <div
                  class="socialLinks"
                  :class="{'hide': !card.show_more}"
                >
                  <v-list class="align-baseline bg-transparent">
                    
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
                            start
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
                          start
                          class="mr-2"
                        >
                          {{ 'fab fa-twitter' }}
                        </v-icon><span>@{{ card.twitter }}</span></a>
                      </v-list-item>
                      <v-list-item
                        v-if="card.mastodon"
                        dark
                      >
                        <a
                          :href="`https://${card.mastodon}`"
                          target="_blank"
                          class="d-flex align-center"
                        ><v-icon
                          start
                          class="mr-2"
                        >
                          {{ 'fab fa-mastodon' }}
                        </v-icon><span>@{{ card.mastodon }}</span></a>
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
                          start
                          class="mr-2"
                        >
                          {{ 'fab fa-linkedin' }}
                        </v-icon><span>{{ card.linkedin }}</span></a>
                      </v-list-item>
                    
                  </v-list>
                  <v-card-subtitle
                    v-for="skill in card.gained_skills"
                    :key="skill.name"
                    class="mb-n5 mt-n4"
                  >
                    <v-chip
                      class="pa-1 text-white bg-pink"
                      color="pink"
                      label
                      size="small"
                      :href="skill.url"
                      target="_blank"
                    >
                      {{ skill.name }}
                    </v-chip>
                  </v-card-subtitle>
                </div>

                <v-card-title>
                  <h4 style="word-break: initial">
                    {{ card.name }}
                  </h4>
                </v-card-title>
                <v-card-subtitle
                  v-if="card.early_adopter || card.curator_expert"
                  class="opacity-100 overflow-initial mb-4"
                >
                  <v-row>
                    <v-chip
                      v-if="card.early_adopter"
                      class="ml-2 text-white bg-pink"
                      label
                      size="small"
                    >
                      Early Adopter
                    </v-chip>
                    <v-chip
                      v-if="card.curator_expert"
                      class="ml-2 text-white bg-pink"
                      label
                      size="small"
                    >
                      Curation Expert
                    </v-chip>
                  </v-row>
                </v-card-subtitle>
              </v-img>

              <v-card-text
                class="text--primary"
                style="height: 100%"
                :style="$vuetify.display.xlOnly ? 'height: 115px': $vuetify.display.mdAndUp ? 'height: 135px' : 'height: 100%'"
              >
                <div v-if="card.organisation && card.organisation.length">
                  Organisation :
                  <span
                    v-for="(org, i) in card.organisation"
                    :key="org.id"
                  >
                    <v-tooltip
                      v-if="org.tooltip"
                      location="bottom"
                    >
                      <template #activator="{ props }">
                        <a
                          :href="`/organisations/${org.id}`"
                          class="d-inline-block"
                          v-bind="props"
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
                <a
                  v-if="card.gained_skills"
                  @click="card.show_more = !card.show_more"
                >
                  Skills gained : {{ card.gained_skills.length }}
                </a>
              </v-card-text>

              <v-card-actions
                v-if="card.id"
                class="pa-0 full-width mb-n1"
              >
                <v-btn
                  color="primary"
                  :href="`/users/${card.id}`"
                  class="full-width"
                  variant="flat"
                  height="48px"
                >
                  <v-icon
                    start
                    class="mr-2"
                  >
                    {{ 'fas fa-user-circle' }}
                  </v-icon>
                  <span
                    class="text-truncate text-capitalize full-width"
                    :style=" $vuetify.display.xs ? 'max-width: 166px': 'max-width: 236px'"
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
      alumniCurator: false,
      curatorQuotes: communityCurationCohorts.quotes
    }
  },
  mounted() {
    this.error = !Object.keys(this.communityCurationCohorts).length
    this.getCuratorsList(this.year)
  },
  methods: {
    getCuratorsList(yearSelected) {
      if (Object.keys(this.communityCurationCohorts).length) {
        /*
         * Due to https://github.com/FAIRsharing/fairsharing.github.io/issues/2371 (i.e. a change in requirements
         * after building) this has become unnecessarily complex. Curators will need to both set a champion's active
         * years and an active boolean to have them appear in the correction place. The options are:
         * -> current year + active => current
         * -> current year + !active => alumnus
         * -> previous year + active => invisible
         * -> previous year + !active => alumnus
         */
        this.alumniCurator = false
        this.error = false;
        const yearsActiveList = this.communityCurationCohorts.data.map(el => el.year_active)

        this.yearList = [...new Set(yearsActiveList.flat(1))].sort().reverse()

        this.communityCurationCohorts.data = this.communityCurationCohorts.data.sort((a, b) => a.name.localeCompare(b.name))
        this.currentCohort = this.communityCurationCohorts.data.filter(curator => {
          return curator.year_active.includes(yearSelected.toString()) && curator.active
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
          return curator.year_active.every(el => el < new Date().getFullYear()) || !curator.active
        })
        this.year = null;
      }
      else {
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
    top: 8px;
    opacity: 1;
    border-radius: unset;
    border: 27px solid transparent;
    border-top: 27px solid rgb(var(--v-theme-primary));
    border-right: 27px solid rgb(var(--v-theme-primary));
  }
}

.toggleIcon {
  position: absolute;
  top: 15px;
  right: 7px;
  cursor: pointer;
  .showMore & {
    transform: rotate(45deg);
  }
  transition: .3s cubic-bezier(.25,.8,.5,1), visibility 0s;
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
  background-color: rgb(var(--v-theme-primary));
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
