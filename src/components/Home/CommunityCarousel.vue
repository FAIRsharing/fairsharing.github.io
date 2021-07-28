<template>
  <div class="d-flex flex-column align-center">
    <p class="lato-text-lg ma-0 text-body">
      Our Community of Adopters and Collaborators
    </p>
    <v-container>
      <v-carousel
        v-model="model"
        cycle
        height="300"
        hide-delimiter-background
      >
        <v-carousel-item
          v-for="(logo, index) in logos"
          :key="logo.image+'_'+index"
        >
          <v-sheet
            color="white"
            height="100%"
          >
            <v-row
              class="fill-height"
              align="center"
              justify="center"
            >
              <v-img
                contain
                :src="logo.image"
                width="100"
                height="100"
                style="filter: grayscale(1);"
              />
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
      <v-btn
        color="primary"
        to="/communities"
      >
        View All
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import {blockLogos} from '@/data/homePageData.json'
export default {
  name: "CommunityCarousel",
  data: () => ({
    model: 0,
    logos: blockLogos
  })
}
</script>

<style scoped>

</style>
