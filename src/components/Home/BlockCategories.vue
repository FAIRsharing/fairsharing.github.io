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
        >
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>Recommended</v-card-title>
          </v-img>
          <v-card-text class="text--primary text-justify">
            Standards and/or databases recommended by journal or funder data policies.
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
        >
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>Recommended</v-card-title>
          </v-img>
          <v-card-text class="text--primary text-justify">
            Standards and/or databases recommended by journal or funder data policies.
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
        >
          <v-img
            class="white--text align-end"
            height="200px"
            src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
          >
            <v-card-title>Recommended</v-card-title>
          </v-img>
          <v-card-text class="text--primary text-justify">
            Standards and/or databases recommended by journal or funder data policies.
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
    </v-row>
  </v-container>
</template>

<script>
export default {
name: "BlockCategories"
}
</script>

<style scoped lang="scss">

.block-category {
  &__card {
    transition: all .2ms ease;
    -webkit-transition:all .2s ease;
    -moz-transition: all .2s ease;
    -o-transition: all .2s ease;
    box-shadow: 0 1rem 2rem rgba(black, .15)!important;
    -webkit-box-shadow: 0 1rem 2rem rgba(black, .15)!important;
    -moz-box-shadow: 0 1rem 2rem rgba(black, .15)!important;
    -o-box-shadow: 0 1rem 2rem rgba(black, .15)!important;
    &:hover {
      transform: scale(1.05);
      -moz-transform: scale(1.05);
      -webkit-transform: scale(1.05);
      -o-transform: scale(1.05);
    }
  }
}
</style>
