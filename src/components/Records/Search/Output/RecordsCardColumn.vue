<template>
  <!--Column List-->
  <v-col
    class="mt-1"
    cols="12"
    sm="12"
    md="6"
    lg="6"
    xl="4"
  >
    <router-link :to="'/' + getRecordLink(record)">
      <v-card
        v-ripple
        class="pa-6 d-flex flex-column"
        outlined
        tile
        height="525px"
        :elevation="allowClicking?'5':'1'"
        @mouseenter="allowClicking=true"
        @mouseleave="allowClicking=false"
      >
        <!-- Title and Icon -->
        <div>
          <record-status
            :record="record"
            class="mr-8"
          />
          <h3 :class="['mt-2 mb-4 text-sm-h5 text-md-h6 text-body-2 text-h6 text-lg-h6 text-xl-h5 primary--text height-90 text-ellipses-height-3lines',{'overflow-hidden':$vuetify.breakpoint.mdAndDown}]">
            {{ record.name }}
          </h3>
          <!--       Description -->
          <div class="height-75">
            <p class="mt-2 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height-3lines">
              {{ record.description }}
            </p>
          </div>
          <!-- chips container -->
          <div class="height-75">
            <SearchLinkChips
              :is-column="true"
              :chips="chips"
              :remain-tag-count="remainTagCount"
            />
          </div>
          <v-divider class="dashed-line" />
          <!--  Associated Records Summary  -->
          <associated-records-summary
            :associated-records="associatedRecords(record)"
            class="ml-5"
          />
        </div>
      </v-card>
    </router-link>
  </v-col>
</template>

<script>
import RecordStatus from "@/components/Records/Shared/RecordStatus"
import recordsCardUtils from "@/utils/recordsCardUtils";
import { truncate } from "@/utils/stringUtils";
import AssociatedRecordsSummary from "@/components/Records/Search/Output/AssociatedRecordsSummary";
import SearchLinkChips from "@/components/Records/Search/Output/SearchLinkChips";

export default {
  name: "RecordsCardColumn",
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
      remainTagCount: 0
    }
  },
  computed:{
    getMaxItemShown() {
      let maxItemShown;
      if (this.$vuetify.breakpoint.mdAndDown) {
        maxItemShown = 1;
      }
      else if (this.$vuetify.breakpoint.lgOnly) {
        maxItemShown = 1;
      }
      else if (this.$vuetify.breakpoint.xlOnly) {
        maxItemShown = 1;
      }
      return maxItemShown
    }
  },
  watch: {
    getMaxItemShown: function () {
      this.setChips(this.record);
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
      const _module = this;
      const order = ['subjects', 'domains', 'taxonomies']
      _module.remainTagCount = 0
      _module.chips = [];
      order.forEach(node => {
        record[node].remainTagCount = 0
        _module.organizeChips(record, node, _module.getMaxItemShown);
      });
      for (let i = 0; i < order.length; i++) {
        _module.remainTagCount += record[order[i]].remainTagCount
      }
    },
    organizeChips(record, node, max_item_shown) {
      const _module = this;
      if (record[node]) {
        record[node].forEach(function (item, index) {
          if (index < max_item_shown) {
            item.type = node;
            _module.chips.push(item);
          } else {
            record[node].remainTagCount++;
          }
        });
      }
      else {
        return false;
      }
    }
  }
}
</script>
