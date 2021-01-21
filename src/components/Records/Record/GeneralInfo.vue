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
    <div class="d-flex mt-4 ml-0">
      <div
        class="align-self-center width-200"
      >
        <record-status
          :record="currentRecord['fairsharingRecord']"
        />
      </div>
      <div
        class="align-self-center full-width ml-15"
      >
        <div class="d-flex flex-column">
          <div class="d-flex flex-row align-center">
            <h3>{{ getField('name') }}</h3>
            <b
              v-if="getField('abbreviation')"
              class="ml-2"
            >({{ getField('abbreviation') }})</b>
          </div>
          <div class="d-flex align-center width-35">
            <v-img
              src="@/assets/DOI_logo.svg"
              height="30"
              contain
              class="mr-2"
            />
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
      </div>
    </div>

    <div class="d-flex flex-column ml-2">
      <!--Type-->
      <div class="d-flex flex-row mt-2 align-center">
        <b class="width-200">type</b>
        <p class="ma-0 full-width ml-md-12 ml-13">
          {{ cleanString(getField('type')) | capitalize }}
        </p>
      </div>
      <!--Year of Creation-->
      <!--!! Attention need data model to be changed. must be sent by fairsharing Object like below!! -->
      <!--fairsharingRecord.year_creation-->
      <div class="d-flex flex-row mt-2 align-center">
        <b class="width-200">Year of Creation</b>
        <div class="d-flex full-width ml-md-12 ml-13">
          <p
            v-if="getField('metadata').year_creation"
            class="ma-0"
          >
            {{ getField('metadata').year_creation }}
          </p>
          <NoneFound
            v-else
            :string-field="getField('metadata').year_creation"
          />
        </div>
      </div>
      <!--Registry-->
      <div class="d-flex flex-row mt-2 align-center">
        <b class="width-200">Registry</b>
        <p class="ma-0 full-width ml-md-12 ml-13">
          {{ getField('registry') | capitalize }}
        </p>
      </div>
      <!--Description-->
      <div class="d-flex flex-row mt-2">
        <b class="width-200">Description</b>
        <p class="ma-0 full-width ml-md-12 ml-13 text-justify">
          {{ getField('description') | capitalize }}
        </p>
      </div>
      <!--Home Page-->
      <div class="d-flex flex-row mt-2 align-center">
        <b class="width-200">Home Page</b>
        <div class="d-flex full-width ml-md-12 ml-13">
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
      </div>
      <!--Developed Countries-->
      <div class="d-flex flex-row mt-2">
        <b class="width-200">Countries developing this resource</b>
        <div class="d-flex full-width flex-wrap ml-md-12 ml-13">
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
      </div>
    </div>
    <section />
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

.width-200 {
  width: 200px;
}

.width-35 {
  width: 35px;
}

</style>
