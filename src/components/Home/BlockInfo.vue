<template>
  <v-container>
    <v-row
      class="block-category"
    >
      <v-col
        cols="12"
        sm="12"
        md="4"
        lg="4"
      >
        <v-card
          class="mx-auto block-category__card"
          max-width="350"
          height="450"
        >
          <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
            <div
              style="height: 136px"
              class="d-flex justify-center"
            >
              <v-img
                contain
                height="130px"
                :src="$vuetify.icons.values['home_standard'].icon"
              />
            </div>
            <v-card-title class="d-inline text-h4 text-md-h5 text-lg-h4">
              <span>
                {{ blockInfo.standard.total.count }}
              </span>
              Standards
            </v-card-title>
          </div>
          <v-card-text
            v-if="blockInfo.standard.items.length<5"
            class="text--primary text-justify"
          >
            <router-link
              v-for="(item,index) in blockInfo.standard.items"
              :key="item.title + '_' + index"
              :to="item.searchQuery"
              class="underline-effect"
            >
              <div
                class="d-flex"
              >
                <strong class="flex-grow-1">{{ item.title }}</strong>
                <span>{{ item.count }}</span>
              </div>
              <v-divider />
            </router-link>
          </v-card-text>
          <v-card-actions class="text-center d-block">
            <router-link to="/search?fairsharingRegistry=Standard">
              <v-btn
                color="primary"
                text
              >
                View All
              </v-btn>
            </router-link>
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
          height="450"
        >
          <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
            <div
              style="height: 136px"
              class="d-flex justify-center"
            >
              <v-img
                class="mt-5"
                contain
                height="100px"
                :src="$vuetify.icons.values['home_db'].icon"
              />
            </div>
            <v-card-title class="d-inline text-h4 text-md-h5 text-lg-h4">
              <span>{{ blockInfo.database.total.count }}</span>
              Databases
            </v-card-title>
          </div>
          <v-card-text
            v-if="blockInfo.database.items.length<5"
            class="text--primary text-justify"
          >
            <router-link
              v-for="(item,index) in blockInfo.database.items"
              :key="item.title + '_' + index"
              :to="item.searchQuery"
              class="underline-effect"
            >
              <div
                class="d-flex"
              >
                <strong class="flex-grow-1">{{ item.title }}</strong>
                <span>{{ item.count }}</span>
              </div>
              <v-divider />
            </router-link>
          </v-card-text>
          <v-card-actions class="text-center d-block">
            <router-link to="/search?fairsharingRegistry=Database">
              <v-btn
                color="primary"
                text
              >
                View All
              </v-btn>
            </router-link>
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
          height="450"
        >
          <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
            <div
              style="height: 136px"
              class="d-flex justify-center"
            >
              <v-img
                contain
                height="130px"
                :src="$vuetify.icons.values['home_policies'].icon"
              />
            </div>
            <v-card-title class="d-inline text-h4 text-md-h5 text-lg-h4">
              <span>{{ blockInfo.policy.total.count }}</span>
              Policies
            </v-card-title>
          </div>
          <v-card-text
            v-if="blockInfo.policy.items.length<5"
            class="text--primary text-justify height-190"
          >
            <router-link
              v-for="(item,index) in blockInfo.policy.items"
              :key="item.title + '_' + index"
              :to="item.searchQuery"
              class="underline-effect"
            >
              <div
                class="d-flex"
              >
                <strong class="flex-grow-1">{{ item.title }}</strong>
                <span>{{ item.count }}</span>
              </div>
              <v-divider />
            </router-link>
          </v-card-text>
          <v-card-actions class="text-center d-block">
            <router-link to="/search?fairsharingRegistry=Policy">
              <v-btn
                color="primary"
                text
              >
                View All
              </v-btn>
            </router-link>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {truncate} from "@/utils/stringUtils";
import {mapGetters} from "vuex";
import {blockInfo} from "@/data/homePageData.json"
export default {
  name: "BlockInfo",
  mixins: [truncate],
  data: () => {
    return {
      blockInfo: blockInfo
    }
  },
  computed: {
    ...mapGetters("searchFilters", ["getFiltersStatisticCount"])
  },
  mounted() {
    Object.keys(this.blockInfo).forEach(node => {
      this.blockInfo[node].total.count = this.getFiltersStatisticCount(this.blockInfo[node].total.option);
      this.blockInfo[node]['items'].forEach((item, index) => {
        this.blockInfo[node]['items'][index].count = this.getFiltersStatisticCount(item.option);
      })
      this.blockInfo[node]['items'].sort(function (a, b) {
        return b.count - a.count
      });
    });
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
      background: linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
      background: -webkit-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
      background: -o-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
      background: -ms-linear-gradient(50deg, rgb(204, 204, 204) 0%, rgb(135, 135, 135) 100%);
    }
  }
}
.v-divider {
  margin: 8px;
}
</style>
