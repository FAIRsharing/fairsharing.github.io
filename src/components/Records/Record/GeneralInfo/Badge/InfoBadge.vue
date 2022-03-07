<template>
  <v-progress-circular
    :rotate="360"
    :size="85"
    :width="10"
    :value="0"
    color="gray"
    class="mr-1"
  >
    {{ 0 }}
  </v-progress-circular>
</template>

<script>
import BadgeBuilder from "@/lib/BadgeBuilder/BadgeBuilder";
import {prepareAssociations} from "@/utils/recordTabUtils";

export default {
  name: "InfoBadge",
  components: {},
  props: {
    currentRecord: {default: null, type: Object}
  },
  data() {
    return {
      badges: {},
      associations: null
    }
  },
  computed: {},
  mounted() {
    this.currentRecord['fairsharingRecord']['mergedAssociations'] = this.mergedAssociations()
    this.checkBadges()
  },
  methods: {
    mergedAssociations() {
      return prepareAssociations(this, this.currentRecord['fairsharingRecord'].recordAssociations,
          this.currentRecord['fairsharingRecord'].reverseRecordAssociations)
    },
    checkBadges() {
      this.badges = new BadgeBuilder(this.currentRecord['fairsharingRecord'])
      .hasLicence()
      .hasMaintainer()
      .hasStatus()
      .hasStandard()
      .hasDatabase()
      .hasPolicy()
      .hasAPI()
      .hasPID()
      .hasCertificate()
      .getBadges()
      console.log(this.badges)
    },
  }
}
</script>

<style scoped>

</style>