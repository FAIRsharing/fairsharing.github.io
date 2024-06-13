<template>
  <div
    v-if="getField('savedSearches') && getField('savedSearches').length"
    class="d-flex flex-row mt-4 align-center min-height-40"
  >
    <b class="width-15-percent-flex">Saved Search</b>
    <div class="d-flex ml-md-12 ml-13">
      <div
        v-for="(search, index) in getField('savedSearches')"
        :key="search.id"
      >
        <span
          v-if="index !== 0"
        >,</span>
        <a :href="search.url">
          {{ search.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "SavedSearches",
  computed: {
    ...mapGetters("record", ["getField"]),
  },
};
</script>