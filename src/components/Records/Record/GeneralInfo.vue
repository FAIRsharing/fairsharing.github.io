<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <!-- General Info -->
    <SectionTitle title="General Information" />
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
        <record-status
          :record="currentRecord['fairsharingRecord']"
        />
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
            <h3>{{ getField('name') }}</h3>
            <b
              v-if="getField('abbreviation')"
              class="ml-2"
            >({{ getField('abbreviation') }})</b>
          </div>
          <div class="d-flex align-center">
            <h3 class="mr-1">
              doi:
            </h3>
            <a
              v-if="getField('doi')"
              :href="generateDoiLink(getField('doi'))"
              target="_blank"
            >
              {{ getField('doi') }}
            </a>
            <NoneFound
              v-else
              :string-field="getField('doi')"
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
          {{ cleanString(getField('type')) | capitalize }}
        </p>
      </div>
      <!--Year of Creation-->
      <!--!! Attention need data model to be changed. must be sent by fairsharing Object like below!! -->
      <!--fairsharingRecord.year_creation-->
      <div class="d-flex">
        <b class="mr-2">Year of Creation:</b>
        <p v-if="getField('metadata').year_creation">
          {{ getField('metadata').year_creation }}
        </p>
        <NoneFound
          v-else
          :string-field="getField('metadata').year_creation"
        />
      </div>
      <!--Registry-->
      <div class="d-flex">
        <b class="mr-2">Registry:</b>
        <p>{{ getField('registry') | capitalize }}</p>
      </div>
      <!--Description-->
      <div class="d-flex align-center mb-4">
        <b class="mr-2">Description:</b>
        <p class="mb-0">
          {{ getField('description') | capitalize }}
        </p>
      </div>
      <!--HomePage-->
      <div class="d-flex">
        <b class="mr-2 mb-4">Home Page:</b>
        <a
          v-if="getField('homepage')"
          :href="getField('homepage')"
          target="_blank"
        >{{ getField('homepage') }}</a>
        <NoneFound
          v-else
          :string-field="getField('homepage')"
        />
      </div>
      <!--Developed Countries -->
      <div class="d-flex flex-wrap">
        <b class="mr-2">Countries involved with this resource:</b>
        <NoneFound
          v-if="!getField('countries')"
          :data-field="getField('countries')"
        />
        <p
          v-else-if="!getField('countries').length"
          class="my-0"
        >
          None found.
        </p>
        <v-tooltip
          v-for="country in getField('countries')"
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
import {mapGetters, mapState} from 'vuex';
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
    SectionTitle
  },
  mixins: [stringUtils],
  computed:{
  ...mapGetters("record", ["getField"]),
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
