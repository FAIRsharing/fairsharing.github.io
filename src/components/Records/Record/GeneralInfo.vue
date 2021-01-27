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
    <DOITitle />
    <!--  other data  -->
    <div class="d-flex flex-column ml-2">
      <!--Type-->
      <Type />
      <!--Year of Creation-->
      <YearOfCreation />
      <!--Registry-->
      <Registry />
      <!--Description-->
      <Description />
      <!--Home Page-->
      <HomePage />
      <!--Developed Countries-->
      <Countries />
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
import stringUtils from '@/utils/stringUtils';
import recordsCardUtils from "@/utils/recordsCardUtils";
import Keywords from "@/components/Records/Record/Keywords";
import DOITitle from "@/components/Records/Record/DOITitle";
import Type from "@/components/Records/Record/Type";
import YearOfCreation from "@/components/Records/Record/YearOfCreation";
import Registry from "@/components/Records/Record/Registry";
import Description from "@/components/Records/Record/Description";
import HomePage from "@/components/Records/Record/HomePage";
import Countries from "@/components/Records/Record/Countries";


export default {
  name: "GeneralInfo",
  components: {
    Countries,
    HomePage,
    Description,
    Registry,
    YearOfCreation,
    Type,
    DOITitle,
    Keywords,
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
