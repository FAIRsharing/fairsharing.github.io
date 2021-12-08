<template>
  <div class="d-flex flex-row mt-4 pa-0 align-center sticky-behavior primary">
    <b class="width-200">Registry</b>
    <p class="ma-0 full-width ml-md-12 ml-13 white--text">
      {{ getField('registry') | capitalize }}
    </p>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import stringUtils from "@/utils/stringUtils";
export default {
  name: "Registry",
  mixins: [stringUtils],
  computed: {
    ...mapGetters("record", ["getField"]),
  }
}
</script>
<style scoped>
.sticky-behavior {
  position: sticky!important;
  position: -webkit-sticky!important;
  top: 0!important;
  right: 0!important;
  z-index: 5000;
}
</style>
