<template>
  <div class="d-flex mx-2">
    <v-btn
      v-if="showHomeSearch"
      class="home-search-btn mb-13 px-6 mt-1"
      color="primary"
      @click="openAdvanceSearch()"
    >
      <v-icon class="mr-1" size="small"> fab fa-searchengin</v-icon>
      <span>Advanced Search</span>
    </v-btn>

    <v-btn
      v-else
      :size="
        isMounted && xl
          ? 'x-large'
          : isMounted && mdAndDown
            ? 'large'
            : undefined
      "
      class="advanced-header-btn mr-10 bg-primary"
      elevation="2"
      @click="openAdvanceSearch()"
    >
      <v-icon class="mr-1" size="small"> fab fa-searchengin</v-icon>
      <span>Advanced Search</span>
    </v-btn>

    <AdvancedSearchDialogBox />
  </div>
</template>

<script>
import AdvancedSearchDialogBox from "@/components/Records/Search/Input/AdvancedSearch/AdvancedSearchDialogBox.vue";
import { useDisplay } from "vuetify";

export default {
  name: "AdvancedSearch",
  components: { AdvancedSearchDialogBox },
  props: {
    showHomeSearch: {
      default: false,
      type: Boolean,
    },
  },
  setup() {
    const { xl, mdAndDown } = useDisplay();
    return { xl, mdAndDown };
  },
  data: () => {
    return {
      isMounted: false,
      dialog: false,
    };
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    openAdvanceSearch() {
      this.$store.commit("advancedSearch/setAdvancedSearchDialogStatus", true);
    },
  },
};
</script>

<style lang="scss" scoped>
/* Refactored: Consolidated home-search-bt and home-search-bt-xl using media query */
.home-search-btn {
  right: 0;
  top: 0;
  border-radius: unset;

  /* Default height for lg and down (40px) */
  height: 40px !important;

  /* Target xl displays (1920px and up) */
  @media (min-width: 1920px) {
    height: 50px !important;
  }
}

/* Refactored: Converted dynamic font sizing checks directly to CSS media queries */
.advanced-header-btn {
  /* Default Desktop / Medium Font Size (advancedTextMd) */
  font-size: 14px;

  /* Target Extra Large Screens (advancedTextXl) */
  @media (min-width: 1920px) {
    font-size: 18px; /* Set this to match your project's advancedTextXl font size */
  }
}

.button-text-size {
  font-size: 13px;
}
</style>
