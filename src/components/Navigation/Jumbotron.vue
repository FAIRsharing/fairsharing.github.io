<template>
  <section
    v-if="getJumbotronData"
    class="px-md-10 pa-5 d-flex flex-column justify-center heroBlock"
    :style="['z-index: 2', {
      backgroundImage: 'linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 200%),url(' + '/assets/Home/BlockHero/pattern3.jpg',
      backgroundRepeat: 'repeat',
      backgroundBlendMode: 'multiply',
    }]"
  >
    <!-- eslint-disable vue/no-v-html -->
    <vue-particles
      id="particles"
      :particles-loaded="particlesLoaded"
      :options="options"
      :class="{'largeScreen': $vuetify.display.xlOnly}"
    />
    <h1
      class="text-center text-body-1 text-sm-h6 pt-2 text-md-h6 text-lg-h4 text-xl-h4 font-weight-medium text-white"
      style="z-index: 2"
    >
      {{ getJumbotronData.title }}
    </h1>
    <p
      id="subtitle"
      :class="[
        'lato-font-medium my-4 primary--text px-1 text-center',
        {
          'lato-text-md': $vuetify.display.mdOnly,
          'lato-text-lg': $vuetify.display.lgAndUp,
          'lato-text-sm': $vuetify.display.smAndDown
        }
      ]"
      v-html="$sanitize(getJumbotronData.subtitle)"
    />
    <!-- eslint-enable vue/no-v-html -->
  </section>
</template>

<script>
import { loadFull } from "tsparticles";

import jumbotronData from "@/data/jumbotronData.json";

// These consts appear to be called by the tests but aren't shown as covered.
/* istanbul ignore next */
const particlesInit = async engine => {
  await loadFull(engine);
};

/* istanbul ignore next */
// eslint-disable-next-line no-unused-vars
const particlesLoaded = async container => {
  //console.log("Particles container loaded", container);
};

export default {
  name: "Jumbotron",
  data:() => {
    return {
      particlesInit,
      particlesLoaded,
      options: {
        background: {
          color: {
            value: 'transparent'
          }
        },
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          color: {
            value: '#1F8EBF'
          },
          links: {
            color: '#1F8EBF',
            distance: 100,
            enable: true,
            opacity: 0.5,
            width: 2
          },
          collisions: {
            enable: true
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: 'bounce',
            random: false,
            speed: 1,
            straight: false
          },
          number: {
            density: {
              enable: true,
              value_area: 300
            },
            value: 50
          },
          opacity: {
            value: 0.5
          },
          shape: {
            type: null
          },
          size: {
            random: true,
            value: 5
          }
        },
        detectRetina: true
      },
      jumbotronData
    }
  },
  computed: {
    getJumbotronData(){
      if (this.$route.name) {
        let route = this.$route.name;
        if (route === "search" && Object.keys(this.$route.query).includes("fairsharingRegistry")) {
          route = this.$route.query.fairsharingRegistry
        }
        return jumbotronData[route.toLowerCase()] || null
      }
      return null
    }
  }
}
</script>

<style scoped>
section {
  height: 250px;
}
</style>

<style>
  #particles canvas{
    position: absolute;
    width: 100% !important;
    height: 250px !important;
    max-height: 250px !important;
    z-index: 1;
    left:0;
    top:150px;
  }

  #particles.largeScreen canvas{
    top:170px;
  }

  #subtitle a {
    color: white;
    text-decoration: underline;
  }

</style>
