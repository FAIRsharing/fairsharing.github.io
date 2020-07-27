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
    scrollToTop: function () {
      const targetDiv = document.getElementById(this.targetObject);
      gotoTop(targetDiv);
    },
  }
}
</script>

<style scoped>

</style>
