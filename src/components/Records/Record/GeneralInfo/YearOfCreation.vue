<template>
  <div class="d-flex flex-row mt-4 align-center min-height-40">
    <b class="width-200">Year of Creation</b>
    <div class="d-flex full-width ml-md-12 ml-13">
      <p
        v-if="getField('metadata').year_creation"
        class="ma-0"
      >
        {{ getField('metadata').year_creation }}
      </p>
      <NoneFound
        v-else
        :string-field="getField('metadata').year_creation"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import NoneFound from "@/components/Records/Record/NoneFound";
export default {
  name: "YearOfCreation",
  components:{NoneFound},
  computed: {
    ...mapGetters("record", ["getField"]),
  }
}
</script>
