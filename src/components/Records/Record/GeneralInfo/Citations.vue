<template>
  <div
    class="d-flex flex-row mt-8"
  >
    <v-row>
      <!--How to cite this record-->
      <v-col
        cols="12"
        sm="12"
        md="6"
      >
        <v-card
          class="pa-4 d-flex flex-column"
          outlined
          color="white"
          tile
          elevation="3"
        >
          <Icon
            item="howToCite"
            size="10"
          />
          <v-card-title class="pa-0 text--primary card-title-customize">
            How to cite this record
          </v-card-title>
          <v-card-text class="ma-0 pt-8 card-text-customize">
            <span
              v-if="getField('name')"
            >
              FAIRsharing.org:
            </span>
            <span
              v-if="getField('abbreviation')"
            >
              {{ getField('abbreviation')+';' }}
            </span>{{ getField('name') }},

            <span v-if="getField('id') && !getField('doi')">
              <b>
                FAIRsharing ID:
                <router-link :to="`${getField('id')}`">{{ getHostname() + getField('id') }}</router-link>
              </b>,
            </span>


            <span v-if="getField('doi')">
              <b>
                DOI:
                <a :href="'https://doi.org/'+getField('doi')">{{ getField('doi') }}</a>,
              </b>
            </span>

            <b v-if="getField('lastEdited')">
              Last Edited: {{ moment( getField('lastEdited')) }},
            </b>
            <b v-if="getField('lastEditor')!==null"><span class="mr-2">Last Editor:</span></b><span
              v-if="getField('lastEditor')!==null && getField('lastEditor').username"
              class="mr-2"
            >{{ getField('lastEditor').username }},</span>
            <b>Last Accessed:</b>
            <span
              class="mr-2"
            >
              {{ moment(new Date()) }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
      <!--Publication for citation-->
      <v-col
        cols="12"
        sm="12"
        md="6"
        class="mt-md-0 mt-sm-8"
      >
        <v-card
          v-if="getField('metadata')['citations'] && getField('metadata')['citations'].length>0"
          class="pa-4 d-flex flex-column"
          outlined
          color="white"
          tile
          elevation="3"
        >
          <Icon
            item="PublicationCitation"
            size="10"
          />
          <v-card-title class="pa-0 card-title-customize">
            Publication for citation
          </v-card-title>
          <v-card-text class="ma-0 pt-8 card-text-customize">
            <div
              v-for="citation in getField('metadata')['citations']"
              :key="citation.id + '_' + citation.pubmed_id"
            >
              <div
                v-for="(publication, pubIndex) in getField('publications')"
                :key="'publicationCitation_' + pubIndex"
              >
                <span
                  v-if="publication.id === citation.publication_id"
                  class="d-flex flex-wrap"
                >
                  <p
                    class="ma-0 mr-2"
                  >
                    <b>{{ publication.title }}</b>:
                    {{ $vuetify.breakpoint.lgAndUp?truncate(publication.authors,500):truncate(publication.authors,150) }}
                    ({{ publication.year }})
                    <a
                      v-if="citation.doi"
                      :href="`https://doi.org/${citation.doi}`"
                      target="_blank"
                    >
                      {{ citation.doi }}
                    </a>
                    <a
                      v-if="citation.pubmed_id && !citation.doi"
                      :href="`https://pubmed.ncbi.nlm.nih.gov/${citation.pubmed_id}`"
                      target="_blank"
                    >
                      {{ citation.pubmed_id }}
                    </a>
                    <a
                      v-if="!citation.pubmed_id && !citation.doi && citation.url"
                      :href="citation.url"
                      target="_blank"
                    >
                      {{ citation.url }}
                    </a>
                  </p>
                </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
import Icon from "@/components/Icon"
import {truncate} from "@/utils/stringUtils"
import moment from "moment";
import getHostname from "@/utils/generalUtils";

export default {
  name: "Citations",
  components: { Icon },
  mixins: [ truncate, getHostname ],
  data: () => {
    return {
      currentDate: new Date()
    }
  },
  computed: {
    ...mapState("record", ["currentRecord"]),
    ...mapGetters("record", ["getField"]),
  },
  methods:{
    moment (date) {
      return moment(date).format('dddd, MMMM Do YYYY, H:mm');
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

.card-text-customize {
  min-height: 120px;
  overflow: hidden
}
</style>
