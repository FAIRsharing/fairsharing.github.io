<template>
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <SectionTitle title="Publications" />
    <NoneFound :data-field="getField('publications')" />
    <v-row>
      <v-col
        v-for="(publication,index) in getField('publications')"
        :key="publication.title+'_'+index"
        class="mt-1"
        cols="12"
        sm="12"
        md="6"
        lg="4"
        xl="3"
      >
        <v-card
          class="pa-4 d-flex flex-column"
          outlined
          color="white"
          tile
          elevation="3"
        >
          <!-- title, url -->
          <div class="d-flex mt-2 ">
            <v-tooltip left>
              <template #activator="{ on }">
                <v-sheet
                  class="mb-2 flag-mr"
                  v-on="on"
                >
                  <v-icon
                    color="secondary"
                    class="mr-2"
                  >
                    fas fa-font
                  </v-icon>
                </v-sheet>
              </template>

              <span>Title</span>
            </v-tooltip>
            <p
              v-if="publication.url"
              class="ma-0"
            >
              <a
                :href="publication.url"
                target="_blank"
              >{{ publication.title }}</a>
            </p>
            <p
              v-else
              class="ma-0"
            >
              {{ publication.title }}
            </p>
          </div>

          <!-- Journals -->
          <div
            v-if="publication.journal"
            class="d-flex mt-2 "
          >
            <v-tooltip left>
              <template #activator="{ on }">
                <v-sheet
                  class="mb-2 flag-mr"
                  v-on="on"
                >
                  <v-icon
                    color="secondary"
                    class="mr-2"
                  >
                    fas fa-book
                  </v-icon>
                </v-sheet>
              </template>
              <span>Journal</span>
            </v-tooltip>
            <p class="ma-0">
              {{ publication.journal }}<span v-if="publication.year">, {{ publication.year }}</span>
            </p>
          </div>

          <!-- authors -->
          <div
            v-if="publication.authors"
            class="d-flex mt-2 "
          >
            <v-tooltip left>
              <template #activator="{ on }">
                <v-sheet
                  class="mb-2 flag-mr"
                  v-on="on"
                >
                  <v-icon
                    color="secondary"
                    class="mr-2"
                  >
                    fas fa-people-arrows
                  </v-icon>
                </v-sheet>
              </template>
              <span>Authors</span>
            </v-tooltip>
            <p class="ma-0">
              {{ prettifyList(publication.authors) }}
            </p>
          </div>

          <!-- doi -->
          <div
            v-if="checkLinkValue(publication.doi)"
            class="d-flex mt-2 "
          >
            <v-tooltip left>
              <template #activator="{ on }">
                <v-sheet
                  class="mb-2 flag-mr"
                  v-on="on"
                >
                  <v-icon
                    color="secondary"
                    class="mr-2"
                  >
                    fas fa-file-alt
                  </v-icon>
                </v-sheet>
              </template>
              <span>DOI</span>
            </v-tooltip>
            <p class="ma-0">
              <a
                :href="'https://doi.org/' + publication.doi"
                target="_blank"
              >
                {{ publication.doi }}
              </a>
            </p>
          </div>

          <!-- pubmed -->
          <div
            v-if="checkLinkValue(publication.pubmedId)"
            class="d-flex mt-2 "
          >
            <v-tooltip left>
              <template #activator="{ on }">
                <v-sheet
                  class="mb-2 flag-mr"
                  v-on="on"
                >
                  <v-icon
                    color="secondary"
                    class="mr-2"
                  >
                    fas fa-file-medical
                  </v-icon>
                </v-sheet>
              </template>
              <span>PubMed ID</span>
            </v-tooltip>
            <p class="ma-0">
              <a
                :href="'https://pubmed.ncbi.nlm.nih.gov/' + publication.pubmedId"
                target="_blank"
              >
                {{ publication.pubmedId }}
              </a>
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';

    import stringUtils from '@/utils/stringUtils';
    import NoneFound from '@/components/Records/Record/NoneFound';
    import SectionTitle from '@/components/Records/Record/SectionTitle';

    export default {
        name: "Publications",
        components: {
            NoneFound,
            SectionTitle
        },
        mixins: [stringUtils],
        computed: {
            ...mapGetters("record", ["getField"])
        },
        methods: {
          checkLinkValue: (link) => {
            if (!link) {
              return false;
            } else if ((link.toLowerCase() === 'missing') || link === 0 || link === "0") {
              return false;
            }
            return true;
          }
        }
    }
</script>

<style scoped>

</style>
