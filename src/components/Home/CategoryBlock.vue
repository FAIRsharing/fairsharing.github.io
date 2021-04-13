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
          height="350px"
        >
          <div
            :style="{ backgroundImage: 'linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgb(26, 110, 27) 100%),url(' + 'assets/Home/BlockHero/pattern3-1.jpg',backgroundSize:'300px',backgroundBlendMode:'lighten'}"
            class="white--text d-flex flex-column justify-center block-category__card__gradiant__2"
          >
            <div
              style="height: 136px"
              class="d-flex justify-center"
            >
              <v-icon
                size="80"
                color="white"
                style="opacity: .7"
              >
                {{ $vuetify.icons.values[blockCategories.firstColumn.icon].icon }}
              </v-icon>
            </div>
            <v-card-title class="d-inline">
              {{ blockCategories.firstColumn.title }}
            </v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-90">
            {{ truncate(blockCategories.firstColumn.description,100) }}
          </v-card-text>
          <v-card-actions class="text-center d-block">
            <router-link :to="blockCategories.firstColumn.link">
              <v-btn
                color="primary"
                text
              >
                {{ blockCategories.firstColumn.buttonTitle }}
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
          height="350px"
        >
          <div
            :style="{ backgroundImage: 'linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 150%),url(' + 'assets/Home/BlockHero/pattern3.jpg',backgroundSize:'300px',backgroundBlendMode:'lighten'}"
            class="white--text d-flex flex-column justify-center  block-category__card__gradiant__1"
          >
            <v-img
              width="400"
              height="100"
              :src="$vuetify.icons.values[blockCategories.secondColumn.icon].icon"
              contain
            />
            <v-card-title class="d-inline">
              {{ blockCategories.secondColumn.title }}
            </v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-90">
            {{ truncate(blockCategories.secondColumn.description,100) }}
          </v-card-text>
          <v-card-actions class="text-center d-block">
            <router-link :to="blockCategories.secondColumn.link">
              <v-btn
                color="primary"
                text
              >
                {{ blockCategories.secondColumn.buttonTitle }}
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
          height="350px"
        >
          <div
            :style="{ backgroundImage: 'linear-gradient(180deg, rgb(50, 12, 12) 100%, rgb(107, 30, 30) 150%),url(' + 'assets/Home/BlockHero/pattern3-2.jpg',backgroundBlendMode:'lighten', backgroundSize:'cover'}"
            class="white--text d-flex flex-column justify-center block-category__card__gradiant__3"
          >
            <div
              style="height: 136px"
              class="d-flex justify-center"
            >
              <v-icon
                size="90"
                color="white"
                style="opacity: .7"
              >
                {{ $vuetify.icons.values[blockCategories.thirdColumn.icon].icon }}
              </v-icon>
            </div>
            <v-card-title class="d-inline">
              Educational
            </v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-90">
            {{ truncate(blockCategories.thirdColumn.description,100) }}
          </v-card-text>
          <v-card-actions class="text-center d-block">
            <router-link :to="blockCategories.thirdColumn.link">
              <v-btn
                color="primary"
                text
              >
                {{ blockCategories.thirdColumn.buttonTitle }}
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
import {blockCategories} from "@/data/homePageData.json"
export default {
  name: "CategoryBlock",
  mixins: [ truncate ],
  data: () => {
    return {
      blockCategories: blockCategories
    }
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

    &__gradiant__1 {
      height: 200px;
      background: rgb(37, 52, 66);
      background: linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 100%);
      background: -webkit-linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 100%);
      background: -o-linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 100%);
      background: -ms-linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 100%);
    }

    &__gradiant__2 {
      height: 200px;
      background: rgb(37, 52, 66);
      background: linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgb(26, 110, 27) 100%);
      background: -webkit-linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgb(26, 110, 27) 100%);
      background: -o-linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgb(26, 110, 27) 100%);
      background: -ms-linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgb(26, 110, 27) 100%);
    }

    &__gradiant__3 {
      height: 200px;
      background: rgb(50, 12, 12);
      background: linear-gradient(180deg, rgb(50, 12, 12) 0%, rgb(107, 30, 30) 100%);
      background: -webkit-linear-gradient(180deg, rgb(50, 12, 12) 0%, rgb(107, 30, 30) 100%);
      background: -o-linear-gradient(180deg, rgb(50, 12, 12) 0%, rgb(107, 30, 30) 100%);
      background: -ms-linear-gradient(180deg, rgb(50, 12, 12) 0%, rgb(107, 30, 30) 100%);
    }
  }
}
</style>
