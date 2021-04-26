<template>
  <section
    class="px-md-10 pa-5 d-flex flex-column justify-center heroBlock"
    :style="{ backgroundImage: 'linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 200%),url(' + 'assets/Home/BlockHero/pattern3.jpg',backgroundRepeat:'repeat',backgroundBlendMode:'multiply'}"
  >
    <Particles
      id="particles"
      :options="options"
    />
    <h1 class="text-body-1 text-sm-h6 pt-2 text-md-h6 text-lg-h4 text-xl-h4 font-weight-medium white--text">
      {{ title }}
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
      {{ subtitle }}
    </h3>
  </section>
</template>

<script>

export default {
  name: "Jumbotron",
  props: {
    title: {default: null, type: String},
    subtitle: {default: null, type: String}
  },
  data:() => {
    return {
      options: {
        background: {
          color: {
            value: 'transparent'
          }
        },
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
            outMode: 'bounce',
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
      }
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
    z-index: 1;
    left:0;
    top:0;
  }
</style>
