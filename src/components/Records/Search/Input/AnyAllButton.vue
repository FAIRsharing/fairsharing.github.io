<template>
  <div class="d-flex flex-row justify-start pr-3 mb-1 mb-lg-2">
    <v-btn
      color="primary"
      width="50%"
      class="mr-1"
      :outlined="!searchAnd"
      @click="applyFilter(true)"
    >
      Match All Terms
    </v-btn>
    <v-btn
      color="primary"
      width="50%"
      :outlined="searchAnd"
      @click="applyFilter(false)"
    >
      Match Any Term
    </v-btn>
  </div>
</template>

<script>
    export default {
      name: "AnyAllButton",
      data() {
        return {
          searchAnd: true
        }
      },
      mounted() {
        this.$nextTick(function () {
          const _module = this;
          _module.searchAnd = (_module.$route.query.searchAnd) ? JSON.parse(_module.$route.query.searchAnd) : true;
        });
      },
      methods: {
        async applyFilter(value) {
          const _module = this;
          if (_module.searchAnd !== value) {
            _module.searchAnd = value;
            let currentQuery = JSON.parse(JSON.stringify(_module.$route.query));
            currentQuery.searchAnd = `${value}`;
            await _module.$router.push({
              path: 'search',
              query: currentQuery
            })
          }
        }
      }
    }
</script>
