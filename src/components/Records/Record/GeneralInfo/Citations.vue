<template>
  <div class="d-flex flex-row mt-8">
    <v-row>
      <!--How to cite this record-->
      <v-col cols="12" sm="12" md="6">
        <v-card
          class="pa-4 d-flex flex-column overflow-initial"
          border
          color="white"
          tile
          elevation="3"
        >
          <Icon size="20" item="howToCite" class="pt-2" />
          <v-card-title class="pa-0 text--primary card-title-customize">
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <v-icon class="mr-2" size="15" v-bind="props">
                  fas fa-question-circle
                </v-icon>
              </template>
              {{ recordTooltips["how_to_cite"] }}
            </v-tooltip>
            How to cite this record
          </v-card-title>
          <v-card-text class="ma-0 pt-8 card-text-customize">
            <span v-if="getField('name')"> FAIRsharing.org: </span>
            <span v-if="getField('abbreviation')">
              {{ getField("abbreviation") + ";" }} </span
            >{{ getField("name") }},

            <span v-if="getField('id') && !getField('doi')">
              <b>
                FAIRsharing ID:
                <router-link :to="`${getField('id')}`">{{
                  getHostname() + getField("id")
                }}</router-link> </b
              >,
            </span>

            <span v-if="getField('doi')">
              <b>
                DOI:
                <a :href="'https://doi.org/' + getField('doi')">{{
                  getField("doi")
                }}</a
                >,
              </b>
            </span>

            <span v-if="getField('lastEdited')">
              <b>Last Edited:</b> {{ moment(getField("lastEdited")) }},
            </span>
            <b v-if="getField('lastEditor') !== null"
              ><span class="mr-2">Last Editor:</span></b
            ><span
              v-if="
                getField('lastEditor') !== null &&
                getField('lastEditor').username
              "
              class="mr-2"
              >{{ getField("lastEditor").username }},</span
            >
            <b>Last Accessed:</b>
            <span class="mr-2">
              {{ moment(new Date())
              }}<span v-if="getField('lastReviewed')">,</span>
            </span>
            <span v-if="getField('lastReviewed')">
              <b>Last Reviewed:</b>
              <span class="mr-2">
                {{ moment(getField("lastReviewed")) }}
              </span>
            </span>
          </v-card-text>
        </v-card>
      </v-col>
      <!--Publication for citation-->
      <v-col cols="12" sm="12" md="6" class="mt-md-0 mt-sm-8">
        <v-card
          v-if="
            getField('metadata')['citations'] &&
            getField('metadata')['citations'].length > 0
          "
          class="pa-4 d-flex flex-column overflow-initial"
          border
          color="white"
          tile
          elevation="3"
        >
          <Icon item="PublicationCitation" size="20" class="pt-2" />
          <v-card-title class="pa-0 card-title-customize">
            <v-tooltip location="bottom">
              <template #activator="{ props }">
                <v-icon class="mr-2" size="15" v-bind="props">
                  fas fa-question-circle
                </v-icon>
              </template>
              {{ recordTooltips["publication_for_citation"] }}
            </v-tooltip>
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
                  <p class="ma-0 mr-2">
                    <b>{{ publication.title }}</b
                    >:
                    {{
                      $vuetify.display.lgAndUp
                        ? truncate(publication.authors, 600)
                        : truncate(publication.authors, 150)
                    }}
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
                      v-if="
                        !citation.pubmed_id && !citation.doi && citation.url
                      "
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
import moment from "moment";
import { mapGetters, mapState } from "vuex";

import Icon from "@/components/Icon";
import getHostname from "@/utils/generalUtils";
import { truncate } from "@/utils/stringUtils";

export default {
  name: "Citations",
  components: { Icon },
  mixins: [truncate, getHostname],
  data: () => {
    return {
      currentDate: new Date(),
    };
  },
  computed: {
    ...mapState("record", ["currentRecord"]),
    ...mapState("editor", ["recordTooltips"]),
    ...mapGetters("record", ["getField"]),
  },
  methods: {
    moment(date) {
      return moment(date).format("dddd, MMMM Do YYYY, H:mm");
    },
  },
};
</script>

<style scoped lang="scss">
a {
  text-decoration: none;

  &:hover,
  &:focus {
    text-decoration: underline;
    outline: 0;
  }
}

.card-text-customize {
  min-height: 120px;
  overflow: hidden;
}
</style>
