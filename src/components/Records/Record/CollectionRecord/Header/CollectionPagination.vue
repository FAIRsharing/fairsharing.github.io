<template>
  <v-pagination
    v-model="currentPageLocal"
    :length="totalPages"
    :total-visible="($vuetify.breakpoint.mdAndUp) ? 7 : 3"
    @input="paginate"
  />
</template>

<script>
    import {mapActions, mapState} from "vuex";

    /** Component to handle the advanced search filters for the searchFairsharingRecords query.
     * @vue-prop {Number} [totalPages = 0] - the total number of pages to display
     * @vue-data {Number} [currentQuery = null] - the current page number
     */
    export default {
      name: "CollectionPagination",
      data() {
        return {
          currentPageLocal: 1
        }
      },
      computed: {
        ...mapState('records', ["currentPage", "totalPages"]),
      },
      mounted() {
        this.$nextTick(() => {
          this.currentPageLocal = this.currentPage;
        })
      },
      methods: {
        ...mapActions('records', ['paginateRecords', 'fetchCollectionRecords']),
        /**
         * Set the current query page parameter value to the given input for vueJs router
         * @param {Number} pageNumber - the page to go to
         */
        paginate: async function (pageNumber) {
          if (pageNumber !== this.currentPage) {
            await this.paginateRecords(pageNumber);
            await this.fetchCollectionRecords();
          }
        }
      }
    }
</script>

<style scoped>
button {
  outline: none;
}

#advancedSearch {
  top: 20px;
}
</style>
