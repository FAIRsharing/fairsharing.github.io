<template>
  <v-container>
    <v-row class="block-category">
      <v-col cols="12" lg="4" md="4" sm="12">
        <v-card
          class="mx-auto block-category__card"
          height="500"
          max-width="350"
        >
          <div
            class="text-white d-flex flex-column justify-center block-category__card__gradiant"
          >
            <div class="d-flex justify-center" style="height: 136px">
              <v-img
                :src="customIcons.values['home_standard'].icon"
                class="mt-5 contain"
                height="100px"
              />
            </div>
            <v-card-title class="d-inline text-h4 text-md-h5 text-lg-h4">
              <span>
                {{ populatedBlockInfo.standard.total.count }}
              </span>
              Standards
            </v-card-title>
          </div>
          <v-card-text
            v-if="populatedBlockInfo.standard.items.length < 5"
            class="text--primary text-justify height-190"
          >
            <router-link
              v-for="(item, index) in populatedBlockInfo.standard.items"
              :key="item.title + '_' + index"
              :to="item.searchQuery"
              class="underline-effect"
            >
              <div class="d-flex">
                <strong class="flex-grow-1">{{ item.title }}</strong>
                <span>{{ item.count }}</span>
              </div>
              <v-divider opacity="0.9" />
            </router-link>
          </v-card-text>
          <v-card-actions class="text-center d-block viewAll">
            <router-link to="/search?fairsharingRegistry=Standard">
              <v-btn color="primary" variant="text"> View All </v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" md="4" sm="12">
        <v-card
          class="mx-auto block-category__card"
          height="500"
          max-width="350"
        >
          <div
            class="text-white d-flex flex-column justify-center block-category__card__gradiant"
          >
            <div class="d-flex justify-center" style="height: 136px">
              <v-img
                :src="customIcons.values['home_db'].icon"
                class="mt-5 contain"
                height="100px"
              />
            </div>
            <v-card-title class="d-inline text-h4 text-md-h5 text-lg-h4">
              <span>{{ populatedBlockInfo.database.total.count }}</span>
              Databases
            </v-card-title>
          </div>
          <v-card-text
            v-if="populatedBlockInfo.database.items.length < 5"
            class="text--primary text-justify height-190"
          >
            <router-link
              v-for="(item, index) in populatedBlockInfo.database.items"
              :key="item.title + '_' + index"
              :to="item.searchQuery"
              class="underline-effect"
            >
              <div class="d-flex">
                <strong class="flex-grow-1">{{ item.title }}</strong>
                <span>{{ item.count }}</span>
              </div>
              <v-divider opacity="0.9" />
            </router-link>
          </v-card-text>
          <v-card-actions class="text-center d-block viewAll">
            <router-link to="/search?fairsharingRegistry=Database">
              <v-btn color="primary" variant="text"> View All </v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="4" md="4" sm="12">
        <v-card
          class="mx-auto block-category__card"
          height="500"
          max-width="350"
        >
          <div
            class="text-white d-flex flex-column justify-center block-category__card__gradiant"
          >
            <div class="d-flex justify-center" style="height: 136px">
              <v-img
                :src="customIcons.values['home_policies'].icon"
                class="mt-5"
                height="100px"
              />
            </div>
            <v-card-title class="d-inline text-h4 text-md-h5 text-lg-h4">
              <span>{{ populatedBlockInfo.policy.total.count }}</span>
              Policies
            </v-card-title>
          </div>
          <v-card-text
            v-if="populatedBlockInfo.policy.items.length < 7"
            class="text--primary text-justify height-195"
          >
            <router-link
              v-for="(item, index) in populatedBlockInfo.policy.items"
              :key="item.title + '_' + index"
              :to="item.searchQuery"
              class="underline-effect"
            >
              <div class="d-flex">
                <strong class="flex-grow-1">{{ item.title }}</strong>
                <span>{{ item.count }}</span>
              </div>
              <v-divider opacity="0.9" />
            </router-link>
          </v-card-text>
          <v-card-actions class="text-center d-block viewAll">
            <router-link to="/search?fairsharingRegistry=Policy">
              <v-btn color="primary" variant="text"> View All </v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

import homePageData from "@/data/homePageData.json";
import { truncate } from "@/utils/stringUtils";
import customIcons from "@/plugins/icons";

export default {
  name: "InfoBlock",
  mixins: [truncate],
  data: () => {
    return {
      customIcons: customIcons,
    };
  },
  computed: {
    ...mapGetters("searchFilters", ["getFiltersStatisticCount"]),

    populatedBlockInfo() {
      // 1. Create a fresh copy of the JSON so we don't accidentally mutate the source file
      const result = JSON.parse(JSON.stringify(homePageData.blockInfo));

      // 2. Loop through Standards, Databases, Policies
      Object.keys(result).forEach((node) => {
        // Reactively grab the total count (fallback to 0 if loading)
        result[node].total.count =
          this.getFiltersStatisticCount(result[node].total.option) || 0;

        // Reactively grab the individual item counts
        result[node].items.forEach((item) => {
          item.count = this.getFiltersStatisticCount(item.option) || 0;
        });

        // Sort items by count
        result[node].items.sort((a, b) => b.count - a.count);
      });

      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
.block-category {
  &__card {
    transition: all 0.2ms ease;
    -webkit-transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -o-transition: all 0.2s ease;
    box-shadow: 0 1rem 2rem rgba(black, 0.15) !important;
    -webkit-box-shadow: 0 1rem 2rem rgba(black, 0.15) !important;
    -moz-box-shadow: 0 1rem 2rem rgba(black, 0.15) !important;
    -o-box-shadow: 0 1rem 2rem rgba(black, 0.15) !important;

    &:hover {
      transform: scale(1.05);
      -moz-transform: scale(1.05);
      -webkit-transform: scale(1.05);
      -o-transform: scale(1.05);
    }

    &__gradiant {
      height: 200px;
      background: rgb(171, 171, 171);
    }
  }
}
.v-divider {
  margin: 8px;
}
.viewAll {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
}
</style>
