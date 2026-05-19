<template>
  <section
    :style="{
      zIndex: 2,
      backgroundImage:
        'linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 200%), url(/assets/Home/BlockHero/pattern3.jpg)',
      backgroundRepeat: 'repeat',
      backgroundBlendMode: 'multiply',
    }"
    class="px-md-10 pa-5 d-flex flex-column justify-center heroBlock position-relative"
  >
    <vue-particles
      v-if="isMounted"
      id="particles"
      :class="{ largeScreen: xlOnly }"
      :options="options"
      :particles-loaded="particlesLoaded"
    />

    <h1
      class="text-center text-body-1 text-sm-h6 pt-2 text-md-h6 text-lg-h4 text-xl-h4 font-weight-medium text-white"
      style="z-index: 2"
    >
      {{ getJumbotronData ? getJumbotronData.title : "" }}
    </h1>

    <p
      id="subtitle"
      v-safe-html="getJumbotronData ? getJumbotronData.subtitle : ''"
      class="lato-font-medium my-4 text-primary px-1 text-center responsive-subtitle"
    />
  </section>
</template>

<script>
import {loadFull} from "tsparticles";
import jumbotronData from "@/data/jumbotronData.json";
import {useDisplay} from "vuetify";

const particlesInit = async (engine) => {
  await loadFull(engine);
};

const particlesLoaded = async (container) => {};

export default {
  name: "Jumbotron",
  setup() {
    // Bring in xlOnly safely via script composition
    const { xlOnly } = useDisplay();
    return { xlOnly };
  },
  data: () => {
    return {
      isMounted: false, // Prevents early animation executions
      particlesInit,
      particlesLoaded,
      options: {
        background: { color: { value: "transparent" } },
        fullScreen: { enable: false },
        fpsLimit: 60,
        particles: {
          color: { value: "#1F8EBF" },
          links: {
            color: "#1F8EBF",
            distance: 100,
            enable: true,
            opacity: 0.5,
            width: 2,
          },
          collisions: { enable: true },
          move: {
            direction: "none",
            enable: true,
            outModes: "bounce",
            random: false,
            speed: 1,
            straight: false,
          },
          number: { value: 50 },
          opacity: { value: 0.5 },
          shape: { type: null },
          size: { random: true, value: 5 },
        },
        detectRetina: true,
      },
      jumbotronData,
    };
  },
  computed: {
    getJumbotronData() {
      // Safe guard routing variables during server execution frames
      if (this.$route && this.$route.name) {
        let route = this.$route.name;
        if (
          route === "search" &&
          this.$route.query &&
          Object.keys(this.$route.query).includes("fairsharingRegistry")
        ) {
          route = this.$route.query.fairsharingRegistry;
        }
        return jumbotronData[route.toLowerCase()] || null;
      }
      // Return baseline home configuration if router is unhydrated
      return jumbotronData["home"] || null;
    },
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>

<style>
#particles canvas {
  position: absolute;
  width: 100% !important;
  height: 250px !important;
  max-height: 250px !important;
  z-index: 1;
  left: 0;
  top: 0;
}

#subtitle a {
  color: white;
  text-decoration: underline;
}

/* Refactored: Handle subtitle text scales fluidly using browser queries */
.responsive-subtitle {
  @media (max-width: 959px) {
    font-size: 0.875rem; /* lato-text-sm fallback */
  }
  @media (min-width: 960px) and (max-width: 1279px) {
    font-size: 1rem; /* lato-text-md fallback */
  }
  @media (min-width: 1280px) {
    font-size: 1.25rem; /* lato-text-lg fallback */
  }
}
</style>
