<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div
    v-if="recordType"
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
</template>

<script>
import Icon from "@/components/Icon"

export default {
  name: "RecordStatus",
  components: {Icon},
  props: {
    record: {default: null, type: Object},
    showStatus: {default: true, type: Boolean}
  },
  data() {
    return {
      statusStyles: {
        ready: {
          title: 'R',
          tooltip: 'Ready',
          backColor: 'background: linear-gradient(#599C0F, lightgreen)'
        },
        deprecated: {
          title: 'D',
          tooltip: 'Deprecated',
          backColor: 'background: linear-gradient(#707070, #C6C6C6)'
        },
        uncertain: {
          title: 'U',
          tooltip: 'Uncertain',
          backColor: 'background: linear-gradient(#ADA3A3, #D6CCCC)'
        },
        in_development: {
          title: 'Dev',
          tooltip: 'In Development',
          backColor: 'background: linear-gradient(#CB9221, #F5CE80)'
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
</style>
