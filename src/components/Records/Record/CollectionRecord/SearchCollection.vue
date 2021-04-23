<template>
  <v-row
    dense
  >
    <v-col
      class="pa-0"
      cols="12"
      sm="12"
      md="4"
      lg="4"
      xl="4"
      style="background: gray"
    >
      left
    </v-col>
    <v-col
      class="pa-0"
      cols="12"
      sm="12"
      md="8"
      lg="8"
      xl="8"
    >
      <!--List Row-->
      <div :class="['opacity-0-transition',{'opacity-1-transition':!isColumnList}]">
        <article v-if="!isColumnList">
          <v-skeleton-loader
            type="image"
          >
            <!--Pagination-->
            <Pagination
              :total-pages="5"
              class="mb-4"
            />
            <!-- StackCard view -->
            <CollectionSearchCard />
            <!--    result number        -->
            <p class="text-center mt-2">
              Displaying {{ x }}  to {{ y }} of {{ hits }}.
            </p>
          </v-skeleton-loader>
        </article>
      </div>
      <!-- ColumnCard view -->
      <div :class="['opacity-0-transition',{'opacity-1-transition':isColumnList}]">
        <article v-if="isColumnList">
          <v-skeleton-loader
            type="image"
          >
            <v-row>
              <CollectionSearchCard />
            </v-row>
            <!--List Controller-->
            <Pagination
              :total-pages="5"
            />
          </v-skeleton-loader>
        </article>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Pagination from "@/components/Records/Search/Header/Pagination";
import CollectionSearchCard from "@/components/Records/Record/CollectionRecord/CollectionSearchCard";
export default {
  name: "SearchCollection",
  components: {CollectionSearchCard, Pagination},
  data() {
    return {
      isColumnList: false
    }
  },
  methods:{
    changeListType: function (listType) {
      this.isColumnList = listType;
    }
  }
}
</script>

<style scoped>

</style>
