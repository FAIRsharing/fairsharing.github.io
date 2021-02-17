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
          class="pa-4 d-flex flex-column v-card-hover"
          outlined
          color="white"
          tile
          elevation="3"
        >
          <!-- title, url -->
          <v-card-text
            v-if="publication.url"
            class="pa-0 text-ellipses-height-3lines min-height-60"
          >
            <a
              :href="publication.url"
              target="_blank"
            >{{ publication.title }}</a>
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

          <!-- doi -->
          <!--          <div
            v-if="checkLinkValue(publication.doi)"
            class="d-flex"
          >
            <p class="ma-0">
              <a
                :href="'https://doi.org/' + publication.doi"
                target="_blank"
              >
                {{ publication.doi }}
              </a>
            </p>
          </div>-->


          <!-- Journals -->
          <div v-if="publication.journal">
            <strong class="ma-0">
              {{ publication.journal }}<span v-if="publication.year">, {{ publication.year }}</span>
            </strong>
          </div>

          <!-- pubmed -->
          <div
            v-if="checkLinkValue(publication.pubmedId)"
            class="d-flex mt-2 "
          >
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
