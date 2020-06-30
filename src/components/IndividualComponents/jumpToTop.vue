<template>
  <transition name="fade">
    <v-btn
      fab
      color="primary"
      bottom
      right
      fixed
      class="mr-2 mb-10"
      @click="scrollToTop(false)"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </transition>
</template>

<script>
    export default {
        name: "JumpTop",
        props: {
            targetObject: {default: null, type: String},
        },
        data: () => {
            return {
                scrolledCorrectly: false,
                myDiv: null
            }
        },
        methods: {
            scrollToTop: function (isTestEnvironment) {
                if (isTestEnvironment) {
                  this.scrolledCorrectly = false;
                } else {
                  this.scrolledCorrectly = true;
                  this.myDiv = document.getElementById(this.targetObject);
                  this.myDiv.scrollTo(0, 0);
                }
            },
        }
    }
</script>

<style scoped>

</style>
