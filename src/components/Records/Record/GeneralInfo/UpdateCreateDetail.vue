<template>
  <div class="d-flex flex-row flex-wrap align-center mt-4 min-height-40">
    <Icon
      item="createdAt"
      size="small"
      wrapper-class=""
      class="mr-2"
    />
    <b class="mr-2">Record created at</b>
    <p class="ma-0 mr-2 text-body-2">
      {{ currentRecord['fairsharingRecord'].createdAt }}
    </p>
    <span class="mr-2">|</span>
    <Icon
      item="updatedAt"
      size="small"
      wrapper-class=""
      class="mr-2"
    />
    <b class="mr-2">Record updated at</b>
    <p class="ma-0 text-body-2">
      {{ currentRecord['fairsharingRecord'].updatedAt }}
    </p>
  </div>
</template>

<script>
import {mapState} from "vuex";
import Icon from "@/components/Icon"


export default {
  name: "UpdateCreateDetail",
  components: { Icon },
  computed: {
    ...mapState("record", ["currentRecord"]),
  }
}
</script>
