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
          @click="gotoRecordPage"
        >
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
            </h3>
          </div>
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
              @click="changeActiveItem(index)"
            >
              {{ item.title }}
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
          <section class="chips-container ">
            <h5 class="d-none">
              Choose Subject , Domain , Taxonomy
            </h5>
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
      <p class="mt-2 card-description">
        {{ record.description }}
      </p>

      <!--  Associated Records      -->
      <AssociatedRecordsStack :associated-records="associatedRecords(record)" />
    </v-card>
  </section>
</template>

<script>
    import Ribbon from "@/components/IndividualComponents/Ribbon";
    import AssociatedRecordsStack from "./AssociatedRecordsStack";
    import RecordStatus from "@/components/IndividualComponents/RecordStatus"

    export default {
        name: "RecordsCardStack",
        components: {RecordStatus, AssociatedRecordsStack, Ribbon},
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
                vChipActive: 'v-chip--active',
                associatedRecordsArray: [{title: 'standards', amount: 10}, {title: 'databases', amount: 8}, {
                    title: 'policies',
                    amount: 2,
                }, {
                    title: 'collections',
                    amount: 6,
                }],
            }
        },
        created() {
            this.setChips(this.record);
        },
        methods: {
            gotoRecordPage: function () {
                this.$router.push({path: '/record'});
            },
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
                record.subjects.forEach(item => {
                    this.Chips.subjects.push({label: item.label, active: false});
                })
                record.domains.forEach(item => {
                    this.Chips.domains.push({label: item.label, active: false});
                })
                record.taxonomies.forEach(item => {
                    this.Chips.taxonomies.push({label: item.label, active: false});
                })
            },
            scrollToTop: function () {
                let myDiv = document.getElementById('scroll-target');
                myDiv.scrollTo(0, 0);
            }
        },
    }
</script>

<style scoped lang="scss">
    .chips-container {
        height: 90px;
        overflow-x: hidden;
        scroll-behavior: smooth;
    }

    .v-chip.v-chip--outlined.v-chip--active::before {
        opacity: 0;
    }

</style>