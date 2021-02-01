<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    tile
    elevation="1"
  >
    <!-- General Info -->
    <SectionTitle title="General Info" />
    <!-- Ribbon -->
    <Ribbon
      v-if="currentRecord['fairsharingRecord'].isRecommended"
      title="RECOMMENDED"
    />
    <!-- Title and DOI -->
    <v-row
      no-gutters
      class="mb-2"
    >
      <v-col
        cols="4"
        sm="2"
        md="2"
        lg="1"
        xl="1"
        class="d-flex flex-row align-center mt-4 "
      >
        <record-status :record="currentRecord['fairsharingRecord']" />
      </v-col>
      <v-col
        class="d-flex flex-column justify-center"
        cols="12"
        sm="10"
        md="10"
        lg="11"
        xl="11"
      >
        <div class="d-flex flex-column mt-2  ml-sm-6 ml-lg-8">
          <div class="d-flex flex-row mb-2 align-center">
            <h3>{{ currentRecord['fairsharingRecord'].name }}</h3>
            <b
              v-if="currentRecord['fairsharingRecord'].abbreviation"
              class="ml-2"
            >({{ currentRecord['fairsharingRecord'].abbreviation }})</b>
          </div>
          <div class="d-flex align-center">
            <h3 class="mr-1">
              doi:
            </h3>
            <a
              v-if="currentRecord['fairsharingRecord'].doi"
              :href="generateDoiLink(currentRecord['fairsharingRecord'].doi)"
              target="_blank"
            >
              {{ currentRecord['fairsharingRecord'].doi }}
            </a>
            <NoneFound
              v-else
              :string-field="currentRecord['fairsharingRecord'].doi"
            />
          </div>
        </div>
      </v-col>
    </v-row>

    <section>
      <!--Type-->
      <div class="d-flex">
        <b class="mr-2">Type:</b>
        <p>
          {{ cleanString(currentRecord['fairsharingRecord'].type) | capitalize }}
        </p>
      </div>
      <!--Year of Creation-->
      <!--!! Attention need data model to be changed. must be sent by fairsharing Object like below!! -->
      <!--fairsharingRecord.year_creation-->
      <div class="d-flex">
        <b class="mr-2">Year of Creation:</b>
        <p v-if="currentRecord['fairsharingRecord'].metadata.year_creation">
          {{ currentRecord['fairsharingRecord'].metadata.year_creation }}
        </p>
        <NoneFound
          v-else
          :string-field="currentRecord['fairsharingRecord'].metadata.year_creation"
        />
      </div>
      <!--Registry-->
      <div class="d-flex">
        <b class="mr-2">Registry:</b>
        <p>{{ currentRecord['fairsharingRecord'].registry | capitalize }}</p>
      </div>
      <!--Description-->
      <div class="d-flex align-center mb-4">
        <b class="mr-2">Description:</b>
        <p class="mb-0">
          {{ currentRecord['fairsharingRecord'].description | capitalize }}
        </p>
      </div>
      <!--HomePage-->
      <div class="d-flex">
        <b class="mr-2 mb-4">Home Page:</b>
        <a
          v-if="currentRecord['fairsharingRecord'].homepage"
          :href="currentRecord['fairsharingRecord'].homepage"
          target="_blank"
        >{{ currentRecord['fairsharingRecord'].homepage }}</a>
        <NoneFound
          v-else
          :string-field="currentRecord['fairsharingRecord'].homepage"
        />
      </div>
      <!--Developed Countries -->
      <div class="d-flex flex-wrap">
        <b class="mr-2">Countries involved with this resource:</b>
        <NoneFound
          v-if="!currentRecord['fairsharingRecord'].countries"
          :data-field="currentRecord['fairsharingRecord'].countries"
        />
        <p
          v-else-if="!currentRecord['fairsharingRecord'].countries.length"
          class="my-0"
        >
          None found.
        </p>
        <v-tooltip
          v-for="country in currentRecord['fairsharingRecord'].countries"
          :key="country.id"
          top
        >
          <template v-slot:activator="{ on }">
            <v-sheet
              class="mb-2 flag-mr"
              v-on="on"
            >
              <country-flag
                v-if="country.code"
                :country="country.code"
                size="big"
              />
              <div
                v-else
                class="warning"
              >
                country code undefined!
              </div>
            </v-sheet>
          </template>
          <span class="white--text">{{ country.name }}</span>
        </v-tooltip>
      </div>
    </section>
  </v-card>
</template>

<script>
import CountryFlag from 'vue-country-flag';
import {mapState} from 'vuex';
// TODO:
//import { mapState, mapGetters } from 'vuex';

import Ribbon from "@/components/Records/Shared/Ribbon";
import SectionTitle from '@/components/Records/Record/SectionTitle';
import RecordStatus from "@/components/Records/Shared/RecordStatus";

import stringUtils from '@/utils/stringUtils';
import NoneFound from "@/components/Records/Record/NoneFound";


export default {
  name: "GeneralInfo",
  components: {
    NoneFound,
    CountryFlag,
    RecordStatus,
    Ribbon,
    SectionTitle
  },
  mixins: [stringUtils],
  computed: {
    ...mapState("record", ["currentRecord"])
  },
  methods: {
    generateDoiLink(doi) {
      return `https://doi.org/${doi}`
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

.flag-mr {
  margin-right: .29em;
}
</style>
