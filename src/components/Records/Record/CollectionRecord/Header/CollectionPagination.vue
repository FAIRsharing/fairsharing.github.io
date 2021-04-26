<template>
  <v-pagination
    v-model="currentPageLocal"
    :length="totalPages"
    :total-visible="($vuetify.breakpoint.mdAndUp) ? 7 : 3"
    @input="paginate"
  />
</template>

<script>
    import {throttle} from 'lodash';
    import {mapActions, mapState} from "vuex";

    /** Component to handle the advanced search filters for the searchFairsharingRecords query.
     * @vue-prop {Number} [totalPages = 0] - the total number of pages to display
     * @vue-data {Number} [currentQuery = null] - the current page number
     */
    export default {
      name: "CollectionPagination",
      data() {
        return {
          allowPaginate: true,
          disable: false,
          currentPageLocal: 1
        }
      },
      computed: {
        ...mapState('collectionRecords', ["currentPage", "totalPages"]),
      },
      mounted() {
        this.$nextTick(() => {
          this.currentPageLocal = this.currentPage;
        })
      },
      methods: {
        ...mapActions('collectionRecords', ['paginateRecords', 'fetchRecords']),
        /**
         * Set the current query page parameter value to the given input for vueJs router
         * @param {Number} pageNumber - the page to go to
         */
        paginate: async function (pageNumber) {
          const _module = this;
          if (this.allowPaginate) {
            this.disableThrottle(this.disable);
            await _module.paginateRecords(pageNumber);
            await _module.fetchRecords();
          }
        },
        /**
         * Postpone the pagination buttons to be clickable
         */
        PaginatePermission: throttle(function () {
          this.allowPaginate = true
        }, 1200),

        /**
         * Set the environment ready for testing or development
         * @param {Boolean} disable - should disable or not the throttle for the next call
         */
        disableThrottle: function (disable) {
          if (!disable) {
            this.allowPaginate = false;
            this.PaginatePermission();
          } else {
            this.allowPaginate = true;
          }
        }
      },
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
