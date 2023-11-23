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
    <AdvancedSearchResultTable />
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import Loaders from "@/components/Navigation/Loaders";
import AdvancedSearchResultTable from "@/views/Records/AdvancedSearchResultTable.vue";

export default {
  name: "AdvancedSearchRecords",
  components: { Loaders, AdvancedSearchResultTable },
  computed: {
    ...mapGetters("advancedSearch", ["getLoadingStatus"]),
  },
};
</script>
