<template>
  <div>
    <v-btn
      style="position: fixed;left: 30%;z-index: 3000;background: red;color: black"
      @click="callAction"
    >
      Click
    </v-btn>

    <b>{{ countInside }}</b>
  </div>
</template>

<script>
    import {mapActions} from 'vuex';

    export default {
        name: "Arm",
        props: {
            countInside: {default: null, type: Number}
        }, methods: {
            ...mapActions('uiController', ["callAction"]),
        }
    }
</script>

<style scoped>

</style>