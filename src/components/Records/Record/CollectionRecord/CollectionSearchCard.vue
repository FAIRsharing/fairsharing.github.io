<template>
  <section class="mb-4 ml-4 cursor-pointer">
    <v-card
      v-ripple
      class="pa-6 d-flex flex-column"
      outlined
      tile
      :height="$vuetify.breakpoint.smAndDown?'500px':'400px'"
      :elevation="allowClicking?'5':'1'"
      @mouseenter="allowClicking=true"
      @mouseleave="allowClicking=false"
    >
      <h2 class="text-body-2 text-md-body-1 text-lg-h6 text-xl-h5 min-height-25">
        (Abbreviation)
      </h2>
      <v-row
        no-gutters
        class="flex-grow-0"
      >
        <v-col
          cols="12"
          xs="12"
          sm="2"
          md="2"
          lg="2"
          xl="1"
        >
          <RecordStatus
            v-if="false"
            :record="record"
            class="mt-4"
          />
        </v-col>
        <v-col
          cols="12"
          xs="12"
          sm="10"
          md="10"
          lg="10"
          xl="11"
        >
          <h3 :class="['mt-5 mb-4 ml-10 text-sm-h6 text-body-2 text-md-h6 text-lg-h5 text-xl-h4 primary--text height-90',{'overflow-hidden':$vuetify.breakpoint.mdAndDown}]">
            record.name
          </h3>
          <div class="height-50">
            <p class="mt-2 ml-10 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height-2lines">
              record.description
            </p>
          </div>
          <!-- chips container -->
          <SearchLinkChips
            v-if="false"
            :chips="chips"
            class="ml-10"
            :remain-tag-count="remainTagCount"
          />
        </v-col>
      </v-row>
      <v-divider class="dashed-line" />
      <!--  Associated Records Summary  -->
      <associated-records-summary
        v-if="false"
        :associated-records="associatedRecords(record)"
        class="ml-5"
      />
    </v-card>
  </section>
</template>

<script>
import AssociatedRecordsSummary from "@/components/Records/Search/Output/AssociatedRecordsSummary";
import SearchLinkChips from "@/components/Records/Search/Output/SearchLinkChips";
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import {mapState} from "vuex";
import stringUtils from "@/utils/stringUtils";
import recordsQuery from "@/lib/GraphClient/queries/getRecords.json"
import Client from "@/lib/GraphClient/GraphClient";

let client = new Client();

export default {
  name: "CollectionSearchCard",
  components: {RecordStatus, SearchLinkChips, AssociatedRecordsSummary},
  mixins:[stringUtils],
  props: {
    record: {default: null, type: Object},
  },
  data() {
    return {
      allowClicking: false,
      collectionIDs:[]
    }
  },
  computed: {
    ...mapState("record", ["currentRecord"])
  },
  mounted() {
    this.prepareTabsData();
  },
  methods: {
    async prepareTabsData() {
      if (Object.keys(this.currentRecord['fairsharingRecord']).includes('recordAssociations')) {
        const collections = this.prepareAssociations(this.currentRecord['fairsharingRecord']['recordAssociations'], [])
            .filter(item => item.recordAssocLabel === 'collects')
        collections.forEach(item => {
          this.collectionIDs.push(item.id);
        })
        recordsQuery.queryParam = {ids: [1, 2]}
        const data = await client.executeQuery(recordsQuery);
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

</style>
