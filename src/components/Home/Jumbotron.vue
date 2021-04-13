<template>
  <section class="px-md-10 pa-5 d-flex flex-column justify-center heroBlock">
    <h1 class="text-body-1 text-sm-h6 pt-2 text-md-h6 text-lg-h4 text-xl-h4 font-weight-medium white--text">
      A curated, informative and educational resource on data and metadata standards, inter-related to databases and data policies.
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
      We guide consumers to discover, select and use these resources with confidence, and producers to make their resource more discoverable, more widely adopted and cited.
    </h3>
  </section>
</template>

<script>
export default {
  name: "Jumbotron"
}
</script>

<style scoped>
section.heroBlock {
  height: 250px;
  background-image: linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 200%), url('/assets/Home/BlockHero/pattern3.jpg');
  background-repeat: repeat;
  background-blend-mode: multiply;
}
</style>
