<template>
  <v-main>
    <!--Jump to top arrow button -->
    <v-fade-transition>
      <JumpToTop v-if="scrollStatus" />
    </v-fade-transition>
    <!--Loader-->
    <v-fade-transition>
      <v-overlay
        v-if="getLoadingStatus"
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
    <!--Search result -->
    <v-container
      fluid
      class="pa-0"
    >
      <v-row v-if="$vuetify.breakpoint.mdAndDown">
        <v-col>
          <AdvancedSearchButtons />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <!-- Advanced search selection left column-->
        <v-col
          v-if="$vuetify.breakpoint.lgAndUp"
          cols="12"
          lg="4"
          md="4"
          xl="3"
          class="d-flex mt-2 ml-2"
        >
          <AdvancedSearchSelection />
        </v-col>
        <!-- Advanced search result right column-->
        <v-col>
          <AdvancedSearchResultTable />
        </v-col>
      </v-row>
    </v-container>
    <!--Dialog Box -->
    <AdvancedSearchDialogBox />

    <!--Save Search Stepper in Dialog Box -->
    <SaveSearchStepper />
  </v-main>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";

import JumpToTop from "@/components/Navigation/jumpToTop.vue";
import Loaders from "@/components/Navigation/Loaders.vue";
import AdvancedSearchDialogBox from "@/components/Records/Search/Input/AdvancedSearch/AdvancedSearchDialogBox.vue";
import SaveSearchStepper from "@/components/Records/Search/SaveSearch/SaveSearchStepper.vue";
import onScrollUtil from "@/utils/onScrollUtil";
import AdvancedSearchButtons from "@/views/AdvancedSearch/AdvancedSearchButtons.vue";
import AdvancedSearchResultTable from "@/views/AdvancedSearch/AdvancedSearchResultTable.vue";
import AdvancedSearchSelection from "@/views/AdvancedSearch/AdvancedSearchSelection.vue";

export default {
  name: "AdvancedSearchRecordsView",
  components: {
    AdvancedSearchDialogBox,
    JumpToTop,
    Loaders,
    AdvancedSearchResultTable,
    AdvancedSearchSelection,
    AdvancedSearchButtons,
    SaveSearchStepper,
  },
  mixins: [onScrollUtil],
  data() {
    return {
      offsetTop: 0,
    };
  },
  computed: {
    ...mapState("uiController", ["scrollStatus", "stickToTop"]),
    ...mapGetters("advancedSearch", [
      "getLoadingStatus",
      "getAdvancedSearchResponse",
    ]),
  },
  mounted() {
    window.addEventListener("scroll", () => {
      this.onScroll(this.getAdvancedSearchResponse);
    });
  },
  destroyed() {
    this.resetAdvancedSearchResponse();
    window.removeEventListener("scroll", () => {
      this.onScroll(this.getAdvancedSearchResponse);
    });
    this.setStickToTop(false);
    this.$store.dispatch("uiController/setGeneralUIAttributesAction", {
      drawerVisibilityState: false,
      headerVisibilityState: true,
    });
    this.resetUserDefinedTags();
    this.resetSubjects();
    this.resetRecords();
    this.resetOrganisations();
    this.resetSearchDomains();
    this.resetSearchTaxonomies();
    this.resetSearchLicences();
  },
  methods: {
    ...mapActions("uiController", ["setStickToTop"]),
    ...mapActions("advancedSearch", ["resetAdvancedSearchResponse"]),
    ...mapActions("userDefinedTagsSearch", ["resetUserDefinedTags"]),
    ...mapActions("subjectSearch", ["resetSubjects"]),
    ...mapActions("recordTypes", ["resetRecords"]),
    ...mapActions("organisationSearch", ["resetOrganisations"]),
    ...mapActions("domainsSearch", ["resetSearchDomains"]),
    ...mapActions("taxonomiesSearch", ["resetSearchTaxonomies"]),
    ...mapActions("licencesSearch", ["resetSearchLicences"]),
  },
};
</script>
