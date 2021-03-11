<template>
  <div class="d-flex flex-row mt-8">
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
          <Icon item="howToCite" />
          <v-card-title class="pa-0 text--primary card-title-customize">
            How to cite this record
          </v-card-title>
          <v-card-text class="ma-0 pt-8 card-text-customize">
            <span
              v-if="getField('abbreviation') && getField('name')"
              class="mr-2"
            >
              <span class="mr-2"><span class="mr-2">FAIRsharing.org:</span>{{ getField('abbreviation')+';' }}</span>
              <span>{{ getField('name') }},</span>
            </span>
            <b v-if="getField('doi')"><span class="mr-2">DOI:</span></b><a
              :href="'https://doi.org/'+getField('doi')"
              class="mr-2"
            >{{ getField('doi') }},</a>
            <b v-if="getField('lastEdited')"><span class="mr-2">Last Edited:</span></b><span class="mr-2">{{moment( getField('lastEdited'))}},</span>
            <b v-if="getField('lastEditor')!==null"><span class="mr-2">Last Editor:</span></b><span
              v-if="getField('lastEditor')!==null && getField('lastEditor').username"
              class="mr-2"
            >{{ getField('lastEditor').username }},</span>
            <b><span class="mr-2">Last Accessed:</span></b><span class="mr-2">{{ moment(new Date()) }}</span>
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
          <Icon item="PublicationCitation" />
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
                    {{ publication.title }}
                    {{ $vuetify.breakpoint.lgAndUp?truncate(publication.authors,100):truncate(publication.authors,30) }}
                    ({{ publication.year }})
                    <a
                      :href="'https://pubmed.ncbi.nlm.nih.gov/' + citation.pubmed_id"
                      target="_blank"
                    >
                      {{ citation.doi }}
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
import {mapGetters} from "vuex";
import Icon from "@/components/Icon"
import {truncate} from "@/utils/stringUtils"
import moment from "moment";

export default {
  name: "Citations",
  components: { Icon },
  mixins: [ truncate ],
  data: () => {
    return {
      currentDate: new Date()
    }
  },
  computed: {
    ...mapGetters("record", ["getField"]),
  },
  methods:{
    moment (date) {
      return moment(date).format('dddd, MMMM Do YYYY, H:mm');
    }
  }
}
</script>

<style scoped>
.card-text-customize {
  max-height: 120px;
  min-height: 120px;
  overflow: hidden
}

.card-title-customize {
  position: absolute;
  top: 5px;
  left: 120px
}
</style>
