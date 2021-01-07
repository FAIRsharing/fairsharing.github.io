<template>
  <!--Stack List-->
  <router-link :to="'/' + getRecordLink(record)">
    <section class="ma-2 ma-md-2 ma-lg-1 pt-lg-4 cursor-pointer">
      <v-card
        v-ripple
        class="pa-6 d-flex flex-column"
        outlined
        tile
        height="400px"
        :elevation="allowClicking?'5':'1'"
        @mouseenter="allowClicking=true"
        @mouseleave="allowClicking=false"
      >
        <h2 class="text-body-2 text-md-body-1 text-lg-h6 text-xl-h5">
          {{ record.abbreviation }}
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
            <h3 :class="['mt-5 mb-4 ml-10 text-sm-h6 text-body-2 text-md-h6 text-lg-h5 text-xl-h4 primary--text height-60',{'overflow-hidden':$vuetify.breakpoint.mdAndDown}]">
              {{ record.name }}
            </h3>
            <div class="height-50">
              <p class="mt-2 ml-10 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height">
                {{ record.description }}
              </p>
            </div>
            <!-- chips container -->
            <SearchLinkChips
              :chips="chips"
              class="ml-10"
            />
          </v-col>
        </v-row>
        <v-divider class="dashed-line" />
        <associated-records-summary
          :associated-records="associatedRecords(record)"
          class="ml-5"
        />
      </v-card>
    </section>
  </router-link>
</template>

<script>
import recordsCardUtils from "@/utils/recordsCardUtils";
import { truncate } from "@/utils/stringUtils";
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import AssociatedRecordsSummary from "@/components/Records/Search/Output/AssociatedRecordsSummary";
import SearchLinkChips from "@/components/Records/Search/Output/SearchLinkChips";
export default {
  name: "RecordsCardStack",
  components: {SearchLinkChips, AssociatedRecordsSummary, RecordStatus},
  mixins: [recordsCardUtils, truncate],
  props: {
    record: {default: null, type: Object},
  },
  data() {
    return {
      allowClicking: false,
      chips: [],
      currentActiveChips: null,
    }
  },
  created() {
    this.setChips(this.record);
  },
  methods: {
    associatedRecords(record) {
      let records = {
        registryNumber: {
          standard: {
            val: 0,
            label: "standards"
          },
          database: {
            val: 0,
            label: "databases"
          },
          policy: {
            val: 0,
            label: "policies"
          },
        },
        registry: null
      };
      records['registry'] = record.registry.toLowerCase()
      record['recordAssociations'].forEach(function (association) {
        if (association['linkedRecord'].registry.toLowerCase() !== 'collection' ) {
          records['registryNumber'][association['linkedRecord'].registry.toLowerCase()].val += 1
        }
      });
      record['reverseRecordAssociations'].forEach(function (association) {
        if (association['fairsharingRecord'].registry.toLowerCase() !== 'collection' ) {
          records['registryNumber'][association['fairsharingRecord'].registry.toLowerCase()].val += 1
        }
      });
      return records;
    },
    setChips(record) {
      let _module = this;
      const order = ['subjects', 'domains', 'taxonomies']
      order.forEach(node => {
        _module.organizeChips(record, node, 2);
      })
    },
    organizeChips(record, node, max_item_shown) {
      const _module = this;
      if (record[node]) {
        record[node].forEach(function (item, index) {
          if (index < max_item_shown) {
            item.type = node;
            _module.chips.push(item);
          }
        });
      }
    }
  }
}
</script>

<style scoped lang="scss">
.v-chip.v-chip--outlined.v-chip--active::before {
  opacity: 0;
}
</style>
