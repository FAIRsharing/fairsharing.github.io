<template>
  <transition name="fade">
    <v-btn
      fab
      color="primary"
      bottom
      right
      fixed
      class="mr-2 mb-10"
      @click="scrollToTop"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </transition>
</template>

<script>
    export default {
        name: "JumpTop",
        props: {
            targetObject: null
        },
        methods: {
            scrollToTop: function () {
                let myDiv = document.getElementById(this.targetObject);
                myDiv.scrollTo(0, 0);
            },
        }
    }
</script>

<style scoped>

</style>