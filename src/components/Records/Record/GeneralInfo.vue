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

      <!-- Duplicate link to graph (see also action menu) -->
      <div class="d-flex flex-row">
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
import SectionTitle from '@/components/Records/Record/SectionTitle';
import Keywords from "@/components/Records/Record/GeneralInfo/Keywords";
import DOITitle from "@/components/Records/Record/GeneralInfo/DOITitle";
import Type from "@/components/Records/Record/GeneralInfo/Type";
import YearOfCreation from "@/components/Records/Record/GeneralInfo/YearOfCreation";
import Registry from "@/components/Records/Record/GeneralInfo/Registry";
import Description from "@/components/Records/Record/GeneralInfo/Description";
import HomePage from "@/components/Records/Record/GeneralInfo/HomePage";
import Countries from "@/components/Records/Record/GeneralInfo/Countries";
import Citations from "@/components/Records/Record/GeneralInfo/Citations";
import UpdateCreateDetail from "@/components/Records/Record/GeneralInfo/UpdateCreateDetail";
import Maintainers from "@/components/Records/Record/GeneralInfo/Maintainers";
import {mapGetters, mapState} from "vuex";
import ReferenceURL from "@/components/Records/Record/GeneralInfo/ReferenceURL";
import DeprecationReason from "@/components/Records/Record/GeneralInfo/DeprecationReason";
import ReplacedByRecord from "@/components/Records/Record/GeneralInfo/ReplacedByRecord";
import ContactsData from "@/components/Records/Record/GeneralInfo/ContactsData";
import Organisations from "@/components/Records/Record/Organisations";
import CommunityCuratorInfo from "@/components/Records/Record/GeneralInfo/CommunityCuratorInfo";

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
    CommunityCuratorInfo
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
