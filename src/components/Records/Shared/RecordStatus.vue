<template>
  <div>
    <div
      v-if="recordType && !showOnlyStatus"
      :class="showStatus ? 'circle-container' : 'circle-container-dashed'"
    >
      <v-tooltip location="end" offset="25">
        <template #activator="{ props }">
          <v-avatar :alt="getRecordStatus.title" size="80" v-bind="props">
            <Icon :height="80" :item="record.type" wrapper-class="" />
          </v-avatar>
        </template>
        <span v-if="recordType[record.type]">{{
          recordType[record.type].tooltip
        }}</span>
      </v-tooltip>

      <v-tooltip v-if="showStatus" location="right">
        <template #activator="{ props }">
          <span
            :style="getRecordStatus.backColor"
            class="text-white text-h5 circle"
            v-bind="props"
            ><p>{{ getRecordStatus.title }}</p></span
          >
        </template>
        <span>{{ getRecordStatus.tooltip }}</span>
      </v-tooltip>
    </div>
    <!-- if only shows status and nothing else   -->
    <div
      v-if="showOnlyStatus && showStatus"
      :class="inEditForm ? 'circle-holder-editing' : 'circle-holder'"
    >
      <v-tooltip v-if="showStatus" location="top">
        <template #activator="{ props }">
          <p
            :style="getRecordStatus.backColor"
            class="text-white text-h5 circle text-center d-flex align-center justify-center mb-0"
            v-bind="props"
          >
            <span>{{ getRecordStatus.title }}</span>
          </p>
        </template>
        <span>{{ getRecordStatus.tooltip }}</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import Icon from "@/components/Icon";
import { useTheme } from "vuetify"; // Lighten or darken the color using javascript
import { LightenDarkenColor } from "@/utils/generalUtils";
import customIcons from "@/plugins/icons";

export default {
  name: "RecordStatus",
  components: { Icon },
  props: {
    record: { default: null, type: Object },
    showStatus: { default: true, type: Boolean },
    showOnlyStatus: { default: false, type: Boolean },
    inEditForm: { default: false, type: Boolean },
  },
  setup() {
    const theme = useTheme();
    return { theme };
  },
  data() {
    return {
      statusStyles: {
        ready: {
          title: "R",
          tooltip: "Ready",
          backColor: `background: linear-gradient(${this.theme.computedThemes.value.fairSharingTheme.colors.ready_color}, ${LightenDarkenColor(this.theme.computedThemes.value.fairSharingTheme.colors.ready_color, 50)})`,
        },
        deprecated: {
          title: "D",
          tooltip: "Deprecated",
          backColor: `background: linear-gradient(${this.theme.computedThemes.value.fairSharingTheme.colors.deprecated_color}, ${LightenDarkenColor(this.theme.computedThemes.value.fairSharingTheme.colors.deprecated_color, 50)})`,
        },
        uncertain: {
          title: "U",
          tooltip: "Uncertain",
          backColor: `background: linear-gradient(${this.theme.computedThemes.value.fairSharingTheme.colors.uncertain_color}, ${LightenDarkenColor(this.theme.computedThemes.value.fairSharingTheme.colors.uncertain_color, 50)})`,
        },
        in_development: {
          title: "Dev",
          tooltip: "In Development",
          backColor: `background: linear-gradient(${this.theme.computedThemes.value.fairSharingTheme.colors.dev_color}, ${LightenDarkenColor(this.theme.computedThemes.value.fairSharingTheme.colors.dev_color, 50)})`,
        },
        undefined: {
          title: "?",
          tooltip: "Undefined",
          backColor: "background: linear-gradient(red, red)",
        },
      },
      recordType: null,
    };
  },
  computed: {
    getRecordStatus: function () {
      let _module = this;
      if (
        this.statusStyles[_module.record.status] !== undefined &&
        _module.record.status !== undefined
      )
        return this.statusStyles[_module.record.status];
      else {
        return this.statusStyles[undefined];
      }
    },
  },
  created() {
    this.$nextTick(function () {
      this.recordType = customIcons.values;
    });
  },
};
</script>

<style lang="scss" scoped>
.circle-container {
  position: relative;
  border: #b3b3b3 dotted 3px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  width: 86px;
  height: 87px;
  cursor: help;

  .circle {
    position: absolute;
    left: 60px;
    top: 20px;
    height: 40px;
    width: 40px;
    min-width: 40px;
    border-radius: 40px;
    -moz-border-radius: 40px;
    -webkit-border-radius: 40px;
    cursor: help;

    p {
      min-width: 40px;
      text-align: center;
      font-size: 18px;
      position: absolute;
      top: 4px;
    }
  }
}

.circle-container-dashed {
  position: relative;
  border: #b3b3b3 dotted 3px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  width: 86px;
  height: 87px;
  cursor: help;
}

.circle-holder {
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  width: 86px;
  height: 87px;

  .circle {
    position: absolute;
    left: 26%;
    top: 25%;
    height: 42px;
    width: 42px;
    min-width: 40px;
    border-radius: 40px;
    -moz-border-radius: 40px;
    -webkit-border-radius: 40px;
    cursor: help;
  }
}

.circle-holder-editing {
  padding-right: 8px;
  border-radius: 50%;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;

  .circle {
    height: 36px;
    width: 36px;
    border-radius: 36px;
    -moz-border-radius: 36px;
    -webkit-border-radius: 36px;
  }
}
</style>
