<template>
  <div class="d-flex mx-2">
    <!--  On Search Block  -->
    <v-btn
      v-if="showHomeSearch"
      color="primary"
      class="mb-13"
      :class="[
        'mt-1',
        $vuetify.display.lgAndDown ? 'home-search-bt' : 'home-search-bt-xl',
      ]"
      @click="openAdvanceSearch()"
    >
      <v-icon
        size="small"
        class="mr-1"
      >
        fab fa-searchengin
      </v-icon>
      <span>Advanced Search</span>
    </v-btn>
    <!--  On Header Block  -->
    <v-btn
      v-else
      :size="$vuetify.display.xl ? true : false ? 'x-large' : undefined"
      class="mr-10 bg-primary"
      elevation="3"
      @click="openAdvanceSearch()"
    >
      <v-icon
        size="small"
        class="mr-1"
      >
        fab fa-searchengin
      </v-icon>
      <span class="button-text-size">Advanced Search</span>
    </v-btn>
    <!--Dialog Box -->
    <AdvancedSearchDialogBox />
  </div>
</template>

<script>
import AdvancedSearchDialogBox from "@/components/Records/Search/Input/AdvancedSearch/AdvancedSearchDialogBox.vue";
import advancedSearch from "@/store";

export default {
  name: "AdvancedSearch",
  components: { AdvancedSearchDialogBox },
  props: {
    showHomeSearch: {
      default: false,
      type: Boolean,
    },
  },
  data: () => {
    return {
      dialog: false,
    };
  },
  methods: {
    openAdvanceSearch() {
      advancedSearch.commit(
        "advancedSearch/setAdvancedSearchDialogStatus",
        true
      );
    },
  },
};
</script>

<style scoped>
.home-search-bt {
  height: 40px !important;
  right: 0;
  top: 0;
  border-radius: unset;
}

.home-search-bt-xl {
  height: 50px !important;
  right: 0;
  top: 0;
  border-radius: unset;
}
.button-text-size {
  font-size: 13px;
}
</style>
