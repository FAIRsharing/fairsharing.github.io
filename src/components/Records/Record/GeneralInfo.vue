<template>
  <v-card
    :color="backColor"
    border
    class="pa-4 d-flex flex-column overflow-initial"
    elevation="3"
    tile
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
        v-if="currentRecord.fairsharingRecord.registry === 'Collection'"
        inline-style
      />
      <!--Home Page-->
      <HomePage />
      <!--Reference URL-->
      <ReferenceURL
        v-if="
          currentRecord.fairsharingRecord.registry === 'Collection' ||
          currentRecord.fairsharingRecord.type === 'principle'
        "
      />
      <!--Year of Creation-->
      <YearOfCreation
        v-if="currentRecord.fairsharingRecord.registry !== 'Collection'"
      />
      <!--Maintainers-->
      <Maintainers
        :can-claim="canClaim"
        @request-ownership="callRequestOwnership"
      />
      <!--ContactsData-->
      <ContactsData
        v-if="currentRecord.fairsharingRecord.registry === 'Collection'"
      />
      <!--Developed Countries-->
      <Countries
        v-if="currentRecord.fairsharingRecord.registry !== 'Collection'"
      />
      <!--Keywords-->
      <Keywords />

      <!-- Licence needs to go here -->
      <Licence
        v-if="currentRecord.fairsharingRecord.registry === 'Collection'"
      />

      <!-- Duplicate link to graph (see also action menu) -->
      <span class="d-flex align-baseline width-15-percent-flex">
        <v-tooltip location="bottom">
          <template #activator="{ props }">
            <v-icon class="mr-2" size="15" v-bind="props">
              fas fa-question-circle
            </v-icon>
          </template>
          {{ recordTooltips["graph_button"] }}
        </v-tooltip>
        <v-btn
          :disabled="graphButtonDisabled()"
          class="my-5"
          color="primary"
          style="max-width: 250px"
          variant="outlined"
          @click="loadGraph"
        >
          <v-icon size="small" start> fas fa-project-diagram </v-icon>
          <span v-if="currentRecord.fairsharingRecord.hasGraph">
            View Relation Graph
          </span>
          <span v-else> No Graph Available </span>
        </v-btn>
      </span>

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
import { mapGetters, mapState } from "vuex";

import Licence from "@/components/Records/Record/CollectionRecord/Licence.vue";
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
import SectionTitle from "@/components/Records/Record/SectionTitle";

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
    Licence,
  },
  props: {
    canClaim: {
      type: Boolean,
      default: true,
    },
    backColor: {
      default: null,
      type: String,
    },
  },
  emits: ["requestOwnership"],
  computed: {
    ...mapState("record", ["currentRecord"]),
    ...mapState("editor", ["recordTooltips"]),
    ...mapGetters("record", ["getField"]),
  },
  methods: {
    callRequestOwnership() {
      this.$emit("requestOwnership");
    },
    loadGraph() {
      let _module = this;
      if (_module.currentRecord.fairsharingRecord.hasGraph) {
        _module.$router.push({
          path: `/graph/${_module.currentRecord["fairsharingRecord"].id}`,
        });
      }
    },
    graphButtonDisabled() {
      if (this.currentRecord.fairsharingRecord.hasGraph) {
        return false;
      }
      return true;
    },
  },
};
</script>
