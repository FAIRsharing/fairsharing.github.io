<template>
  <v-row
    dense
  >
    <v-col
      v-if="$vuetify.breakpoint.lgAndUp"
      class="pl-0 pa-4 pt-0"
      cols="12"
      sm="12"
      md="4"
      lg="4"
      xl="4"
    >
      <SearchInput :show-search-box="false" />
    </v-col>
    <v-col
      id="topElement"
      class="pa-0"
      cols="12"
      sm="12"
      md="12"
      lg="8"
      xl="8"
    >
      <!--Filtered Chips-->
      <div
        v-if="getChips.length"
        class="d-flex align-content-center justify-content-center chips-holder"
      >
        <filter-chips />
      </div>
      <!--List Controller-->
      <ListController
        class="mt-2"
        :options="{hasPagination:true,hasSorting:false,hasListType:true}"
        @ChangeListType="changeListType"
      />
      <!--show filter button for tablet and below-->
      <div
        v-if="$vuetify.breakpoint.mdAndDown"
        class="mb-2"
      >
        <v-btn
          class="info"
          @click="showFiltersSM = true"
        >
          <span class="mr-2">Show filters</span>
          <v-icon small>
            fa-filter
          </v-icon>
        </v-btn>
      </div>
      <!-- Alert -->
      <v-alert
        v-if="getRecordsLength<1 && !loading"
        colored-border
        type="info"
      >
        No records match your search!
      </v-alert>

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
    <v-fade-transition>
      <v-dialog
        v-model="showFiltersSM"
        fullscreen
        hide-overlay
        scrollable
      >
        <v-card>
          <v-card-title class="primary white--text pb-5">
            Add a filter
            <v-spacer />
            <v-btn
              fab
              x-small
              @click="showFiltersSM = false"
            >
              <v-icon>fa-times</v-icon>
            </v-btn>
          </v-card-title>
          <SearchInput class="pa-5" />
        </v-card>
      </v-dialog>
    </v-fade-transition>
  </v-row>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import stringUtils from "@/utils/stringUtils";
import RecordsCardStack from "@/components/Records/Search/Output/RecordsCardStack";
import RecordsCardColumn from "@/components/Records/Search/Output/RecordsCardColumn";
import SearchInput from "@/components/Records/Search/Input/SearchInput";
import ListController from "@/components/Records/Search/Header/ListController";
import Pagination from "@/components/Records/Search/Header/Pagination";
import FilterChips from "@/components/Records/Search/Header/FilterChips";
import filterChipsUtils from "@/utils/filterChipsUtils";

export default {
  name: "SearchCollection",
  components: {
    FilterChips,
    Pagination,
    ListController,
    SearchInput, RecordsCardColumn, RecordsCardStack
  },
  mixins: [stringUtils, filterChipsUtils],
  data() {
    return {
      allowClicking: false,
      collectionIDs:[],
      receivedData:{},
      isColumnList: false,
      showFiltersSM: false
    }
  },
  computed: {
    ...mapState("record", ["currentRecord"]),
    ...mapState("records",["records","totalPages","currentPage","loading","facets"]),
    ...mapGetters("records",["getRecordsLength"]),
    ...mapGetters('introspection', ['buildQueryParameters']),
    currentPath: function () {
      const _module = this;
      let queryParams = {};
      Object.keys(this.$route.query).forEach(function (prop) {
        let queryVal = _module.$route.query[prop];
        if (queryVal) {
          queryParams[prop] = decodeURI(queryVal);
        }
      });
      const title = 'Collection';
      return [title, queryParams];
    }
  },
  async mounted() {
    await this.prepareCollectionData();

    // make the left panel sticky under any circumstances.
    this.setGeneralUIAttributesAction({
      headerVisibilityState: false
    });
  },
  beforeDestroy() {
    this.cleanRecordsStore();
  },
  methods: {
    ...mapActions("records", ['initializeCollectionRecords','fetchCollectionRecords']),
    ...mapMutations("records", ['cleanRecordsStore']),
    ...mapActions("uiController", ['setGeneralUIAttributesAction']),
    scrollTo() {
      this.$scrollTo("#topElement", 1000, {
        easing: 'ease-out',
      })
    },
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
        this.errors = false;
        let returnedQuery = this.buildQueryParameters(this.currentPath);
        delete returnedQuery['fairsharingRegistry'];
        try {
            await this.initializeCollectionRecords(this.collectionIDs);
        }
        catch (e) {
          this.errors = e.message;
        }
        try {
         await this.fetchCollectionRecords(returnedQuery);
        }
        catch (e){
          this.errors = e.message;
        }
      }
      else {
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
.chips-holder {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f5f5f5;
  min-height: 50px;
  border: #dbdbdb dotted 2px;
  border-radius: 10px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
}
</style>
