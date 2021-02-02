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
          <div class="icon-container d-flex justify-center">
            <v-icon large>
              {{ $vuetify.icons.values.howToCite }}
            </v-icon>
          </div>
          <v-card-title class="pa-0 text--primary card-title-customize">
            How to cite this record
          </v-card-title>
          <v-card-text class="ma-0 pt-8 card-text-customize">
            <span v-if="getField('abbreviation') && getField('name')">
              FAIRsharing.org:{{ getField('abbreviation')+';'+getField('name') }}
            </span>
            <b v-if="getField('doi')">DOI:</b>{{ getField('doi') }};
            <b v-if="getField('lastEdited')">Last Edited:</b>{{ getField('lastEdited') }}
            <b>Last Accessed:</b>{{ getCurrentDate() }}
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
          <div class="icon-container d-flex justify-center">
            <v-icon large>
              {{ $vuetify.icons.values.PublicationCitation }}
            </v-icon>
          </div>
          <v-card-title class="pa-0 card-title-customize">
            Publication for citation
          </v-card-title>
          <v-card-text class="ma-0 pt-8 card-text-customize">
            <div
              v-for="citation in getField('metadata')['citations']"
              :key="citation.id+'_'+citation.pubmed_id"
            >
              <div
                v-for="publication in getField('publications')"
                :key="publication.title"
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
import {truncate} from "@/utils/stringUtils"

export default {
  name: "Citations",
  mixins:[truncate],
  data: () => {
    return {
      currentDate: new Date()
    }
  },
  computed: {
    ...mapGetters("record", ["getField"]),
  },
  methods: {
    getCurrentDate() {
      return this.currentDate.getDate() + "/"
          + (this.currentDate.getMonth() + 1) + "/"
          + this.currentDate.getFullYear() + " at "
          + this.currentDate.getHours() + ":"
          + this.currentDate.getMinutes() + ":"
          + this.currentDate.getSeconds();
    }
  }
}
</script>

<style scoped>
.icon-container {
  position: absolute;
  top: -45px;
  background: white;
  border: #b3b3b3 dotted 3px;
  border-radius: 50%!important;
  -moz-border-radius: 50%!important;
  -webkit-border-radius: 50%!important;
  width: 85px;
  height: 85px;
  cursor: help;
}

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
