<template>
  <!--Column List-->
  <v-col
    class="mt-1"
    cols="12"
    sm="12"
    md="6"
    lg="4"
    xl="3"
  >
    <v-card
      class="pa-2 d-flex  align-center flex-column"
      outlined
      tile
      :hover="allowClicking"
    >
      <!-- Title and Icon -->
      <v-row
        no-gutters
        class="full-width"
      >
        <v-col
          cols="12"
          @mouseenter="allowClicking=true"
          @mouseleave="allowClicking=false"
        >
          <router-link :to="'/' + getRecordLink(record)">
            <div class=" d-flex flex-column align-center justify-center">
              <record-status
                :record="record"
                class="mr-8"
              />
              <h3 class="title-style">
                <u>{{ record.name }}</u>
                <span
                  v-if="record.abbreviation"
                  class="ml-2"
                > ({{ truncate(record.abbreviation, 15) }}) </span>
              </h3>
            </div>
          </router-link>
        </v-col>
      </v-row>
      <!--Chips-->
      <v-row
        no-gutters
        class="chips-container-margin"
      >
        <v-col cols="12">
          <!-- chips container -->
          <SearchLinkChips
            :chips="chips"
            class="ml-10"
            :remain-tag-count="remainTagCount"
          />
        </v-col>
      </v-row>
      <!--       Description -->
      <div
        class="d-flex flex-row"
        style="width: 70%"
      >
        <v-divider
          class="mt-2"
        />
      </div>
      <p class="ma-2 card-description text-justify">
        {{ record.description }}
      </p>
      <!--  Associated Records Summary  -->
      <associated-records-summary :associated-records="associatedRecords(record)" />
    </v-card>
  </v-col>
</template>

<script>
import RecordStatus from "@/components/Records/Shared/RecordStatus"
import SearchLinkChips from "@/components/Records/Search/Output/SearchLinkChips";
import recordsCardUtils from "@/utils/recordsCardUtils";
import { truncate } from "@/utils/stringUtils";
import AssociatedRecordsSummary from "@/components/Records/Search/Output/AssociatedRecordsSummary";

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
        maxItemShown = 2;
      }
      else if (this.$vuetify.breakpoint.xlOnly) {
        maxItemShown = 3;
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

<style scoped>
.title-style {
  height: 55px;
  text-align: center;
}

.chips-container-margin {
  margin-right: 10%;
  margin-left: 10%;
}

.chips-container {
  height: 110px;
  overflow-x: hidden;
  scroll-behavior: smooth;
  position: relative;
}

.v-chip.v-chip--outlined.v-chip--active::before {
  opacity: 0;
}
</style>
