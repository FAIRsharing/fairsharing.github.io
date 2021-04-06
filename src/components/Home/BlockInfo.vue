<template>
  <v-container>
    <v-row class="block-category">
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
      >
        <v-card
          class="mx-auto block-category__card"
          max-width="350"
          height="500"
        >
          <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
            <div
              style="height: 136px"
              class="d-flex justify-center"
            >
              <v-img
                contain
                height="130px"
                style="opacity: .7"
                :src="$vuetify.icons.values['home_standard'].icon"
              />
            </div>
            <v-card-title class="d-inline">
              <span>
                {{ getFiltersStatisticCount("fairsharing_registry","standard") }}
              </span>
              Standards
            </v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-250">
            <div class="d-flex">
              <strong class="flex-grow-1">Terminology Artifact</strong>
              <span>22</span>
            </div>
            <v-divider />
            <div class="d-flex">
              <strong class="flex-grow-1">Terminology Artifact</strong>
              <span>112</span>
            </div>
            <v-divider />
            <div class="d-flex">
              <strong class="flex-grow-1">Terminology Artifact</strong>
              <span>112</span>
            </div>
            <v-divider />
            <div class="d-flex">
              <strong class="flex-grow-1">Terminology Artifact</strong>
              <span>112</span>
            </div>
            <v-divider />
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
            >
              View All
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
      >
        <v-card
          class="mx-auto block-category__card"
          max-width="350"
          height="500px"
        >
          <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
            <div
              style="height: 136px"
              class="d-flex justify-center"
            >
              <v-img
                contain
                height="130px"
                style="opacity: .7"
                :src="$vuetify.icons.values['home_db'].icon"
              />
            </div>
            <v-card-title class="d-inline">
              <span>
                {{ getFiltersStatisticCount("fairsharing_registry","database") }}
              </span>
              Databases
            </v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-250">
            text
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
            >
              View All
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
      >
        <v-card
          class="mx-auto block-category__card"
          max-width="350"
          height="500px"
        >
          <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
            <div
              style="height: 136px"
              class="d-flex justify-center"
            >
              <v-img
                contain
                height="130px"
                style="opacity: .7"
                :src="$vuetify.icons.values['home_policies'].icon"
              />
            </div>
            <v-card-title class="d-inline">
              <span>
                {{ getFiltersStatisticCount("fairsharing_registry","policy") }}
              </span>
              Policies
            </v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-250">
            text
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
            >
              View All
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {truncate} from "@/utils/stringUtils";
import {mapGetters} from "vuex";

export default {
name: "BlockInfo",
  mixins: [ truncate ],
  computed: {
    ...mapGetters("searchFilters",["getFiltersStatisticCount"])
  }
}
</script>

<style scoped lang="scss">
.block-category {
  &__card {
    transition: all .2ms ease;
    -webkit-transition: all .2s ease;
    -moz-transition: all .2s ease;
    -o-transition: all .2s ease;
    box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -webkit-box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -moz-box-shadow: 0 1rem 2rem rgba(black, .15) !important;
    -o-box-shadow: 0 1rem 2rem rgba(black, .15) !important;

    &:hover {
      transform: scale(1.05);
      -moz-transform: scale(1.05);
      -webkit-transform: scale(1.05);
      -o-transform: scale(1.05);
    }

    &__gradiant {
      height: 200px;
      background: rgb(171, 171, 171);
      background: linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(80, 80, 80) 100%);
      background: -webkit-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(80, 80, 80) 100%);
      background: -o-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(80, 80, 80) 100%);
      background: -ms-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(80, 80, 80) 100%);
    }
  }
}
.v-divider {
  margin: 8px;
}
</style>
