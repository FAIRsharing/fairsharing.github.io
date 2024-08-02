<template>
  <div>
    <!--Subjects-->
    <div class="d-flex flex-row mt-4 min-height-40">
      <span
        class="d-flex align-baseline width-15-percent-flex"
      >
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon
              class="mr-2"
              size="15"
              v-on="on"
            >
              fa-question-circle
            </v-icon>
          </template>
          {{ recordTooltips['subjects'] }}
        </v-tooltip>
        <b>Subjects</b>
      </span>
      <div
        class="d-flex full-width flex-wrap ml-md-12 ml-13"
      >
        <span v-if="!getField('subjects').length">
          N/A
        </span>
        <v-chip
          v-for="item in getField('subjects')"
          :key="item.label"
          class="mr-2 mb-2"
          :color="getChipColor(item)"
          text-color="white"
          @click="returnToSearch('subjects', item.label)"
        >
          <KeywordTooltip
            :keyword="item"
            :full-width="true"
          />
        </v-chip>
      </div>
    </div>
    <!--Domains-->
    <div class="d-flex flex-row mt-4 min-height-40">
      <span
        class="d-flex align-baseline width-15-percent-flex"
      >
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon
              class="mr-2"
              size="15"
              v-on="on"
            >
              fa-question-circle
            </v-icon>
          </template>
          {{ recordTooltips['domains'] }}
        </v-tooltip>
        <b>Domains</b>
      </span>
      <div
        class="d-flex full-width flex-wrap ml-md-12 ml-13"
      >
        <span v-if="!getField('domains').length">
          N/A
        </span>
        <v-chip
          v-for="item in getField('domains')"
          :key="item.label"
          class="mr-2 mb-2"
          :color="getChipColor(item)"
          text-color="white"
          @click="returnToSearch('domains', item.label)"
        >
          <KeywordTooltip
            :keyword="item"
            :full-width="true"
          />
        </v-chip>
      </div>
    </div>
    <!--Taxonomic Range-->
    <div class="d-flex flex-row mt-4 min-height-40">
      <span
        class="d-flex align-baseline width-15-percent-flex"
      >
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon
              class="mr-2"
              size="15"
              v-on="on"
            >
              fa-question-circle
            </v-icon>
          </template>
          {{ recordTooltips['taxonomies'] }}
        </v-tooltip>
        <b>Taxonomic Range</b>
      </span>
      <div
        class="d-flex full-width flex-wrap ml-md-12 ml-13"
      >
        <span v-if="!getField('taxonomies').length">
          N/A
        </span>
        <v-chip
          v-for="item in getField('taxonomies')"
          :key="item.label"
          class="mr-2 mb-2"
          text-color="white"
          :color="getChipColor(item)"
          @click="returnToSearch('taxonomies', item.label)"
        >
          <KeywordTooltip
            :keyword="item"
            :full-width="true"
          />
        </v-chip>
      </div>
    </div>
    <!--User Defined Tags-->
    <div class="d-flex flex-row mt-4 min-height-40">
      <span
        class="d-flex align-baseline width-15-percent-flex"
      >
        <v-tooltip bottom>
          <template #activator="{ on }">
            <v-icon
              class="mr-2"
              size="15"
              v-on="on"
            >
              fa-question-circle
            </v-icon>
          </template>
          {{ recordTooltips['user_defined_tags'] }}
        </v-tooltip>
        <b>User Defined Tags</b>
      </span>
      <div
        class="d-flex full-width flex-wrap ml-md-12 ml-13"
      >
        <span v-if="!getField('userDefinedTags').length">
          N/A
        </span>
        <v-chip
          v-for="item in getField('userDefinedTags')"
          :key="item.label"
          class="mr-2 mb-2 text-capitalize"
          text-color="white"
          :color="getChipColor(item)"
          @click="returnToSearch('userDefinedTags', item.label)"
        >
          <KeywordTooltip
            :keyword="item"
            :full-width="true"
          />
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex';

import recordsCardUtils from "@/utils/recordsCardUtils";

import KeywordTooltip from "../../Shared/KeywordTooltip";
export default {
  name: "Keywords",
  components: {
    KeywordTooltip,
  },
  mixins: [recordsCardUtils],
  computed: {
    ...mapGetters("record", ["getField"]),
    ...mapState("editor", ["recordTooltips"])
  },
  methods: {
    returnToSearch(field, item) {
      let query = {};
      query[field] = encodeURIComponent(item);
      this.$router.push({
        name: 'search',
        query: query
      });
    }
  }
}
</script>
