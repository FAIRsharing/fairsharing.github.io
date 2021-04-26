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
      <!--List Controller-->
      <ListController
        class="mt-2"
        :options="{hasPagination:true,hasSorting:false,hasListType:true}"
        @ChangeListType="changeListType"
      />

      <!--List Row-->
      <div :class="['opacity-0-transition',{'opacity-1-transition':!isColumnList}]">
        <article v-if="!isColumnList">
          <v-skeleton-loader
            type="image"
            :loading="loading"
          >
            <!--    result number        -->
            <p class="text-center mt-2">
              Displaying A b c.
            </p>

            <!-- StackCard view -->
            <RecordsCardStack
              v-for="item in receivedData.records"
              :key="'record_'+item.id"
              :record="item"
            />
            <!--Pagination-->
            <Pagination
              :total-pages="receivedData['totalPages']"
              class="mb-4"
            />
          </v-skeleton-loader>
        </article>
      </div>
      <!-- ColumnCard view -->
      <div :class="['opacity-0-transition',{'opacity-1-transition':isColumnList}]">
        <article v-if="isColumnList">
          <v-skeleton-loader
            type="image"
          >
            <!--    result number        -->
            <p class="text-center mt-2">
              Displaying A b c.
            </p>

            <!-- ColumnCard view -->
            <v-row>
              <records-card-column
                v-for="item in receivedData.records"
                :key="'record_'+item.id"
                :record="item"
              />
            </v-row>
            <!--Pagination-->
            <Pagination
              :total-pages="receivedData['totalPages']"
              class="mb-4"
            />
          </v-skeleton-loader>
        </article>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import Pagination from "@/components/Records/Search/Header/Pagination";

import {mapState} from "vuex";
import stringUtils from "@/utils/stringUtils";
import recordsQuery from "@/lib/GraphClient/queries/getRecords.json"
import Client from "@/lib/GraphClient/GraphClient";
import RecordsCardStack from "@/components/Records/Search/Output/RecordsCardStack";
import RecordsCardColumn from "@/components/Records/Search/Output/RecordsCardColumn";
import ListController from "@/components/Records/Search/Header/ListController";

let client = new Client();

export default {
  name: "SearchCollection",
  components: {ListController, RecordsCardColumn, RecordsCardStack, Pagination},
  mixins:[stringUtils],
  props: {
    record: {default: null, type: Object},
  },
  data() {
    return {
      allowClicking: false,
      collectionIDs:[],
      receivedData:{},
      isColumnList: false,
      loading:false
    }
  },
  computed: {
    ...mapState("record", ["currentRecord"])
  },
  async mounted() {
    this.receivedData = await this.prepareCollectionData();
  },
  methods: {
    changeListType: function (listType) {
      this.isColumnList = listType;
    },
    async prepareCollectionData() {
      if (Object.keys(this.currentRecord['fairsharingRecord']).includes('recordAssociations')) {
        const collections = this.prepareAssociations(this.currentRecord['fairsharingRecord']['recordAssociations'], [])
            .filter(item => item.recordAssocLabel === 'collects')
        collections.forEach(item => {
          this.collectionIDs.push(item.id);
        })
        recordsQuery.queryParam = {ids: this.collectionIDs}
        this.loading = true;
        const data = await client.executeQuery(recordsQuery);
        this.loading = false;
        return data["searchFairsharingRecords"];
      } else
      {
        return false
      }
    },
    prepareAssociations(associations, reverseAssociations) {
      let _module = this;
      let recordAssociations = []
      let joinedArrays = associations.concat(reverseAssociations);
      const properties = ['fairsharingRecord', 'linkedRecord'];

      joinedArrays.forEach(item => {
        let object = {};
        properties.forEach(prop => {
          if (Object.prototype.hasOwnProperty.call(item, prop)) {
            object.recordAssocLabel = _module.cleanString(item.recordAssocLabel);
            object.id = item[prop].id;
            object.registry = item[prop].registry;
            object.name = item[prop].name;
            object.subject = _module.currentRecord['fairsharingRecord'].name;
            object.type = item[prop].type;
          }
        });
        recordAssociations.push(object);
      });
      return recordAssociations;
    }
  }
}


</script>

<style scoped>

</style>
