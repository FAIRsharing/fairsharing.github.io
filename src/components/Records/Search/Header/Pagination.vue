<template>
  <v-pagination
    v-model="page"
    :length="totalPages"
    :total-visible="($vuetify.breakpoint.mdAndUp) ? 7 : 3"
  />
</template>

<script>
    import {throttle} from 'lodash';
    import {mapState} from "vuex";

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
                currentPageLocal: null,
                allowPaginate: true,
                disable: false,
                page: 1
            }
        },
      computed:{
        ...mapState("records", ["currentPage"]),
      },
      watch: {
            '$route.name': function () {
                this.currentPageLocal = 1;
            },
            '$route.query': function (newVal) {
                let _module = this;
                if (!Object.prototype.hasOwnProperty.call(newVal, "page")) {
                    _module.currentPageLocal = 1;
                }
                else {
                    _module.currentPageLocal = Number(newVal.page);
                }
            },
            'page': function (newPage) {
                this.paginate(newPage);
            }
        },
        created() {
            this.currentPageLocal = this.currentPage;
            this.page = this.currentPage;
        },
        methods: {
            /**
             * Set the current query page parameter value to the given input for vueJs router
             * @param {Number} pageNumber - the page to go to
             */
            paginate: async function (pageNumber) {
                if (this.allowPaginate) {
                    if (pageNumber !== this.currentPageLocal && this.allowPaginate) {
                        let _module = this;
                        let currentQuery = {};
                        _module.currentPageLocal = pageNumber;
                        Object.keys(_module.$route.query).forEach(function (param) {
                            currentQuery[param] = _module.$route.query[param]
                        });
                        currentQuery.page = pageNumber;
                        this.disableThrottle(this.disable);
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
                }
                else {
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
