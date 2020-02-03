<template>
  <div class="container">
    <form class="card">
      <div class="card-header">
        <h2>Advanced search</h2>
      </div>
      <div class="card-body filters">
        <div
          v-for="(filter, key) in $store.state.searchFilters.filters"
          :key="key"
        >
          <b>{{ filter.filterLabel }}:</b>

          <div
            v-if="filter.values"
            class="filter"
          >
            <select v-model="form.data[filter.filterName]">
              <option
                v-for="(value, subKey) in filter.values"
                :key="subKey"
              >
                {{ value }}
              </option>
            </select>
          </div>
          <div
            v-else
            class="filter"
          >
            <input v-model="form.data[filter.filterName]">
          </div>
          <hr>
        </div>
      </div>
      <div class="card-footer">
        <b>String search:</b>
        <input
          v-model="form.data['q']"
          type="text"
        >
        <button
          type="button"
          class="btn btn-success"
          @click="getData()"
        >
          Search
        </button>
        <button
          type="button"
          class="btn btn-danger"
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
        data() {
            return {
                form: {
                    data: {}
                }
            }
        },
        computed: {
          currentPath: function () {
            // do a better job to handle click on search that doesnt reset the form
            return this.$route.path.replace('/', '');
          }
        },
      watch: {
        currentPath: function () {
          this.form.data = {};
        }
      },
        methods: {
            getData: function(){
                // Need to validate data before sending.
                let currentPath = this.$route.name;
                let client = this;
                Object.keys(client.form.data).forEach(function(key){
                   client.form.data[key] = encodeURI(client.form.data[key])
                });
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

  div.filter {
    display: inline-block;
    width: 300px;
    float:right;
  }

  div.filter select, div.filter input {
    width:100%;
  }

  button {
    margin-left:15px;
  }

</style>