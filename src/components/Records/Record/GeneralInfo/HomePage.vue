<template>
  <div class="d-flex flex-row mt-4 align-center min-height-40">
    <b class="width-200">Home Page</b>
    <div class="d-flex full-width ml-md-12 ml-13">
      <a
        v-if="getField('homepage')"
        :href="getField('homepage')"
        target="_blank"
        class="underline-effect"
      >{{ getField('homepage') }}</a>
      <NoneFound
        v-else
        :string-field="getField('homepage')"
      />
    </div>
  </div>
</template>

<script>
import NoneFound from "@/components/Records/Record/NoneFound";
import {mapGetters} from "vuex";
export default {
  name: "HomePage",
  components: {NoneFound},
  computed: {
    ...mapGetters("record", ["getField"]),
  }
}
</script>
