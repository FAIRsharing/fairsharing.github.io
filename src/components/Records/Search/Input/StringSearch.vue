<template>
  <div>
    <v-form
      ref="form"
      v-model="formValid"
      class="d-flex flex-row align-center align-content-center pt-1 mr-1 mr-lg-1 ml-1"
      style="position: relative"
      validate-on="submit lazy"
      @submit.prevent="searchString()"
    >
      <v-text-field
        id="fairsharing-global-search-input"
        v-model="searchTerm"
        :placeholder="placeholder"
        class="search-text-field full-width"
        clearable
        density="compact"
        single-line
        variant="solo"
      />

      <v-btn
        v-if="!showHomeSearch"
        class="search-btn mt-1 mt-lg-1 ml-2"
        color="primary"
        size="small"
        type="submit"
        variant="outlined"
        @click="searchString()"
      >
        <v-icon class="mr-1" size="x-small"> fas fa-search </v-icon>
        <span class="button-text-size">Search</span>
      </v-btn>

      <AdvancedSearch
        v-if="!showHomeSearch"
        :advanced-search-term="searchTerm"
        @clear-search-field="clearSearchField"
      />

      <v-btn
        v-if="showHomeSearch"
        class="mt-1 mt-lg-1 ml-2 home-page-search-btn"
        color="primary"
        @click="searchStringHomePage()"
      >
        <v-icon class="mr-1" size="x-small"> fas fa-search </v-icon>
        <span class="button-text-size">Search</span>
      </v-btn>
    </v-form>

    <div v-if="showHomeSearch" class="pt-6">
      <v-checkbox
        v-for="(checkbox, index) in registries"
        :key="checkbox.value + '_' + index"
        v-model="selectedRegistries"
        :label="checkbox.label"
        :value="checkbox"
        class="d-inline-block mr-2"
        color="primary"
      >
        <template #label>
          <span class="v-label-white">{{ checkbox.label }}</span>
        </template>
      </v-checkbox>
    </div>
  </div>
</template>

<script>
import AdvancedSearch from "@/components/Records/Search/Input/AdvancedSearch/AdvancedSearch.vue";

export default {
  name: "StringSearch",
  components: { AdvancedSearch },
  props: {
    placeholder: { default: null, type: String },
    showHomeSearch: { default: false, type: Boolean },
    addSearchTerms: { default: false, type: Boolean },
    searchPath: { default: "/search", type: String },
  },
  data() {
    return {
      searchTerm: null,
      registries: [
        { label: "standards", value: "standard" },
        { label: "databases", value: "database" },
        { label: "policies", value: "policy" },
        { label: "collections", value: "collection" },
      ],
      selectedRegistries: [
        { label: "standards", value: "standard" },
        { label: "databases", value: "database" },
        { label: "policies", value: "policy" },
        { label: "collections", value: "collection" },
      ],
      formValid: true,
    };
  },
  methods: {
    searchString() {
      const _module = this;
      let query = {};
      if (_module.searchTerm) {
        if (_module.addSearchTerms) {
          query = { ..._module.$route.query, q: _module.searchTerm };
        }
        else {
          query = { q: _module.searchTerm.replace(/[^0-9a-z]/gi, " ") };
        }
      }
      _module.$router.push({ path: _module.searchPath, query: query });
      _module.$refs.form.resetValidation();
    },
    searchStringHomePage() {
      const _module = this;
      let query = {};
      if (_module.searchTerm) {
        if (_module.selectedRegistries.length === _module.registries.length) {
          _module.$router.push({
            path: "/search",
            query: { q: _module.searchTerm ? _module.searchTerm : undefined },
          });
          _module.searchTerm = null;
          _module.$refs.form.resetValidation();
        }
        else {
          const selectedRegistriesValues = [];
          _module.selectedRegistries.forEach((registryItem) => {
            selectedRegistriesValues.push(registryItem.value);
          });
          query = {
            q: _module.searchTerm ? _module.searchTerm : undefined,
            fairsharingRegistry: selectedRegistriesValues.toString(),
            searchAnd: false,
          };
        }
        _module.$router.push({ path: "/search", query: query });
      }
      _module.$refs.form.resetValidation();
    },
    clearSearchField(item) {
      if (item) this.searchTerm = null;
    },
  },
};
</script>

<style lang="scss" scoped>
/* Refactored: Unified text field styling responsive heights with CSS Media Queries */
.search-text-field {
  box-shadow: 0 0 0 0;
  height: 35px !important;
  margin-bottom: 7px;

  :deep(.v-field__input) {
    min-height: 35px;
  }

  /* Target screen widths equivalent to Vuetify's xl breakpoint (1920px+) */
  @media (min-width: 1920px) {
    height: 48px;
    margin-bottom: 15px;
    :deep(input) {
      height: 50px;
    }
    :deep(.v-field__input) {
      min-height: 50px;
    }
  }
}

.button-text-size {
  font-size: 12px;
}

/* Refactored: Converted responsiveHeight computed property directly to CSS Breakpoints */
.search-btn {
  /* Default Mobile/Small Layout (style-sm-xs) */
  height: 40px !important;
  margin-bottom: 5px;

  /* Medium Screens (style-md: 960px to 1279px) */
  @media (min-width: 960px) and (max-width: 1279px) {
    height: 32px !important;
    margin-bottom: 0;
  }

  /* Large Screens (style-lg: 1280px to 1919px) */
  @media (min-width: 1280px) and (max-width: 1919px) {
    height: 36px !important;
    margin-bottom: 4px;
  }

  /* Extra Large Screens (style-xl: 1920px+) */
  @media (min-width: 1920px) {
    height: 52px !important;
    margin-bottom: 4px;
  }
}

/* Refactored: Combined home-search-bt and home-search-bt-xl using media query */
.home-page-search-btn {
  position: absolute;
  right: 0;
  top: 0;
  border-radius: unset;
  -webkit-border-radius: unset;
  -moz-border-radius: unset;

  /* Base height for lg and down */
  height: 40px !important;

  /* Target xl display size */
  @media (min-width: 1920px) {
    height: 50px !important;
  }
}

.v-label-white {
  color: white;
}
</style>
