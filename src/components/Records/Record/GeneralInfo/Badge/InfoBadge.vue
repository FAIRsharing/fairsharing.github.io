<template>
  <div class="d-flex flex-wrap">
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
                style="position:relative;"
                v-on="on"
              >
                <Icon
                  style="cursor:help"
                  :item="badge.icon"
                  size="38"
                  wrapper-class=""
                />
                <!--   if the current badge is standard/policy/database then add a node icon over it               -->
                
                <div
                  v-if="key==='hasStandard' || key==='hasDatabase' || key==='hasPolicy'"
                  style="position:absolute;width:23px;height:23px;top: 55%;left: 50%;background:#27aae1;border-radius:50%;padding:10px;"
                >
                  <Icon
                    style="position:absolute;top:25%;left:20%;"
                    item="nodes"
                    :height="15"
                    wrapper-class=""
                  />
                </div>
              </div>
            </template>
            {{ badge.textHover }}
          </v-tooltip>
          <record-status
            v-else
            :show-only-status="true"
            :record="currentRecordLocal['fairsharingRecord']"
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
      currentRecordLocal:null
    }
  },
  mounted() {
    this.currentRecordLocal = this.currentRecord
    this.currentRecordLocal['fairsharingRecord']['mergedAssociations'] = this.mergedAssociations()
    this.checkBadges()
  },
  methods: {
    mergedAssociations() {
      return prepareAssociations(this, this.currentRecordLocal['fairsharingRecord'].recordAssociations,
          this.currentRecordLocal['fairsharingRecord'].reverseRecordAssociations)
    },
    checkBadges() {
      this.badges = new BadgeBuilder(this.currentRecordLocal['fairsharingRecord'])
      .hasStatus()
      .hasLicence()
      .hasMaintainer()
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