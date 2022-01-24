<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card
    :class="['pa-4 d-flex flex-column bg-color',{'collection-style':currentRecord.fairsharingRecord.registry==='Collection'}]"
    outlined
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
      <!--updates and creation date-->
      <UpdateCreateDetail />
    </div>
    <section />
    <!-- Special visual identifier only for the collection type   -->
    <span
      v-if="currentRecord.fairsharingRecord.registry==='Collection'"
      class="emphasize-registry"
    >
      <b>Collection</b>
    </span>
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
  },
  props: {
    canClaim: {
      type: Boolean,
      default: true
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
<style>
.emphasize-registry {
  background: linear-gradient(#006055, #66a7a7);
  background: -moz-linear-gradient(#006055, #66a7a7);
  background: -webkit-linear-gradient(#006055, #66a7a7);
  background: -ms-linear-gradient(#006055, #66a7a7);
  background: -o-linear-gradient(#006055, #66a7a7);
  position: absolute;
  right: 1rem;
  top: 0;
  padding: 15px;
  color: white;
  border-radius: 0 0 15px 15px!important;
  -moz-border-radius: 0 0 15px 15px!important;
  -webkit-border-radius: 0 0 15px 15px!important;
}

.collection-style {
  border: 2px solid #006055!important;
}
.bg-color {
  background:#f9f9f9!important;
}
</style>
