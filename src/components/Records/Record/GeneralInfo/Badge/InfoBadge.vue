<template>
  <div class="d-flex flex-wrap">
    <span
      v-for="(badge, key, index) in badges"
      :key="key + '_' + badge.icon + '_' + index"
    >
      <span class="d-flex flex-column align-center">
        <v-progress-circular
          :color="badge.progressColor"
          :model-value="badge.progress"
          :rotate="360"
          :size="85"
          :width="10"
          class="mr-1"
        >
          <v-tooltip
            v-if="showProgressHover"
            :color="badge.progressColor"
            :open-on-hover="showProgressHover"
            location="bottom"
            offset="30"
          >
            <template #activator="{ props }">
              <div v-bind="props">
                <div class="circle-transparent" />
              </div>
            </template>
            {{ badge.progressHover }}
          </v-tooltip>
          <v-tooltip
            v-if="badge.icon"
            :open-on-hover="showTextHover"
            location="top"
          >
            <template #activator="{ props }">
              <div style="position: relative" v-bind="props">
                <Icon
                  :item="badge.icon"
                  size="38"
                  style="cursor: help"
                  wrapper-class=""
                />
                <!--   if the current badge is standard/policy/database then add a node icon over it               -->
                <div
                  v-if="
                    key === 'hasStandard' ||
                    key === 'hasDatabase' ||
                    key === 'hasPolicy'
                  "
                  class="extra-badge-holder"
                >
                  <Icon
                    :height="15"
                    item="nodes"
                    style="position: absolute; top: 25%; left: 20%"
                    wrapper-class=""
                  />
                </div>
              </div>
            </template>
            {{ badge.textHover }}
          </v-tooltip>
          <record-status
            v-else
            :record="currentRecordLocal['fairsharingRecord']"
            :show-only-status="true"
          />
        </v-progress-circular>
        <b
          v-if="showProgress && badge.progress > 0"
          :class="[`text-${badge.progressColor}`]"
          >{{ badge.progress }}</b
        >
      </span>
    </span>
  </div>
</template>

<script>
import Icon from "@/components/Icon";
import RecordStatus from "@/components/Records/Shared/RecordStatus";
import BadgeBuilder from "@/lib/BadgeBuilder/BadgeBuilder";
import { prepareAssociations } from "@/utils/recordTabUtils";

export default {
  name: "InfoBadge",
  components: { Icon, RecordStatus },
  props: {
    currentRecord: { default: null, type: Object },
    showProgress: { default: true, type: Boolean },
    showProgressHover: { default: false, type: Boolean },
    showTextHover: { default: true, type: Boolean },
  },
  data() {
    return {
      badges: {},
      currentRecordLocal: null,
    };
  },
  mounted() {
    this.currentRecordLocal = this.currentRecord;
    this.currentRecordLocal["fairsharingRecord"]["mergedAssociations"] =
      this.mergedAssociations();
    this.checkBadges();
  },
  methods: {
    mergedAssociations() {
      return prepareAssociations(
        this,
        this.currentRecordLocal["fairsharingRecord"].recordAssociations,
        this.currentRecordLocal["fairsharingRecord"].reverseRecordAssociations,
      );
    },
    checkBadges() {
      this.badges = new BadgeBuilder(
        this.currentRecordLocal["fairsharingRecord"],
      )
        .hasStatus()
        .hasLicence()
        .hasMaintainer()
        .hasStandard()
        .hasDatabase()
        .hasPolicy()
        .hasAPI()
        .hasPID()
        .hasCertificate()
        .getBadges();
    },
  },
};
</script>

<style scoped>
.circle-transparent {
  position: absolute;
  border-radius: 50%;
  top: 0;
  left: 0;
  width: 86px;
  height: 87px;
  cursor: help;
  border: 10px solid transparent;
}

.extra-badge-holder {
  position: absolute;
  border: 1px gray solid;
  width: 23px;
  height: 23px;
  top: 55%;
  left: 50%;
  background: #ffffff;
  border-radius: 50%;
  padding: 10px;
}
</style>
