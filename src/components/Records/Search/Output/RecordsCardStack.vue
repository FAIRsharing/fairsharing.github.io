<template>
  <!--Stack List-->
  <router-link :to="'/' + getRecordLink(record)">
    <section class="mb-4 pt-lg-4 cursor-pointer">
      <v-card
        v-ripple
        class="pa-6 d-flex flex-column"
        outlined
        tile
        :height="$vuetify.breakpoint.smAndDown?'540px':'440px'"
        :elevation="allowClicking?'5':'1'"
        @mouseenter="allowClicking=true"
        @mouseleave="allowClicking=false"
      >
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
            class="d-flex align-center"
          >
            <div class="text-center">
              <h2
                style="max-width: 150px;"
                class="text-body-2 text-md-body-1 text-lg-h6 text-xl-h5 min-height-25"
              >
                {{ truncateString(record.abbreviation, 30) }}
              </h2>
              <RecordStatus
                :record="record"
                class="mt-4"
              />
            </div>
          </v-col>
          <v-col
            cols="12"
            xs="12"
            sm="10"
            md="10"
            lg="10"
            xl="11"
          >
            <h3
              :class="['mt-5 mb-4 ml-10 text-sm-h6 text-body-2 text-md-h6 text-lg-h5 text-xl-h4 primary--text height-90',{'overflow-hidden':$vuetify.breakpoint.mdAndDown}]"
              :style="record.status === 'deprecated' ? 'text-decoration: line-through' : 'text-decoration: inherit'"
            >
              {{ record.name }}
            </h3>
            <div class="height-50">
              <p class="mt-2 ml-10 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height-2lines">
                {{ record.description }}
              </p>
            </div>
            <!-- chips container -->
            <SearchLinkChips
              :chips="chips"
              class="ml-10"
              :remain-tag-count="remainTagCount"
            />
          </v-col>
        </v-row>
        <v-divider class="dashed-line" />
        <!--  Associated Records Summary  -->
        <associated-records-summary
          :associated-records="record.relatedRecordsCount"
          class="ml-5"
        />
      </v-card>
    </section>
  </router-link>
</template>

<script>

import AssociatedRecordsSummary from "@/components/Records/Search/Output/AssociatedRecordsSummary";
import SearchLinkChips from "@/components/Records/Search/Output/SearchLinkChips";
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import recordsCardUtils from "@/utils/recordsCardUtils";

export default {
  name: "RecordsCardStack",
  components: {SearchLinkChips, AssociatedRecordsSummary, RecordStatus},
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
  }
}
</script>

<style scoped lang="scss">
.v-chip.v-chip--outlined.v-chip--active::before {
  opacity: 0;
}
</style>
