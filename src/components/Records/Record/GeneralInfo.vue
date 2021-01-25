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

    <!--  other data  -->
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
      <div class="d-flex flex-row mt-4 align-center min-height-40">
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
      <div class="d-flex flex-row mt-4 align-center min-height-40">
        <b class="width-200">Registry</b>
        <p class="ma-0 full-width ml-md-12 ml-13">
          {{ getField('registry') | capitalize }}
        </p>
      </div>
      <!--Description-->
      <div class="d-flex flex-row mt-4 min-height-40">
        <b class="width-200">Description</b>
        <p class="ma-0 full-width ml-md-12 ml-13 text-justify">
          {{ getField('description') | capitalize }}
        </p>
      </div>
      <!--Home Page-->
      <div class="d-flex flex-row mt-4 align-center min-height-40">
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
      <div class="d-flex flex-row mt-4 min-height-40">
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
      <!--Maintainers-->
      <div class="d-flex flex-row mt-4 min-height-40">
        <b class="width-200">Maintainers</b>
        <div class="d-flex full-width flex-wrap ml-md-12 ml-13">
          <div
            v-if="getField('maintainers').length === 0"
            class="d-flex flex-wrap"
          >
            <p class="ma-0 mr-2">
              This record is in need of a maintainer.
            </p>
            <p
              v-if="canClaim"
              class="ma-0 mr-2"
            >
              If you are affiliated with this project,
            </p>
            <a
              v-if="canClaim"
              @click="()=>{this.$emit('requestOwnership')}"
            >
              Claim it now!
            </a>
          </div>
          <!--<NoneFound :data-field="getField('maintainers')" />-->
          <!--Contact-->
          <div
            v-for="(maintainer,index) in getField('maintainers')"
            :key="maintainer.contact_name"
            class="d-flex flex-wrap"
          >
            <a
              :href="maintainer.username + '/' + maintainer.id"
              class="mr-2"
            >
              {{ ` ${maintainer.username+ '/' + maintainer.id}${index!==getField('maintainers').length-1?',':''}` }}
            </a>
          </div>
        </div>
      </div>
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
      <!--How to cite record-->
      <div class="d-flex flex-row mt-4">
        <v-row>
          <v-col
            cols="12"
            sm="12"
            md="6"
          >
            <v-card
              class="pa-4 d-flex flex-column min-height-100"
              outlined
              color="white"
              tile
              elevation="3"
            >
              Left
            </v-card>
          </v-col>
          <v-col
            cols="12"
            sm="12"
            md="6"
          >
            <v-card
              class="pa-4 d-flex flex-column min-height-100"
              outlined
              color="white"
              tile
              elevation="3"
            >
              Left
            </v-card>
          </v-col>
        </v-row>
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
import KeywordTooltip from "@/components/Records/Shared/KeywordTooltip";
import recordsCardUtils from "@/utils/recordsCardUtils";


export default {
  name: "GeneralInfo",
  components: {
    NoneFound,
    RecordStatus,
    SectionTitle,
    KeywordTooltip
  },
  mixins: [stringUtils,recordsCardUtils],
  props: {
    canClaim: {
      type: Boolean,
      default: true
    }
  },
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
