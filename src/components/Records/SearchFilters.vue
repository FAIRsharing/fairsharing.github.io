<template>
  <div class="container">
    <form class="card">
      <div class="card-header">
        Advanced search
      </div>
      <div class="card-body filters">
        <div
          v-for="(filter, key) in $store.state.searchFilters.filters"
          :key="key"
        >
          <b>{{ filter.filterLabel }}:</b>

          <div v-if="filter.values">
            <select v-model="form.data[filter.filterName]">
              <option
                v-for="(value, subKey) in filter.values"
                :key="subKey"
              >
                {{ value }}
              </option>
            </select>
          </div>
          <div v-else>
            <input v-model="form.data[filter.filterName]">
          </div>
        </div>
      </div>
      <div class="card-footer">
        <input
          v-model="form.data['q']"
          type="text"
        > <br>
        <button
          type="button"
          @click="getData()"
        >
          Search
        </button>
        <button
          type="button"
          @click="reset()"
        >
          Reset
        </button>
      </div>
    </form>
  </div>
</template>

<script>

    export default {
        name: "SearchFilters",
        props: {
            filters: {
                type: Object,
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                searchString: null,
                form: {
                    data: {}
                }
            }
        },
        computed: {
          currentPath: function () {
            return this.$route.path.replace('/', '');
          }
        },
      watch: {
        currentPath: function () {
          this.form.data = [];
        }
      },
        methods: {
            getData: function(){
                // Need to validate form.data
                // Need to encoreURI() values in form.data
                let currentPath = this.$route.name;
                this.$router.push({
                    name: currentPath,
                    query: this.form.data
                });
                return 0;
            },
            reset: function(){
                this.form.data = {};
                let currentPath = this.$route.name;
                this.$router.push({
                    name: currentPath
                });
                return 0;
            }
        }
    }
</script>

<style scoped>
    .filters {
        text-align: left;
    }
</style>