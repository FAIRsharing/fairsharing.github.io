<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    class="pa-4 d-flex flex-column"
    outlined
    :color="backColor"
    tile
    elevation="3"
  >
    <!-- General Info -->
    <SectionTitle title="General Information" />
    <!-- Deprecation Reason -->
    <DeprecationReason />
    <!-- Replaced By record -->
    <ReplacedByRecord />
    <!-- Title and DOI -->
    <DOITitle />
    <!--  other data  -->
    <div class="d-flex flex-column ml-2">
      <!--Type-->
      <Type />
      <!--Registry-->
      <Registry />
      <!--Description-->
      <Description />
      <!--Organisations-->
      <Organisations
        v-if="currentRecord.fairsharingRecord.registry==='Collection'"
        inline-style
      />
      <!--Home Page-->
      <HomePage />
      <!--Reference URL-->
      <ReferenceURL v-if="currentRecord.fairsharingRecord.registry==='Collection'" />
      <!--Year of Creation-->
      <YearOfCreation v-if="currentRecord.fairsharingRecord.registry!=='Collection'" />
      <!--Maintainers-->
      <Maintainers
        :can-claim="canClaim"
        @requestOwnership="callRequestOwnership"
      />
      <!--ContactsData-->
      <ContactsData v-if="currentRecord.fairsharingRecord.registry==='Collection'" />
      <!--Developed Countries-->
      <Countries v-if="currentRecord.fairsharingRecord.registry!=='Collection'" />
      <!--Keywords-->
      <Keywords />

      <!-- Licence needs to go here -->
      <Licence v-if="currentRecord.fairsharingRecord.registry==='Collection'" />

      <!-- Duplicate link to graph (see also action menu) -->
      <div
        v-if="currentRecord['fairsharingRecord'].hasGraph"
        class="d-flex flex-row"
      >
        <router-link :to="`/graph/${currentRecord['fairsharingRecord'].id}`">
          <v-btn
            class="my-5"
            color="primary"
            outlined
          >
            <v-icon
              small
              left
            >
              fa-project-diagram
            </v-icon>
            View Relation Graph&nbsp;
          </v-btn>
        </router-link>
      </div>

      <!--How to cite & publication for record named Citations-->
      <Citations />

      <!-- Info about any community creators involved with this record -->
      <CommunityCuratorInfo />

      <!--updates and creation date-->
      <UpdateCreateDetail />
    </div>
    <section />
  </v-card>
</template>

<script>
import {mapGetters, mapState} from "vuex";

import Licence from '@/components/Records/Record/CollectionRecord/Licence.vue'
import Citations from "@/components/Records/Record/GeneralInfo/Citations";
import CommunityCuratorInfo from "@/components/Records/Record/GeneralInfo/CommunityCuratorInfo";
import ContactsData from "@/components/Records/Record/GeneralInfo/ContactsData";
import Countries from "@/components/Records/Record/GeneralInfo/Countries";
import DeprecationReason from "@/components/Records/Record/GeneralInfo/DeprecationReason";
import Description from "@/components/Records/Record/GeneralInfo/Description";
import DOITitle from "@/components/Records/Record/GeneralInfo/DOITitle";
import HomePage from "@/components/Records/Record/GeneralInfo/HomePage";
import Keywords from "@/components/Records/Record/GeneralInfo/Keywords";
import Maintainers from "@/components/Records/Record/GeneralInfo/Maintainers";
import ReferenceURL from "@/components/Records/Record/GeneralInfo/ReferenceURL";
import Registry from "@/components/Records/Record/GeneralInfo/Registry";
import ReplacedByRecord from "@/components/Records/Record/GeneralInfo/ReplacedByRecord";
import Type from "@/components/Records/Record/GeneralInfo/Type";
import UpdateCreateDetail from "@/components/Records/Record/GeneralInfo/UpdateCreateDetail";
import YearOfCreation from "@/components/Records/Record/GeneralInfo/YearOfCreation";
import Organisations from "@/components/Records/Record/Organisations";
import SectionTitle from '@/components/Records/Record/SectionTitle';

export default {
  name: "GeneralInfo",
  components: {
    Organisations,
    ContactsData,
    ReplacedByRecord,
    DeprecationReason,
    ReferenceURL,
    Maintainers,
    UpdateCreateDetail,
    Citations,
    Countries,
    HomePage,
    Description,
    Registry,
    YearOfCreation,
    Type,
    DOITitle,
    Keywords,
    SectionTitle,
    CommunityCuratorInfo,
    Licence
  },
  props: {
    canClaim: {
      type: Boolean,
      default: true,
    },
    backColor:{
      default:null,
      type: String,
    }
  },
  computed: {
    ...mapState('record', ["currentRecord"]),
    ...mapGetters("record", ["getField"])
  },
  methods: {
    callRequestOwnership() {
      this.$emit('requestOwnership')
    }
  }
}
</script>
