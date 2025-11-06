<template>
  <transition name="fade">
    <v-btn
      v-scroll-to="'body'"
      color="primary"
      location="bottom right"
      fixed
      class="mr-2 mb-10"
    >
      <v-icon>fas fa-arrow-up</v-icon>
    </v-btn>
  </transition>
</template>

<script>
export default {
  name: "JumpToTop",
};
</script>
