<template>
  <div>
    <ul class="d-flex align-items-center">
      <span class="mr-4">Sort By</span>
      <li
        v-for="(sortButton,index) in sortFilters"
        :key="index"
        class="mr-1"
      >
        <v-btn
          :class="sortButton.active?'primary':'depressed'"
          class="mr-4"
          @click="changeActiveFilter(sortButton)"
        >
          <b>{{ sortButton.name }}</b>
        </v-btn>
      </li>
    </ul>
    <v-btn-toggle
      v-model="ToggleButtonText"
      mandatory
      shaped
    >
      <v-btn
        value="asc"
      >
        ASC
      </v-btn>

      <v-btn
        value="desc"
      >
        DESC
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
    export default {
        name: "Sorting",
        data() {
            return {
                sortFilters: [
                    {name: 'Name', active: true},
                    {name: 'Best-Match', active: false},
                ],
                activeFilter:{name: 'Name', active: true},
                ToggleButtonText: ['asc', 'desc']
            }
        },
        methods:
            {
                changeActiveFilter(activeFilter) {
                    console.log('sortFilters',this.sortFilters);
                    this.sortFilters.map((item)=>{item===activeFilter?item.active=true:item.active=false});
                    this.activeFilter = activeFilter;
                    // this.$forceUpdate();
                    console.log("activeFilter",this.activeFilter);
                }
            }
    }
</script>

<style scoped lang="scss">

    ul {
        list-style: none;
        padding: 0;
      li{
        .v-btn{
          width: 150px;
        }
      }
    }
</style>