<template>
  <v-card
    v-if="currentRecord['fairsharingRecord'].curatorNotes && user().is_curator"
    class="pa-4 d-flex flex-column"
    outlined
    :color="backColor"
    tile
    elevation="3"
  >
    <!-- Curator Notes -->
    <SectionTitle title="Curator Notes" />
    <p class="mt-2">
      <!-- eslint-disable vue/no-v-html -->
      <span v-html="prepareNotes(currentRecord['fairsharingRecord'].curatorNotes)" />
      <!-- eslint-enable vue/no-v-html -->
    </p>
  </v-card>
</template>

<script>
import {mapState} from "vuex";
import SectionTitle from "@/components/Records/Record/SectionTitle";

export default {
  name: "CuratorNotes",
  components: {SectionTitle},
  props: {
    backColor:{
      default:null,
      type: String,
    }
  },
  computed: {
    ...mapState('record', ["currentRecord"]),
    ...mapState('users', ["user"]),
  },
  methods: {
    prepareNotes(notes) {
      return this.$sanitize(notes.replace(/(?:\r\n|\r|\n)/g, "<br>"));
    }
  }
}
</script>

<style scoped>
.data-holder {
  border: 1px lightgrey solid;
}
</style>
