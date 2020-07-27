<template>
  <transition name="fade">
    <v-btn
      fab
      color="primary"
      bottom
      right
      fixed
      class="mr-2 mb-10"
      @click="scrollToTop(targetObject)"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </transition>
</template>

<script>
import {gotoTop} from '@/utils/navigationUtils';

export default {
  name: "JumpToTop",
  props: {
    targetObject: {default: null, type: String},
  },
  methods: {
    scrollToTop: function (target) {
      const targetDiv = document.getElementById(target);
      gotoTop(targetDiv);
    },
  }
}
</script>

<style scoped>

</style>
