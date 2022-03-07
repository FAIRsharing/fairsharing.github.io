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
          <v-tooltip
            bottom
            nudge-bottom="30"
            :open-on-hover="showProgressHover"
          >
            <template #activator="{ on }">
              <div
                v-on="on"
              >
                <div class="circle-transparent" />
              </div>
            </template>
            {{ badge.progressHover }}
          </v-tooltip>
          <v-tooltip
            v-if="badge.icon"
            top
            :open-on-hover="showTextHover"
          >
            <template #activator="{ on }">
              <div
                v-on="on"
              >
                <Icon
                  style="cursor:help"
                  :item="badge.icon"
                  size="38"
                  wrapper-class=""
                />
              </div>
            </template>
            {{ badge.textHover }}
          </v-tooltip>
          <record-status
            v-else
            :show-only-status="true"
            :record="currentRecord['fairsharingRecord']"
          />
        </v-progress-circular>
        <b
          v-if="showProgress && badge.progress>0"
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
    showProgress: {default: true, type: Boolean},
    showProgressHover: {default: true, type: Boolean},
    showTextHover: {default: true, type: Boolean}
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
    },
  }
}
</script>

<style scoped>

.circle-transparent {
  position:absolute;
  border-radius: 50%;
  top:0;
  left:0;
  width: 86px;
  height: 87px;
  cursor: help;
  border: 10px solid transparent;
}
</style>