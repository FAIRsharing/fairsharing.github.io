<template>
  <div class="d-flex">
    <span
      v-for="(badge,key,index) in badges"
      :key="key+'_'+badge.icon+'_'+index"
    >
      <span class="d-flex flex-column align-center">
        <v-progress-circular
          :rotate="360"
          :size="85"
          :width="10"
          :value="badge.progress"
          :color="badge.progressColor"
          class="mr-1"
        >
          <Icon
            v-if="badge.icon"
            :item="badge.icon"
            size="45"
            wrapper-class=""
          />
          <record-status
            v-else
            :show-only-status="true"
            :record="currentRecord['fairsharingRecord']"
          />
        </v-progress-circular>
        <b
          v-if="showProgress"
          :class="[`${badge.progressColor}--text`]"
        >{{ badge.progress }}</b>
      </span>
    </span>
  </div>
</template>

<script>
import BadgeBuilder from "@/lib/BadgeBuilder/BadgeBuilder";
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import {prepareAssociations} from "@/utils/recordTabUtils";
import Icon from "@/components/Icon"

export default {
  name: "InfoBadge",
  components: {Icon, RecordStatus},
  props: {
    currentRecord: {default: null, type: Object},
    showProgress: {default: true, type: Boolean}
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