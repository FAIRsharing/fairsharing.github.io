<template>
  <!--Column List-->
  <v-col
    style="padding-top: 3px"
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
        height="600px"
        :elevation="allowClicking?'5':'1'"
        @mouseenter="allowClicking=true"
        @mouseleave="allowClicking=false"
      >
        <!-- Title and Icon -->
        <div>
          <abbreviation-tooltip :abbreviation="record.abbreviation" />
          <record-status
            :record="record"
            class="mr-8"
          />
          <h3
            :class="['mt-2 mb-4 text-sm-h5 text-md-h6 text-body-2 text-h6 text-lg-h6 text-xl-h5 primary--text height-90 text-ellipses-height-3lines',{'overflow-hidden':$vuetify.breakpoint.mdAndDown}]"
            :style="record.status === 'deprecated' ? 'text-decoration: line-through' : 'text-decoration: inherit'"
          >
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
            :associated-records="record.relatedRecordsCount"
            class="ml-5"
          />
        </div>
      </v-card>
    </router-link>
  </v-col>
</template>

<script>
import AssociatedRecordsSummary from "@/components/Records/Search/Output/AssociatedRecordsSummary";
import SearchLinkChips from "@/components/Records/Search/Output/SearchLinkChips";
import AbbreviationTooltip from "@/components/Records/Shared/AbbreviationTooltip";
import RecordStatus from "@/components/Records/Shared/RecordStatus"
import recordsCardUtils from "@/utils/recordsCardUtils";

export default {
  name: "RecordsCardColumn",
  components: {AbbreviationTooltip, SearchLinkChips, AssociatedRecordsSummary, RecordStatus},
  mixins: [recordsCardUtils],
  props: {
    record: {default: null, type: Object},
  },
  data() {
    return {
      allowClicking: false,
      chips: [],
      remainTagCount: 0
    }
  },
  computed:{
    getMaxItemShown() {
      return 1;
    }
  },
  created() {
    this.setChips(this.record);
  }
}
</script>
