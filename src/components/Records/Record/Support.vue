<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    as
  </div>
  <!--    v-if="(getField('metadata')['contacts'] && getField('metadata')['contacts'].length) || (getField('metadata')['support_links'] && getField('metadata')['support_links'].length)"-->
</template>

<script>
import clearString from '@/utils/stringUtils'
import IconsMixin from "@/utils/iconsMixin.js"

export default {
  name: "Support",
  mixins: [clearString, IconsMixin],
/*  computed: {
    ...mapGetters("record", ["getField"]),
  },*/
  methods:{
  }
}
</script>
