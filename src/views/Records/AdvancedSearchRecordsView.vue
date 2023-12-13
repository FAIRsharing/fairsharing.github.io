<template>
  <div>
    <v-fade-transition>
      <v-overlay
        v-if="getLoadingStatus"
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
    <div class="d-flex full-width my-4">
      <AdvancedSearchSelection />
      <AdvancedSearchResultTable />
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

import Loaders from "@/components/Navigation/Loaders";
import AdvancedSearchResultTable from "@/views/Records/AdvancedSearchResultTable.vue";
import AdvancedSearchSelection from "@/views/Records/AdvancedSearchSelection.vue";

export default {
  name: "AdvancedSearchRecordsView",
  components: { Loaders, AdvancedSearchResultTable, AdvancedSearchSelection },
  computed: {
    ...mapGetters("advancedSearch", ["getLoadingStatus"]),
  },
  destroyed() {
    this.resetAdvancedSearchResponse();
  },
  methods: {
    ...mapActions("advancedSearch", ["resetAdvancedSearchResponse"]),
  },
};
</script>
