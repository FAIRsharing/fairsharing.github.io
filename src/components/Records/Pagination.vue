<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li
        v-if="totalPages>5"
        class="page-item"
      >
        <button
          class="page-link"
          @click="first"
        >
          first
        </button>
      </li>

      <li
        v-for="index in totalPages"
        :key="index"
        class="page-item"
        :class="{'active' : index === currentPage}"
        @click="paginate(index)"
      >
        <button
          class="page-link"
        >
          {{ index }}
        </button>
      </li>

      <li
        v-if="totalPages>5"
        class="page-item"
      >
        <button
          class="page-link"
          @click="last"
        >
          last
        </button>
      </li>
    </ul>
  </nav>
</template>

<script>
    import {throttle} from 'lodash';

    /** Component to handle the advanced search filters for the searchFairsharingRecords query.
     * @vue-prop {Number} [totalPages = 0] - the total number of pages to display
     * @vue-data {Number} [currentQuery = null] - the current page number
     */
    export default {
        name: "Pagination",
        props: {
            totalPages: {
                type: Number,
                default: 0
            },
        },
        data() {
            return {
                currentPage: null,
                allowPaginate: true,
                disable: false
            }
        },
        watch: {
            '$route.name': function () {
                this.currentPage = 1;
            },
            '$route.query': function (newVal) {
                let _module = this;
                if (!Object.prototype.hasOwnProperty.call(newVal, "page")) {
                    _module.currentPage = 1;
                } else {
                    _module.currentPage = Number(newVal.page);
                }
            }
        },
        created() {
            let currentPage = this.$route.query.page;
            currentPage !== undefined ? this.currentPage = Number(currentPage) : this.currentPage = 1;
        },
        methods: {
            /**
             * Set the current query page parameter value to the given input for vueJs router
             * @param {Number} pageNumber - the page to go to
             */
            paginate: async function (pageNumber) {
                if (this.allowPaginate) {
                    this.disableThrottle(this.disable);
                    if (pageNumber !== this.currentPage && this.allowPaginate) {
                        let _module = this;
                        let currentQuery = {};
                        _module.currentPage = pageNumber;
                        Object.keys(_module.$route.query).forEach(function (param) {
                            currentQuery[param] = _module.$route.query[param]
                        });
                        currentQuery.page = pageNumber;
                        await _module.$router.push({
                            name: _module.$route.name,
                            query: currentQuery
                        });
                    }
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
            },
            /**
             * Set the current page to the first page
             */
            first: function () {
                this.paginate(1);
            },
            /**
             * Set the current page to the last page
             */
            last: function () {
                this.paginate(this.totalPages);
            }
        },
    }
</script>

<style scoped>
    button {
        outline: none;
    }

</style>
