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
    <ClientOnly>
      <vue-particles
        id="particles"
        :class="{ largeScreen: xlOnly }"
        :options="options"
        :particles-loaded="particlesLoaded"
      />
    </ClientOnly>

    <h1
      class="text-center text-body-1 text-sm-h6 pt-2 text-md-h6 text-lg-h4 text-xl-h4 font-weight-medium text-white"
      style="z-index: 2"
    >
      {{ getJumbotronData.title }}
    </h1>

    <p
      id="subtitle"
      v-safe-html="getJumbotronData.subtitle"
      class="lato-font-medium my-4 text-primary px-1 text-center responsive-subtitle"
    />
  </section>
</template>

<script>
import { loadFull } from "tsparticles";
import jumbotronData from "@/data/jumbotronData.json";
import { useDisplay } from "vuetify";
import { ClientOnly } from "vike-vue/ClientOnly";

const particlesInit = async (engine) => {
  await loadFull(engine);
};

const particlesLoaded = async (container) => {};

export default {
  name: "Jumbotron",
  components: {
    ClientOnly,
  },
  setup() {
    const { xlOnly } = useDisplay();
    return { xlOnly };
  },
  data: () => {
    return {
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
      // Step 1: Check if route context is safely fully-loaded on the active frame
      if (this.$route && this.$route.name) {
        let route = this.$route.name;

        if (
          route === "search" &&
          this.$route.query &&
          Object.keys(this.$route.query).includes("fairsharingRegistry")
        ) {
          route = this.$route.query.fairsharingRegistry;
        }

        // Step 2: Ensure we look up valid keys, fallback to 'home' object instead of null
        const targetKey = route.toLowerCase();
        if (this.jumbotronData[targetKey]) {
          return this.jumbotronData[targetKey];
        }
      }

      // Absolute fallback state for Server Side execution maps
      return this.jumbotronData["home"] || { title: "", subtitle: "" };
    },
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

.responsive-subtitle {
  @media (max-width: 959px) {
    font-size: 0.875rem;
  }
  @media (min-width: 960px) and (max-width: 1279px) {
    font-size: 1rem;
  }
  @media (min-width: 1280px) {
    font-size: 1.25rem;
  }
}
</style>
