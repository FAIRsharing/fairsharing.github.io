<template>
  <div>
    <!--Taxonomic Range-->
    <div class="d-flex flex-row mt-4 min-height-40">
      <b class="width-200">Taxonomic Range</b>
      <div class="d-flex full-width flex-wrap ml-md-12 ml-13">
        <span
          v-if="!getField('taxonomies').length"
        >
          None.
        </span>
        <v-chip
          v-for="item in getField('taxonomies')"
          :key="item.label"
          class="mr-2 mb-2"
          :color="getChipColor(item)"
          text-color="white"
        >
          <KeywordTooltip
            :keyword="item"
            :full-width="true"
          />
        </v-chip>
      </div>
    </div>
    <!--Subjects-->
    <div class="d-flex flex-row mt-4 min-height-40">
      <b class="width-200">Subjects</b>
      <div class="d-flex full-width flex-wrap ml-md-12 ml-13">
        <span
          v-if="!getField('subjects').length"
        >
          None.
        </span>
        <v-chip
          v-for="item in getField('subjects')"
          :key="item.label"
          class="mr-2 mb-2"
          :color="getChipColor(item)"
          text-color="white"
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
      <b class="width-200">Domains</b>
      <div class="d-flex full-width flex-wrap ml-md-12 ml-13">
        <span
          v-if="!getField('domains').length"
        >
          None.
        </span>
        <v-chip
          v-for="item in getField('domains')"
          :key="item.label"
          class="mr-2 mb-2"
          text-color="white"
          :color="getChipColor(item)"
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
      <b class="width-200">User Defined Tags</b>
      <div class="d-flex full-width flex-wrap ml-md-12 ml-13">
        <span
          v-if="!getField('userDefinedTags').length"
        >
          None.
        </span>
        <v-chip
          v-for="item in getField('userDefinedTags')"
          :key="item.label"
          class="mr-2 mb-2"
          text-color="white"
          :color="getChipColor(item)"
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
import {mapGetters} from 'vuex';
import KeywordTooltip from "../Shared/KeywordTooltip";
import recordsCardUtils from "@/utils/recordsCardUtils";

export default {
  name: "Keywords",
  components: {
    KeywordTooltip,
  },
  mixins: [recordsCardUtils],
  computed: {
    ...mapGetters("record", ["getField"])
  }
}
</script>
