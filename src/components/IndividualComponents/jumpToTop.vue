<template>
  <transition name="fade">
    <v-btn
      fab
      color="primary"
      bottom
      right
      fixed
      class="mr-2 mb-10"
    >
      <v-icon>mdi-arrow-up</v-icon>
    </v-btn>
  </transition>
</template>

<script>
    export default {
        name: "JumpToTop",
        props: {
            targetObject: {default: null, type: String},
        },
        data: () => {
            return {
                myDiv: null
            }
        },
        methods: {
/*
            scrollToTop: function () {
                  this.myDiv = document.getElementById(this.targetObject);
                  this.myDiv.scrollTo(0, 0);
            },
*/
        }
    }
</script>

<style scoped>

</style>
