<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <div
      v-if="recordType && !showOnlyStatus"
      :class="showStatus?'circle-container':'circle-container-dashed'"
    >
      <v-tooltip
        right
        nudge-right="15"
      >
        <template #activator="{ on }">
          <v-avatar
            size="80"
            :alt="getRecordStatus.title"
            v-on="on"
          >
            <Icon
              :item="record.type"
              wrapper-class=""
              :height="80"
            />
          </v-avatar>
        </template>
        <span v-if="recordType[record.type]">{{ recordType[record.type].tooltip }}</span>
      </v-tooltip>

      <v-tooltip
        v-if="showStatus"
        right
      >
        <template #activator="{ on }">
          <span
            class="white--text headline circle"
            :style="getRecordStatus.backColor"
            v-on="on"
          ><p>{{ getRecordStatus.title }}</p></span>
        </template>
        <span>{{ getRecordStatus.tooltip }}</span>
      </v-tooltip>
    </div>
    <!-- if only shows status and nothing else   -->
    <div
      v-if="showOnlyStatus && showStatus"
      class="circle-holder"
    >
      <v-tooltip
        v-if="showStatus"
        right
      >
        <template #activator="{ on }">
          <p
            class="white--text headline circle text-center d-flex align-center justify-center"
            :style="getRecordStatus.backColor"
            v-on="on"
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
import Icon from "@/components/Icon"
// Lighten or darken the color using javascript
import { LightenDarkenColor } from '@/utils/generalUtils';

export default {
  name: "RecordStatus",
  components: {Icon},
  props: {
    record: {default: null, type: Object},
    showStatus: {default: true, type: Boolean},
    showOnlyStatus: {default: false, type: Boolean},
  },
  data() {
    return {
      statusStyles: {
        ready: {
          title: 'R',
          tooltip: 'Ready',
          backColor: `background: linear-gradient(${this.$vuetify.theme.themes.light.ready_color}, ${LightenDarkenColor(this.$vuetify.theme.themes.light.ready_color,50)})`
        },
        deprecated: {
          title: 'D',
          tooltip: 'Deprecated',
          backColor: `background: linear-gradient(${this.$vuetify.theme.themes.light.deprecated_color}, ${LightenDarkenColor(this.$vuetify.theme.themes.light.deprecated_color,50)})`
        },
        uncertain: {
          title: 'U',
          tooltip: 'Uncertain',
          backColor: `background: linear-gradient(${this.$vuetify.theme.themes.light.uncertain_color}, ${LightenDarkenColor(this.$vuetify.theme.themes.light.uncertain_color,50)})`
        },
        in_development: {
          title: 'Dev',
          tooltip: 'In Development',
          backColor: `background: linear-gradient(${this.$vuetify.theme.themes.light.dev_color}, ${LightenDarkenColor(this.$vuetify.theme.themes.light.dev_color,50)})`
        },
        undefined: {
          title: '?',
          tooltip: 'Undefined',
          backColor: 'background: linear-gradient(red, red)'
        },
      },
      recordType: null,
    }
  },
  computed: {
    getRecordStatus: function () {
      let _module = this;
      if (this.statusStyles[_module.record.status] !== undefined && _module.record.status !== undefined)
        return this.statusStyles[_module.record.status];
      else {
        return this.statusStyles[undefined]
      }
    }
  },
  created() {
    this.$nextTick(function () {
      this.recordType = this.$vuetify.icons.values;
    });
  }
}
</script>

<style scoped lang="scss">
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
    cursor:help;
  }
}

</style>
