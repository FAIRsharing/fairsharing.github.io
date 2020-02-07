<template>
  <div class="container">
    <form class="card" v-if="filters.length > 0">
      <div class="card-header">
        <h2>Advanced search</h2>
      </div>
      <div class="card-body filters">
        <div
          v-for="(filter, key) in filters"
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
          @click="applyFilters()"
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
    import { mapState } from "vuex"

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
            ...mapState("searchFilters", ["filters"])
        },
        methods: {
          applyFilters: function(){
                let _module = this;
                let formData = {};
                Object.keys(_module.form.data).forEach(function(key){
                  // Need to validate/sanitize data before sending.
                  formData[key] = encodeURI(_module.form.data[key].trim());
                });
                this.$router.push({
                    name: _module.$route.name,
                    query: formData
                });
                _module.form.data = {}
            },
            reset: function(){
                this.form.data = {};
                this.$router.push({name: this.$route.name});
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