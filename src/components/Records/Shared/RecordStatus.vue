<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div
    v-if="recordType"
    class="circle-container"
  >
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-avatar
          v-if="Object.keys(recordType).includes(record.type)"
          size="80"
          :alt="getRecordStatus.title"
          v-on="on"
        >
          <img
            :src="('./' + recordType[record.type].icon)"
            :alt="getRecordStatus.title"
          >
        </v-avatar>
      </template>
      <span>{{ recordType[record.type].tooltip }}</span>
    </v-tooltip>

    <v-tooltip right>
      <template v-slot:activator="{ on }">
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
import recordTypes from "@/data/recordsRegistries.json"

export default {
  name: "RecordStatus",
  props: {
    record: {default: null, type: Object}
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
      this.recordType = recordTypes;
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
</style>
