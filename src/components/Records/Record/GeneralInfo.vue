<template>
  <v-card
    class="pa-4 mt-5 d-flex flex-column"
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
            <b class="ml-2">({{ currentRecord['fairsharingRecord'].abbreviation
            }})</b>
          </div>
          <div class="d-flex align-center">
            <h3 class="mr-1">
              doi:
            </h3>
            <a :href="currentRecord['fairsharingRecord'].doi">
              {{ currentRecord['fairsharingRecord'].doi }}
            </a>
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
        <p>{{ currentRecord['fairsharingRecord'].metadata.year_creation }}</p>
      </div>
      <!--Registry-->
      <div class="d-flex">
        <b class="mr-2">Registry:</b>
        <p>{{ currentRecord['fairsharingRecord'].registry | capitalize }}</p>
      </div>
      <!--Description-->
      <div class="d-flex align-center">
        <b class="mr-2">Description:</b>
        <p>{{ currentRecord['fairsharingRecord'].description | capitalize }}</p>
      </div>
      <!--HomePage-->
      <div class="d-flex">
        <b class="mr-2 mb-4">Home Page:</b>
        <a
          :href="currentRecord['fairsharingRecord'].homepage"
          target="_blank"
        >{{ currentRecord['fairsharingRecord'].homepage }}</a>
      </div>
      <!--Developed Countries -->
      <div class="d-flex flex-wrap">
        <b class="mr-2">Countries developed this resource:</b>
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
                :country="country.code"
                size="big"
              />
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
    import { mapState } from 'vuex';
    // TODO:
    //import { mapState, mapGetters } from 'vuex';

    import Ribbon from "@/components/Records/Shared/Ribbon";
    import SectionTitle from '@/components/Records/Record/SectionTitle';
    import RecordStatus from "@/components/Records/Shared/RecordStatus";

    import stringUtils from '@/utils/stringUtils';


    export default {
        name: "GeneralInfo",
        components: {
            CountryFlag,
            RecordStatus,
            Ribbon,
            SectionTitle
        },
        mixins: [stringUtils],
        computed: {
            ...mapState("record", ["currentRecord"])
        }
    }
</script>

<style scoped>

</style>