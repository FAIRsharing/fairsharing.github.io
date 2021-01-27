<template>
  <div class="d-flex flex-row flex-wrap align-center mt-4 min-height-40">
    <v-icon
      class="mr-2"
      small
    >
      {{ $vuetify.icons.values.createdAt }}
    </v-icon>
    <b class="mr-2">Record created at</b>
    <p class="ma-0 mr-2 text-body-2">
      {{ currentRecord['fairsharingRecord'].createdAt }}
    </p>
    <span class="mr-2">|</span>
    <v-icon
      class="mr-2"
      small
    >
      {{ $vuetify.icons.values.updatedAt }}
    </v-icon>
    <b class="mr-2">Record updated at</b>
    <p class="ma-0 text-body-2">
      {{ currentRecord['fairsharingRecord'].updatedAt }}
    </p>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "UpdateCreateDetail",
  computed: {
    ...mapState("record", ["currentRecord"]),
  }
}
</script>
