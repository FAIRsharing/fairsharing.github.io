<template>
  <v-list>
    <v-list-item
      v-for="(item, index) in getFilters()"
      :key="'sorter_' + index"
      :class="{'v-list-item--active': activeFilter === item.name + ',' + item.order}"
      @click="applySortQuery(item.name, item.order)"
    >
      <v-list-item-title>
        {{ item.label }} ({{ item.orderLabel }})
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script>
    export default {
        name: "Sorting",
        data() {
            return {
                sortFilters: [
                    {name: 'name', label: 'name', active: false},
                    {name: 'abbreviation', label: 'abbreviation', active: false},
                    {name: '_score', label: 'best-match', active: false},
                ],
                activeFilter: null
            }
        },
        mounted(){
          const _module = this;
          _module.activeFilter = (_module.$route.query.orderBy) ? _module.$route.query.orderBy : '_score,asc';
        },
        methods: {
          /**
           * Set the orderBy parameter value to the given input for vueJs router
           * @param {string} activeSortFilterName - sorting under this name
           * @param {string} sortMethod - can be either ASC or DESC
           */
          applySortQuery: async function (activeSortFilterName, sortMethod) {
              let _module = this;
              let inputOrderBy = `${activeSortFilterName},${sortMethod}`;
              let currentQuery = JSON.parse(JSON.stringify(_module.$route.query));
              currentQuery["orderBy"] = inputOrderBy;
              if (inputOrderBy !== _module.activeFilter){
                await _module.$router.push({
                  name: _module.$route.name,
                  query: currentQuery
                });
              }
          },
          getFilters: function(){
                  let filters = [];
                  this.sortFilters.forEach(function(filter){
                    filters.push({
                      label: filter.label,
                      name: filter.name,
                      order: "asc",
                      orderLabel: "ascending"
                    });
                    if (filter.name !== '_score') {
                      filters.push({
                        label: filter.label,
                        name: filter.name,
                        order: "desc",
                        orderLabel: "descending"
                      })
                    }
                  });
                  return filters;
                }
        }
    }
</script>

<style scoped>
  .highlighted {
    color: red !important;
  }
</style>
