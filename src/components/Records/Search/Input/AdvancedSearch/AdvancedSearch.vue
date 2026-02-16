<template>
  <div class="d-flex mx-2">
    <!--  On Search Block  -->
    <v-btn
      v-if="showHomeSearch"
      :class="[
        'mt-1',
        $vuetify.display.lgAndDown ? 'home-search-bt' : 'home-search-bt-xl',
      ]"
      class="mb-13 px-6"
      color="primary"
      @click="openAdvanceSearch()"
    >
      <v-icon class="mr-1" size="small"> fab fa-searchengin</v-icon>
      <span>Advanced Search</span>
    </v-btn>
    <!--  On Header Block  -->
    <v-btn
      v-else
      :size="
        $vuetify.display.xl
          ? 'x-large'
          : $vuetify.display.mdAndDown
            ? 'small'
            : undefined
      "
      class="mr-10 bg-primary"
      elevation="2"
      @click="openAdvanceSearch()"
    >
      <v-icon class="mr-1" size="small"> fab fa-searchengin</v-icon>
      <span style="fontsize: revert">Advanced Search</span>
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
        true,
      );
    },
  },
};
</script>

<style lang="scss" scoped>
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
