<template>
  <!--Stack List-->
  <router-link :to="'/' + getRecordLink(record)">
    <section class="ma-2 ma-md-2 ma-lg-1 pt-lg-4 cursor-pointer">
      <v-card
        v-ripple
        class="pl-8 pr-8 pt-8 pb-8 d-flex flex-column"
        outlined
        tile
        height="350px"
        :elevation="allowClicking?'4':'0'"
        @mouseenter="allowClicking=true"
        @mouseleave="allowClicking=false"
      >
        <h2 class="text-body-2 text-md-body-1 text-lg-h6 text-xl-h5">
          {{ record.abbreviation }}
        </h2>
        <v-row no-gutters class="flex-grow-0">
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
            <h3 class="mt-5 ml-10 text-sm-h6 text-body-2 text-md-h6 text-lg-h5 text-xl-h4 primary--text">
              {{ record.name }}
            </h3>
            <p class="mt-2 ml-10 text-sm-body-2 text-md-body-1 text-justify text-ellipses-height">
              {{ record.description }}
            </p>
          </v-col>
          <v-divider class="mx-25-percent dashed-line" />
        </v-row>
      </v-card>
    </section>
  </router-link>
</template>

<script>
import recordsCardUtils from "@/utils/recordsCardUtils";
import { truncate } from "@/utils/stringUtils";
import RecordStatus from "@/components/Records/Shared/RecordStatus";


export default {
  name: "RecordsCardStack",
  components: {RecordStatus},
  mixins: [recordsCardUtils, truncate],
  props: {
    record: {default: null, type: Object},
  },
  data() {
    return {
      allowClicking: false,
      Chips: {
        domains: [],
        subjects: [],
        taxonomies: [],
        userDefinedTags: []
      },
      currentActiveChips: null,
    }
  },
  created() {
    this.setChips(this.record);
  },
  methods: {
    associatedRecords(record) {
      let records = {
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
        collection: {
          val: 0,
          label: "collections"
        },
      };
      record['recordAssociations'].forEach(function (association) {
        records[association['linkedRecord'].registry.toLowerCase()].val += 1
      });
      record['reverseRecordAssociations'].forEach(function (association) {
        records[association['fairsharingRecord'].registry.toLowerCase()].val += 1
      });
      return records;
    },
    setChips(record) {
      let _module = this;
      Object.keys(record).forEach(function (node) {
        if (node === 'subjects' || node === 'domains' || node === 'taxonomies' || node === 'userDefinedTags') {
          _module.organizeChips(record, node);
        }
      });
    },
    organizeChips(record, node) {
      this.currentActiveChips = node;
      record[node].forEach(item => {
        this.Chips[node].push(item);
      })
    },
  },
}
</script>

<style scoped lang="scss">
.chips-container {
  height: 130px;
  overflow-x: hidden;
  scroll-behavior: smooth;
  position: relative;

  .no-chips {
    position: absolute;
    left: 20%;
    top: 30%;
  }
}

.v-chip.v-chip--outlined.v-chip--active::before {
  opacity: 0;
}
</style>
