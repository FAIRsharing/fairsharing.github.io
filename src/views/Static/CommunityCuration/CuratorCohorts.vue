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
                <div class="socialLinks"
                :class="{'hide': !card.show_more}"
                >
                  <v-list-item class="align-baseline">
                    <v-list-item-content >
                      <v-list-item dark v-if="card.orcid">
                        <a
                          :href="`https://orcid.org/${card.orcid}`"
                          target="_blank"
                        >
                          <v-icon
                            left
                            class="mr-2"
                          >
                            {{ 'fab fa-orcid' }}
                          </v-icon>Orcid</a>
                      </v-list-item>
                      <v-list-item dark v-if="card.twitter">
                        <a
                          :href="`https://twitter.com/${card.twitter}`"
                          target="_blank"
                        ><v-icon
                          left
                          class="mr-2"
                        >
                          {{ 'fab fa-twitter' }}
                        </v-icon>@{{card.twitter}}</a>
                      </v-list-item>
                      <v-list-item dark v-if="card.linkedin">
                        <a
                          :href="`https://linkedin.com/in/${card.linkedin}`"
                          target="_blank"
                          text-decoration="underline"
                        ><v-icon
                          left
                          class="mr-2"
                        >
                          {{ 'fab fa-linkedin' }}
                        </v-icon>LinkedIn</a>
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
      communityCurationCohorts,
      currentCohort: [],
      year: 0,
      error: false,
      profilePlaceholder,
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
</style>