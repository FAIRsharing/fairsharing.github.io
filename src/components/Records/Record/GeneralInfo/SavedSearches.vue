<template>
  <div
    v-if="getField('savedSearches') && getField('savedSearches').length"
    class="d-flex flex-row mt-4 align-center min-height-40"
  >
    <b class="width-15-percent-flex">Saved Search</b>
    <div class="d-flex ml-md-12 ml-13">
      <v-chip
        v-for="search in getField('savedSearches')"
        :key="search.id"
        class="ma-1"
        color="secondary"
        :close="user().is_super_curator? true : false"
        close-icon="mdi-delete"
        text-color="white"
      >
        <a
          class="white--text"
          :href="search.url"
        >
          {{ search.name }}
        </a>
      </v-chip>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";
export default {
  name: "SavedSearches",
  computed: {
    ...mapState('users', ['user']),
    ...mapGetters("record", ["getField"]),
  },
};
</script>