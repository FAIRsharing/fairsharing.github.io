<template>
  <!--Stack List-->
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
        v-if="recommended"
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
          <circle-holder
            class="mr-8"
          />
          <h3
            class="max-height "
            style="width: 60%"
          >
            <u>Record title example</u>
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
              :key="chip.title"
              small
              text-color="secondary"
              color="secondary"
              :close="chip.active"
              outlined
              @click="toggleChipActiveness(chip)"
            >
              {{ chip.title }}
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
      {{ description }}
    </p>

    <!--  Associated Records      -->
    <AssociatedRecordsStack :associated-records="associatedRecords" />
  </v-card>
</template>

<script>
    import CircleHolder from "@/components/IndividualComponents/CircleHolder";
    import Ribbon from "@/components/IndividualComponents/Ribbon";
    import AssociatedRecordsStack from "./AssociatedRecordsStack";

    export default {
        name: "RecordsCardStack",
        components: {AssociatedRecordsStack, Ribbon, CircleHolder},
        props: {
            recommended: {default: false, type: Boolean},
        },
        data() {
            return {
                associatedRecords: [{title: 'standards', amount: 10}, {title: 'databases', amount: 8}, {
                    title: 'policies',
                    amount: 2,
                }, {
                    title: 'collections',
                    amount: 6,
                }],
                allowClicking: false,
                buttons: [{title: 'SUBJECTS', active: false}, {title: 'DOMAINS', active: true}, {
                    title: 'TAXONOMIES',
                    active: false,
                }],
                description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer ... ',
                Chips: {
                    SUBJECTS: [
                        {title: 'subject-Chip1', active: false}, {title: 'subject-Chip2', active: false},
                    ],
                    DOMAINS: [
                        {title: 'domain-Chip1', active: false}, {title: 'domain-Chip2', active: false},
                        {title: 'domain-Chip3', active: false}, {title: 'domain-Chip4', active: false},
                    ],
                    TAXONOMIES: [
                        {title: 'taxonomies-Chip1', active: false}, {title: 'taxonomies-Chip2', active: false},
                        {title: 'taxonomies-Chip3', active: false}, {title: 'taxonomies-Chip4', active: false},
                        {title: 'taxonomies-Chip5', active: false}, {title: 'taxonomies-Chip6', active: false},
                        {title: 'taxonomies-Chip7', active: false}, {title: 'taxonomies-Chip8', active: false},
                        {title: 'taxonomies-Chip9', active: false}, {title: 'taxonomies-Chip10', active: false},
                        {title: 'taxonomies-Chip11', active: false}, {title: 'taxonomies-Chip12', active: false},
                    ],
                },
                currentActiveChips: 'DOMAINS',
                vChipActive: 'v-chip--active'
            }
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
                        //    should call scroll to top from store.
                    }
                });
            },
        }
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