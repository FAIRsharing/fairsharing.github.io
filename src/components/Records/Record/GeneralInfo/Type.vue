<template>
  <div class="d-flex flex-row mt-4 align-center">
    <b class="width-200">type</b>
    <p class="ma-0 full-width ml-md-12 ml-13">
      {{ cleanString(getField('type')) | capitalize }}
    </p>
  </div>
</template>

<script>
import stringUtils from "@/utils/stringUtils";
import {mapGetters} from "vuex";
export default {
  name: "Type",
  mixins: [stringUtils],
  computed: {
    ...mapGetters("record", ["getField"]),
  }
}
</script>
