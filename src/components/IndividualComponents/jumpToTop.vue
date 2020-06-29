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
                TestEnvironment:false
            }
        },
        methods: {
            scrollToTop: function (isTestEnvironment) {
                if (isTestEnvironment) {
                    this.scrolledCorrectly = true;
                } else {
                    if (this.TestEnvironment) return;
                    this.scrolledCorrectly = true;
                    let myDiv = document.getElementById(this.targetObject);
                    myDiv.scrollTo(0, 0)
                }
            },
        }
    }
</script>

<style scoped>

</style>
