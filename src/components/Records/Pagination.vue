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
        :class="{'active' : index === currentQuery.page}"
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
                currentQuery: {
                    page: null,
                    type: Number,
                },
            }
        },
        watch: {
            '$route.name': function () {
                this.currentQuery.page = 1;
            },
            '$route.query': function (newVal) {
                let _module = this;
                if (!Object.prototype.hasOwnProperty.call(newVal, "page")) {
                    _module.currentQuery.page = 1;
                } else {
                    _module.currentQuery.page = Number(newVal.page);
                }
            }
        },
        created() {
            let currentPage = this.$route.query.page;
            typeof (currentPage) !== "undefined" ? this.currentQuery.page = Number(currentPage) : this.currentQuery.page = 1;
        },
        methods: {
            paginate: async function (pageNumber) {
                if (pageNumber !== this.currentQuery.page) {
                    let _module = this;
                    _module.currentQuery = {};
                    Object.keys(_module.$route.query).forEach(function (param) {
                        _module.currentQuery[param] = _module.$route.query[param]
                    });
                    _module.currentQuery.page = pageNumber;
                    await _module.$router.push({
                        name: _module.$route.name,
                        query: _module.currentQuery
                    });
                }
            },
            first: function () {
                this.paginate(1);
            },
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
