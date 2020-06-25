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
        <Ribbon
          v-if="record.isRecommended"
          title="RECOMMENDED"
        />
        <v-col
          cols="12"
          @mouseenter="allowClicking=true"
          @mouseleave="allowClicking=false"
        >
          <router-link :to="'/' +record.id">
            <div class=" d-flex flex-column align-center justify-center">
              <record-status
                :record="record"
                class="mr-8"
              />
              <h3 class="title-style">
                <u>{{ record.name }}</u>
              </h3>
            </div>
          </router-link>
        </v-col>
      </v-row>
      <!-- Buttons -->
      <v-row>
        <v-col>
          <section class="ml-2 mb-0 mr-4 d-flex flex-column">
            <h4 class="d-none">
              select Tag type
            </h4>
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
              {{ item.title }} ({{ Chips[item.title].length }})
            </v-btn>
          </section>
        </v-col>
      </v-row>
      <!--Chips-->
      <v-row
        no-gutters
        class="chips-container-margin"
      >
        <v-col cols="12">
          <section class="chips-container">
            <h5 class="d-none">
              Choose Subject , Domain , Taxonomy
            </h5>
            <i
              v-if="Chips[currentActiveChips].length===0"
              class="warning"
            >No chips for {{ currentActiveChips }}!</i>
            <v-chip-group
              column
            >
              <v-chip
                v-for="chip in Chips[currentActiveChips]"
                :key="chip.label+'_'+chip.active"
                small
                text-color="secondary"
                color="secondary"
                :close="chip.active"
                outlined
                @click="toggleChipActiveness(chip)"
              >
                {{ chip.label }}
              </v-chip>
            </v-chip-group>
          </section>
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
      <!--  Associated Records      -->
      <AssociatedRecordsStack
        :associated-records="associatedRecords(record)"
        :is-column="true"
      />
    </v-card>
  </v-col>
</template>

<script>
    import Ribbon from "../IndividualComponents/Ribbon";
    import RecordStatus from "../IndividualComponents/RecordStatus";
    import AssociatedRecordsStack from "./AssociatedRecordsStack";

    export default {
        name: "RecordsCardColumn",
        components: {AssociatedRecordsStack, RecordStatus, Ribbon},
        props: {
            record: {default: null, type: Object},
        },
        data() {
            return {
                allowClicking: false,
                buttons: [{title: 'subjects', active: false}, {title: 'domains', active: true}, {
                    title: 'taxonomies',
                    active: false,
                }],
                Chips: {
                    subjects: [], domains: [], taxonomies: [],
                },
                currentActiveChips: 'domains',
                vChipActive: 'v-chip--active'
            }
        },
        created() {
            this.setChips(this.record);
        },
        methods: {
            changeActiveItem: function (itemIndex) {
                this.buttons.map(item => item.active = false);
                this.buttons[itemIndex].active = true;
                // changing currentChips data
                this.currentActiveChips = this.buttons[itemIndex].title;
            },
            toggleChipActiveness: function (chip) {
                let selectedItem = this.Chips[this.currentActiveChips].find(item => item === chip);
                this.Chips[this.currentActiveChips].map(item => {
                    if (item === selectedItem) {
                        item.active = !item.active;
                        //    should call scroll to top after a delay.
                        setTimeout(this.scrollToTop, 500);
                        //    should call Api for the selected chip to be added in chips list.
                    }
                });
            },
            associatedRecords: function (record) {
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
                    records[association['linkedRecord'].registry].val += 1
                });
                record['reverseRecordAssociations'].forEach(function (association) {
                    records[association['fairsharingRecord'].registry].val += 1
                });
                return records;
            },
            setChips: function (record) {
                let counter = 0;
                record.subjects.forEach(item => {
                    if (counter < 3) {
                        this.Chips.subjects.push({label: item.label, active: false});
                    }
                    counter++;
                })
                record.domains.forEach(item => {
                    if (counter < 3) {
                        this.Chips.domains.push({label: item.label, active: false});
                    }
                    counter++;
                })
                record.taxonomies.forEach(item => {
                    if (counter < 3) {
                        this.Chips.taxonomies.push({label: item.label, active: false});
                    }
                    counter++;
                })
            },
            scrollToTop: function () {
                let myDiv = document.getElementById('scroll-target');
                myDiv.scrollTo(0, 0);
            }
        },
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
