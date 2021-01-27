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
      <!--Keywords-->
      <Keywords />
      <!--How to cite & publication for record-->
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
              <v-card-title class="pa-0 card-title-customize">
                How to cite this record
              </v-card-title>
              <v-card-text class="ma-0 pt-8 card-text-customize">
                FAIRsharing.org:{{ getField('abbreviation')+';'+getField('name') }}
                <b>DOI:</b>{{ getField('doi') }};
                <b>Last Edited:</b>12/02/2020
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
              v-if="getField('citations')"
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
                <!--       TODO: here need to get citation array and look through publication with same id in citation          -->
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
      <!--updates and creation date-->
      <div class="d-flex flex-row flex-wrap align-center mt-4 min-height-40">
        <v-icon
          class="mr-2"
          small
        >
          {{ $vuetify.icons.values.createdAt }}
        </v-icon>
        <b class="mr-2">Record created at</b>
        <p class="ma-0 mr-2 text-body-2">
          {{ currentRecord['fairsharingRecord'].createdAt }}
        </p>
        <span class="mr-2">|</span>
        <v-icon
          class="mr-2"
          small
        >
          {{ $vuetify.icons.values.updatedAt }}
        </v-icon>
        <b class="mr-2">Record updated at</b>
        <p class="ma-0 text-body-2">
          {{ currentRecord['fairsharingRecord'].updatedAt }}
        </p>
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
import recordsCardUtils from "@/utils/recordsCardUtils";
import Keywords from "@/components/Records/Record/Keywords";


export default {
  name: "GeneralInfo",
  components: {
    Keywords,
    NoneFound,
    RecordStatus,
    SectionTitle,
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
      copyButtonStatus:false,
      currentDate:new Date()
    }
  },
  computed:{
  ...mapGetters("record", ["getField"]),
  ...mapState("record", ["currentRecord"]),
  },
  methods: {
    getCurrentDate() {
      return this.currentDate.getDate() + "/"
          + (this.currentDate.getMonth() + 1) + "/"
          + this.currentDate.getFullYear() + " at "
          + this.currentDate.getHours() + ":"
          + this.currentDate.getMinutes() + ":"
          + this.currentDate.getSeconds();
    },
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
  max-height: 100px;
  min-height: 100px;
  overflow: hidden
}

.card-title-customize {
  position: absolute;
  top: 0;
  left: 120px
}

</style>
