<template>
  <transition name="fade">
    <v-btn
      fab
      color="primary"
      bottom
      right
      fixed
      class="mr-2 mb-10"
      @click="scrollToTop()"
    >
      <v-icon>fa-arrow-up</v-icon>
    </v-btn>
  </transition>
</template>

<script>

export default {
  name: "JumpToTop",
  data:()=>{
      return{
        options:{
          top: 0,
          left: 0,
          behavior: 'smooth'
        }
      }
  },
  methods: {
    scrollToTop: function () {
      window.scrollTo(this.options);
    },
  }
}
</script>

<style scoped>

</style>
