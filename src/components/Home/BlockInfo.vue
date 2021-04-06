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
          <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
            <div
              style="height: 136px"
              class="d-flex justify-center"
            >
              <v-icon
                size="80"
                color="white"
                style="opacity: .7"
              >
                {{ $vuetify.icons.values["recommended"].icon }}
              </v-icon>
            </div>
            <v-card-title class="d-inline">
              Standards
            </v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-90">
            {{ truncate('Standards and/or databases recommended by journal or funder data policies.',100) }}
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
          height="350px"
        >
          <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
            <v-img
              width="400"
              height="100"
              :src="$vuetify.icons.values['collections'].icon"
              contain
            />

            <v-card-title class="d-inline">
              Collections
            </v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-90">
            {{ truncate('Standards and/or databases grouped by domain, species or organization.',100) }}
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
          height="350px"
        >
          <div class="white--text d-flex flex-column justify-center block-category__card__gradiant">
            <div
              style="height: 136px"
              class="d-flex justify-center"
            >
              <v-icon
                size="90"
                color="white"
                style="opacity: .7"
              >
                {{ $vuetify.icons.values["educational"].icon }}
              </v-icon>
            </div>
            <v-card-title class="d-inline">
              Educational
            </v-card-title>
          </div>
          <v-card-text class="text--primary text-justify height-90">
            {{ truncate('About standards, their use in databases and policies, and how we can help you.',100) }}
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

export default {
name: "BlockInfo",
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

    &__gradiant {
      height: 200px;
      background: rgb(171, 171, 171);
      background: linear-gradient(180deg, rgb(171, 171, 171) 0%, rgb(80, 80, 80) 100%);
      background: -webkit-linear-gradient(180deg, rgb(171, 171, 171) 0%, rgb(80, 80, 80) 100%);
      background: -o-linear-gradient(180deg, rgb(171, 171, 171) 0%, rgb(80, 80, 80) 100%);
      background: -ms-linear-gradient(180deg, rgb(171, 171, 171) 0%, rgb(80, 80, 80) 100%);
    }
  }
}
</style>
