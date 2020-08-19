<template>
  <v-card
    class="pa-4 mt-5 d-flex flex-column"
    outlined
    tile
    elevation="1"
  >
    <SectionTitle title="Publications" />
    <NoneFound :data-field="getField('publications')" />
    <v-card
      v-for="(publication,index) in getField('publications')"
      :key="publication.title"
      class="pr-2 pl-4 pt-1 pb-2 d-flex flex-column"
      :class="index === 0 ? 'mt-4':'mt-2'"
      flat
      outlined
    >
      <!-- title, url -->
      <div class="d-flex mt-2 ">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-sheet
              class="mb-2 flag-mr"
              v-on="on"
            >
              <v-icon
                color="secondary"
                class="mr-2"
              >
                mdi-format-title
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

      <!-- authors -->
      <div
        v-if="publication.journal"
        class="d-flex mt-2 "
      >
<<<<<<< HEAD
        <v-icon
          color="secondary"
          class="mr-2"
        >
          mdi-book-open-page-variant
        </v-icon>
=======
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-sheet
              class="mb-2 flag-mr"
              v-on="on"
            >
              <v-icon
                color="secondary"
                class="mr-2"
              >
                mdi-book
              </v-icon>
            </v-sheet>
          </template>
          <span>Journal</span>
        </v-tooltip>
>>>>>>> a0304e3756a87a4c6f0af3dc52f182783d7b0948
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
          <template v-slot:activator="{ on }">
            <v-sheet
              class="mb-2 flag-mr"
              v-on="on"
            >
              <v-icon
                color="secondary"
                class="mr-2"
              >
                mdi-human-male-female
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
        v-if="publication.doi"
        class="d-flex mt-2 "
      >
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-sheet
              class="mb-2 flag-mr"
              v-on="on"
            >
              <v-icon
                color="secondary"
                class="mr-2"
              >
                mdi-file-cabinet
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
        v-if="publication.pubmedId"
        class="d-flex mt-2 "
      >
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-sheet
              class="mb-2 flag-mr"
              v-on="on"
            >
              <v-icon
                color="secondary"
                class="mr-2"
              >
                mdi-medical-bag
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
        }
    }
</script>

<style scoped>

</style>
