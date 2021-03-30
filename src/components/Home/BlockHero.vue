<template>
  <section
    class="px-md-10 pa-5"
    :style="{ backgroundImage: 'linear-gradient(180deg, rgba(37, 52, 66, 1) 0%, rgba(39, 170, 225, 1) 200%),url(' + 'assets/Home/HeroBlock/pattern3.jpg',backgroundRepeat:'repeat',backgroundBlendMode:'multiply'}"
  >
    <h1 class="text-body-1 text-sm-h6 pt-2 text-md-h6 text-lg-h4 text-xl-h4 font-weight-medium white--text">
      A curated, informative and educational resource on data and metadata standards, inter-related to databases and data policies.
    </h1>
    <h3 :class="['lato-font-medium my-sm-4 my-lg-4 my-4  primary--text px-1 font-weight-thin',{'lato-text-md':$vuetify.breakpoint.mdOnly,'lato-text-lg':$vuetify.breakpoint.lgAndUp,'lato-text-sm':$vuetify.breakpoint.smAndDown}]">
      We guide consumers to discover, select and use these resources with confidence, and producers to make their resource more discoverable, more widely adopted and cited.
    </h3>
  </section>
</template>

<script>
export default {
name: "BlockHero"
}
</script>
