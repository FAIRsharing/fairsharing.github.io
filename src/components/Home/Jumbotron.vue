<template>
  <section
    class="px-md-10 pa-5 d-flex flex-column justify-center heroBlock"
    :style="{ backgroundImage: 'linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 200%),url(' + 'assets/Home/BlockHero/pattern3.jpg',backgroundRepeat:'repeat',backgroundBlendMode:'multiply'}"
  >
    <h1 class="text-body-1 text-sm-h6 pt-2 text-md-h6 text-lg-h4 text-xl-h4 font-weight-medium white--text">
      {{ jumbotron.title }}
    </h1>
    <h3
      :class="[
        'lato-font-medium my-4 primary--text px-1 font-weight-thin',
        {
          'lato-text-md': $vuetify.breakpoint.mdOnly,
          'lato-text-lg': $vuetify.breakpoint.lgAndUp,
          'lato-text-sm': $vuetify.breakpoint.smAndDown
        }
      ]"
    >
      {{ jumbotron.subTitle }}
    </h3>
  </section>
</template>

<script>

import {jumbotron} from '@/data/homePageData.json';

export default {
  name: "Jumbotron",
  data:() => {
    return {
      jumbotron:jumbotron
    }
  }
}
</script>

<style scoped>
section {
  height: 250px;
}
</style>
