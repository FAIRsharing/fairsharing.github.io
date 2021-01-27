<template>
  <div class="d-flex flex-row mt-4 min-height-40">
    <b class="width-200">Description</b>
    <p class="ma-0 full-width ml-md-12 ml-13 text-justify">
      {{ getField('description') | capitalize }}
    </p>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import stringUtils from "@/utils/stringUtils";

export default {
  name: "Description",
  mixins: [stringUtils],
  computed: {
    ...mapGetters("record", ["getField"]),
  }
}
</script>
