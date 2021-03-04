<template>
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <SectionTitle
      title="Publications"
      :inactive-section="getField('publications').length===0 || getField('publications')===undefined"
    />
    <v-row
      dense
      class="ml-2 min-height-40"
    >
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
          class="pa-4 d-flex flex-column v-card-hover"
          outlined
          color="white"
          tile
          elevation="3"
        >
          <!-- title, url -->
          <v-card-text
            v-if="publication.url"
            class="pa-0 text-ellipses-height-3lines min-height-68"
          >
            {{ publication.title }}
          </v-card-text>
          <p
            v-else
            class="ma-0"
          >
            {{ publication.title }}
          </p>

          <!-- authors -->
          <div v-if="publication.authors">
            <p class="ma-0">
              {{ truncate(prettifyList(publication.authors),50) }}
            </p>
          </div>

          <!-- Journals -->
          <div
            v-if="publication.journal"
            class="min-height-68"
          >
            <strong class="ma-0">
              {{ publication.journal }}<span v-if="publication.year">, {{ publication.year }}</span>
            </strong>
          </div>

          <div class="d-flex flex-row mt-2 align-center">
            <!-- pubmed -->
            <v-btn
              v-if="checkLinkValue(publication.pubmedId)"
              text
              outlined
              small
              class="mr-4"
            >
              <a
                :href="'https://pubmed.ncbi.nlm.nih.gov/' + publication.pubmedId"
                target="_blank"
              >
                View on PubMed
              </a>
            </v-btn>
            <!-- doi -->
            <v-btn
              v-if="checkLinkValue(publication.doi)"
              text
              outlined
              small
            >
              <a
                :href="'https://doi.org/' + publication.doi"
                target="_blank"
              >
                View Publication
              </a>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
    import { mapGetters } from 'vuex';
    import stringUtils from '@/utils/stringUtils';
    import SectionTitle from '@/components/Records/Record/SectionTitle';

    export default {
        name: "Publications",
        components: {
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

<style scoped lang="scss">
a {
  text-decoration: none;

  &:hover, &:focus {
    text-decoration: underline;
    outline: 0;
  }
}

.v-card-hover {
  -webkit-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0) 0 1px 7px 0 !important;
  -moz-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0) 0 1px 7px 0 !important;
  box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0) 0 1px 7px 0 !important;
  transition: box-shadow .4s linear;
  -webkit-transition: box-shadow .4s linear;
  -moz-transition: box-shadow .4s linear;
  -o-transition: box-shadow .4s linear;
}

.v-card-hover:hover {
  transform: scale(1.004);
  -webkit-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0.2) 0 1px 7px 0 !important;
  -moz-box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0.2) 0 1px 7px 0 !important;
  box-shadow: rgba(255, 255, 255, 0.1) 0 1px 0, rgba(0, 0, 0, 0.2) 0 1px 7px 0 !important;
}
</style>
