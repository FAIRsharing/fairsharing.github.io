<template>
  <v-progress-circular
    :rotate="360"
    :size="80"
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

export default {
  name: "InfoBadge",
  components: {},
  props: {
    currentRecord: {default: null, type: Object}
  },
  data() {
    return {
      badges: {}
    }
  },
  computed: {},
  mounted() {
    this.checkBadges()
  },
  methods: {
    checkBadges() {
      let badgeBuilder = new BadgeBuilder(this.currentRecord['fairsharingRecord'])
      this.badges = badgeBuilder
      .hasLicence()
      .hasMaintainer()
      .hasStatus()
      .hasStandard()
      .hasDatabase()
      .hasPolicy()
      .hasAPI()
      .hasPID()
      .hasCertificate()
      .getBadges();

      console.log(this.badges)
    },
  }
}
</script>

<style scoped>

</style>