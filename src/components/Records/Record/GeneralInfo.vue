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
            <div
              v-if="getField('doi')"
              class="d-flex flex-row"
            >
              <a
                :href="generateDoiLink(getField('doi'))"
                target="_blank"
              >
                {{ getField('doi') }}
              </a>
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-icon
                    v-ripple
                    v-clipboard="copyURL"
                    v-bind="attrs"
                    class="primary--text ml-2 cursor-pointer"
                    small
                    v-on="on"
                  >
                    fa fa-copy
                  </v-icon>
                </template>
                <span v-if="!copyButtonStatus"> Copy URL </span>
                <span v-else> URL copied </span>
              </v-tooltip>
            </div>
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
      <div class="d-flex flex-row mt-4 align-center">
        <b class="width-200">type</b>
        <p class="ma-0 full-width ml-md-12 ml-13">
          {{ cleanString(getField('type')) | capitalize }}
        </p>
      </div>
      <!--Year of Creation-->
      <!--!! Attention need data model to be changed. must be sent by fairsharing Object like below!! -->
      <!--fairsharingRecord.year_creation-->
      <div class="d-flex flex-row mt-4 align-center">
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
      <div class="d-flex flex-row mt-4 align-center">
        <b class="width-200">Registry</b>
        <p class="ma-0 full-width ml-md-12 ml-13">
          {{ getField('registry') | capitalize }}
        </p>
      </div>
      <!--Description-->
      <div class="d-flex flex-row mt-4">
        <b class="width-200">Description</b>
        <p class="ma-0 full-width ml-md-12 ml-13 text-justify">
          {{ getField('description') | capitalize }}
        </p>
      </div>
      <!--Home Page-->
      <div class="d-flex flex-row mt-4 align-center">
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
      <div class="d-flex flex-row mt-4">
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
          <div
            v-for="(country,index) in getField('countries')"
            :key="country.id"
          >
            <p
              v-if="country.name"
              class="ma-0 mr-2"
            >
              {{ ` ${country.name}${index!==getField('countries').length-1?',':''}` }}
            </p>
            <span
              v-else
              class="warning"
            >
              country code undefined!
            </span>
          </div>
        </div>
      </div>
    </div>
    <section />
  </v-card>
</template>

<script>
import {mapGetters, mapState} from 'vuex';
import SectionTitle from '@/components/Records/Record/SectionTitle';
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import stringUtils from '@/utils/stringUtils';
import NoneFound from "@/components/Records/Record/NoneFound";


export default {
  name: "GeneralInfo",
  components: {
    NoneFound,
    RecordStatus,
    SectionTitle
  },
  mixins: [stringUtils],
  data() {
    return {
      copyButtonStatus:false
    }
  },
  computed:{
  ...mapGetters("record", ["getField"]),
  ...mapState("record", ["currentRecord"])
  },
  methods: {
    generateDoiLink(doi) {
      return `https://doi.org/${doi}`
    },
    copyURL() {
      this.copyButtonStatus = true;
      return this.generateDoiLink(this.currentRecord['fairsharingRecord'].doi)
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

.width-200 {
  width: 200px;
}

.width-35 {
  width: 35px;
}

</style>
