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
            class="white--text d-flex align-end block-category__card__gradiant__1"
          >
            <v-card-title>Recommendations</v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-90">
            {{ truncate('Standards and/or databases recommended by journal or funder data policies.',100) }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
            >
              Find
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
          height="350px"
        >
          <div
            class="white--text d-flex align-end block-category__card__gradiant__2"
          >
            <v-card-title>Collections</v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-90">
            {{ truncate('Standards and/or databases grouped by domain, species or organization.',100) }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
            >
              Discover
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
          height="350px"
        >
          <div
            class="white--text d-flex align-end block-category__card__gradiant__3"
          >
            <v-card-title>Educational</v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-90">
            {{ truncate('About standards, their use in databases and policies, and how we can help you.',100) }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              text
            >
              Learn
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {truncate} from "@/utils/stringUtils";

export default {
name: "BlockCategories",
mixins: [ truncate ]
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
    }

    &__gradiant__2 {
      height: 200px;
      background: rgb(37, 52, 66);
      background: linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(26, 110, 27, 1) 100%);
    }

    &__gradiant__3 {
      height: 200px;
      background: rgb(50, 12, 12);
      background: linear-gradient(180deg, rgba(50, 12, 12, 1) 0%, rgba(107, 30, 30, 1) 100%);
    }
  }
}
</style>
