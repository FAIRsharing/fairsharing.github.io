<template>
  <!--Stack List-->

  <section class="pt-3 pt-lg-4">
    <v-card
      class="pl-2 pr-2 pt-2 d-flex  align-center flex-column"
      outlined
      tile
      :hover="allowClicking"
    >
      <v-row
        no-gutters
        class="full-width"
      >
        <Ribbon
          v-if="record.isRecommended"
          title="RECOMMENDED"
        />
        <v-col
          cols="12"
          xs="12"
          sm="12"
          lg="12"
          md="12"
          xl="3"
          @mouseenter="allowClicking=true"
          @mouseleave="allowClicking=false"
        >
          <router-link :to="'/' + getRecordLink(record)">
            <div class="mt-1 ml-2 pr-6 d-flex flex-row align-center justify-start">
              <record-status
                :record="record"
                class="mr-8"
              />
              <h3
                class="max-height "
                style="width: 60%"
              >
                <u>{{ record.name }}</u>
                <span
                  v-if="record.abbreviation"
                  class="ml-2"
                > ({{ truncate(record.abbreviation, 15) }}) </span>
              </h3>
            </div>
          </router-link>
        </v-col>
        <v-col
          cols="12"
          sm="4"
          md="3"
          lg="3"
          xs="12"
          xl="2"
          class="mt-2"
        >
          <section class="ml-2 mb-0 mr-4 d-flex flex-column">
            <v-btn
              v-for="(item,index) in buttons"
              :key="index"
              :outlined="item.active"
              text
              class="button-text-color"
              :color="item.active?'primary':null"
              :disabled="Chips[item.title].length === 0"
              @click="changeActiveItem(index)"
            >
              {{ getButtonLabel(item.title) }} ({{ Chips[item.title].length }})
            </v-btn>
          </section>
        </v-col>
        <v-col
          sm="8"
          md="9"
          lg="9"
          xs="12"
          xl="7"
        >
          <!-- chips container -->
          <SearchLinkChips
            :type="currentActiveChips"
            :chips="Chips[currentActiveChips]"
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
      <p class="mt-2 card-description">
        {{ record.description }}
      </p>

      <!--  Associated Records      -->
      <AssociatedRecordsStack :associated-records="associatedRecords(record)" />
    </v-card>
  </section>
</template>

<script>
import Ribbon from "@/components/Records/Shared/Ribbon";
import AssociatedRecordsStack from "./AssociatedRecordsStack";
import RecordStatus from "@/components/Records/Shared/RecordStatus"
import SearchLinkChips from "@/components/Records/Search/Output/SearchLinkChips";
import recordsCardUtils from "@/utils/recordsCardUtils";
import { truncate } from "@/utils/stringUtils";


export default {
  name: "RecordsCardStack",
  components: {RecordStatus, AssociatedRecordsStack, Ribbon, SearchLinkChips},
  mixins: [recordsCardUtils, truncate],
  props: {
    record: {default: null, type: Object},
  },
  data() {
    return {
      allowLoop: true,
      allowClicking: false,
      buttons: [
        {
          title: 'domains',
          active: false
        },
        {
          title: 'subjects',
          active: false
        },
        {
          title: 'taxonomies',
          active: false,
        },
        {
          title: 'userDefinedTags',
          active: false
        }
      ],
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
    changeActiveItem(itemIndex) {
      this.buttons.map(item => item.active = false);
      this.buttons[itemIndex].active = true;
      this.currentActiveChips = this.buttons[itemIndex].title;
    },
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
      this.organizeButtons(record, node);
      record[node].forEach(item => {
        item.active = false;
        this.Chips[node].push(item);
      })
    },
    organizeButtons(record, node) {
      if (record[node].length > 0 && this.allowLoop) {
        this.allowLoop = false;
        this.currentActiveChips = node;
        this.buttons.map(item => {
          if (item.title === node) {
            item.active = true
          }
        });
      }
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
