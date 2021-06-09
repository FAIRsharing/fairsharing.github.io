<template>
  <v-card
    v-if="currentRecord['fairsharingRecord'].curatorNotes && user().is_curator"
    class="pa-4 d-flex flex-column"
    outlined
    color="bg_record_card"
    tile
    elevation="3"
  >
    <!-- Curator Notes -->
    <SectionTitle title="Curator Notes" />
    <p class="mt-2">
      {{ currentRecord['fairsharingRecord'].curatorNotes }}
    </p>
  </v-card>
</template>

<script>
import {mapState} from "vuex";
import SectionTitle from "@/components/Records/Record/SectionTitle";

export default {
  name: "CuratorNotes",
  components: {SectionTitle},
  computed: {
    ...mapState('record', ["currentRecord"]),
    ...mapState('users', ["user"]),
  }
}
</script>

<style scoped>
.data-holder {
  border: 1px lightgrey solid;
}
</style>
