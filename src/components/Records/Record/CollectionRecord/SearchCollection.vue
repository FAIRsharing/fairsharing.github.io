<template>
  <v-row
    dense
  >
    <v-col
      class="pl-0 pa-4"
      cols="12"
      sm="12"
      md="4"
      lg="4"
      xl="4"
    >
      <SearchInput
        class="search__input"
      />
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

      <!-- Alert -->
      <v-alert
        v-if="getRecordsLength<1 && !loading"
        colored-border
        type="info"
      >
        No records match your search!
      </v-alert>
      <!-- Error -->
      <div
        v-if="errors"
        class="no-data-found"
      >
        <v-alert
          colored-border
          type="danger"
        >
          Error loading records!
        </v-alert>
      </div>

      <!-- StackCard view -->
      <div :class="['opacity-0-transition',{'opacity-1-transition':!isColumnList}]">
        <article v-if="!isColumnList">
          <v-skeleton-loader
            type="image"
            class="mt-2"
            :loading="loading"
          >
            <RecordsCardStack
              v-for="item in records"
              :key="'record_'+item.id"
              :record="item"
            />
            <!--Pagination-->
            <Pagination
              class="mb-4"
              :total-pages="totalPages"
            />
          </v-skeleton-loader>
        </article>
      </div>
      <!-- ColumnCard view -->
      <div :class="['opacity-0-transition',{'opacity-1-transition':isColumnList}]">
        <article v-if="isColumnList">
          <v-skeleton-loader
            :loading="loading"
            type="image"
            class="mt-2"
          >
            <!-- ColumnCard view -->
            <v-row>
              <records-card-column
                v-for="item in records"
                :key="'record_'+item.id"
                :record="item"
              />
            </v-row>
            <!--Pagination-->
            <Pagination
              class="mb-4"
              :total-pages="totalPages"
            />
          </v-skeleton-loader>
        </article>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import {mapActions, mapGetters, mapState} from "vuex";
import stringUtils from "@/utils/stringUtils";
import RecordsCardStack from "@/components/Records/Search/Output/RecordsCardStack";
import RecordsCardColumn from "@/components/Records/Search/Output/RecordsCardColumn";
import SearchInput from "@/components/Records/Search/Input/SearchInput";
import ListController from "@/components/Records/Search/Header/ListController";
import Pagination from "@/components/Records/Search/Header/Pagination";

export default {
  name: "SearchCollection",
  components: {
    Pagination,
    ListController,
    SearchInput, RecordsCardColumn, RecordsCardStack},
  mixins:[stringUtils],
  data() {
    return {
      allowClicking: false,
      collectionIDs:[],
      receivedData:{},
      isColumnList: false,
      errors:null
    }
  },
  computed: {
    ...mapState("record", ["currentRecord"]),
    ...mapState("records",["records","totalPages","currentPage","loading"]),
    ...mapGetters("records",["getRecordsLength"])
  },
  async mounted() {
    await this.prepareCollectionData();
  },
  methods: {
    ...mapActions('records', ['fetchCollectionRecords','setCollectionIdsParam']),
    changeListType: function (listType) {
      this.isColumnList = listType;
    },
    async prepareCollectionData() {
      if (Object.keys(this.currentRecord['fairsharingRecord']).includes('recordAssociations')) {
        const collections = this.prepareAssociations(this.currentRecord['fairsharingRecord']['recordAssociations'], [])
            .filter(item => item.recordAssocLabel === 'collects')
        collections.forEach(item => {
          this.collectionIDs.push(item.id);
        });
        try {
          // this.showFiltersSM = false;
          await this.setCollectionIdsParam(this.collectionIDs);
          await this.fetchCollectionRecords();
        }
        catch (e) {
          this.errors = e.message;
        }
      }
      else
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
.search__input {
  height: 2200px;
  position: relative;
  overflow-y: auto;
}
</style>
