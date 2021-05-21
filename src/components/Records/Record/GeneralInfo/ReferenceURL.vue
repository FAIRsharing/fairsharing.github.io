<template>
  <div class="d-flex flex-row mt-4 align-center min-height-40">
    <b class="width-200">Reference URL</b>
    <div class="d-flex full-width ml-md-12 ml-13">
      <a
        v-if="getField('metadata').reference_url"
        :href="getField('metadata').reference_url"
        target="_blank"
        class="underline-effect"
      >{{ getField('metadata').reference_url }}</a>
      <NoneFound
        v-else
        :string-field="getField('metadata').reference_url"
      />
    </div>
  </div>
</template>

<script>
import NoneFound from "@/components/Records/Record/NoneFound";
import {mapGetters} from "vuex";
export default {
  name: "ReferenceURL",
  components: {NoneFound},
  computed: {
    ...mapGetters("record", ["getField"]),
  }
}
</script>
