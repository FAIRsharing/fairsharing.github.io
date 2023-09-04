<template>
  <v-container>
    <v-row class="block-category justify-center">
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
            :style="{ backgroundImage: 'linear-gradient(90deg, #e67e22, #ea862d, #ed8e38, #f19642, #f59e4c, #f8a657, #fcad61, #ffb56b),url(' + 'assets/Home/BlockHero/pattern-orange.png',backgroundSize:'100%',backgroundBlendMode:'color'}"
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
                {{ $vuetify.icons.values[communityBlock.firstColumn.icon].icon }}
              </v-icon>
            </div>
            <v-card-title class="d-inline">
              {{ communityBlock.firstColumn.title }}
            </v-card-title>
          </div>
          <v-card-text class="text--primary height-75">
            {{ truncate(communityBlock.firstColumn.description,100) }}
          </v-card-text>
          <v-card-actions class="text-center d-block">
            <router-link :to="communityBlock.firstColumn.link">
              <v-btn
                color="primary"
                text
              >
                {{ communityBlock.firstColumn.buttonTitle }}
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
            :style="{ backgroundImage: 'linear-gradient(180deg, #7d7d7d, #868686, #8f8f8f, #989898, #a1a1a1, #aaaaaa, #b4b4b4, #bdbdbd),url(' + 'assets/Home/BlockHero/pattern-gray.png',backgroundSize:'300px',backgroundBlendMode:'lighten'}"
            class="white--text d-flex flex-column justify-center  block-category__card__gradiant__1"
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
                {{ $vuetify.icons.values[communityBlock.secondColumn.icon].icon }}
              </v-icon>
            </div>
            <v-card-title class="d-inline">
              {{ communityBlock.secondColumn.title }}
            </v-card-title>
          </div>
          <v-card-text class="text--primary height-75">
            {{ truncate(communityBlock.secondColumn.description,100) }}
          </v-card-text>
          <v-card-actions class="text-center d-block">
            <router-link :to="communityBlock.secondColumn.link">
              <v-btn
                color="primary"
                text
              >
                {{ communityBlock.secondColumn.buttonTitle }}
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
import {communityBlock} from "@/data/homePageData.json"
export default {
  name: "CommunityBlock",
  mixins: [ truncate ],
  data: () => {
    return {
        communityBlock: communityBlock
    }
  }
}
</script>

<style scoped lang="scss">
.block-category {
  &__card {
    border-radius: 200px;
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
  }
}
</style>
