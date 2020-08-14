<template>
  <div class="circle">
    <v-tooltip top>
      <template v-slot:activator="{ on }">
        <v-img
          v-if="Object.keys(recordType).includes(record.type)"
          :src="recordType[record.type].icon"
          class="iconClass"
          v-on="on"
        />
      </template>
      <span>{{ recordType[record.type].toolTip }}</span>
    </v-tooltip>
    <span
      id="innerCircle"
      :style="getRecordStatus.backColor"
    >

      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <b
            id="status-style"
            v-on="on"
          >{{ getRecordStatus.title }}</b>
        </template>
        <span>{{ getRecordStatus.toolTip }}</span>
      </v-tooltip>
    </span>
  </div>
</template>

<script>
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
                        toolTip: 'Ready',
                        backColor: 'background: linear-gradient(green, lightgreen)'
                    },
                    deprecated: {
                        title: 'D',
                        toolTip: 'Deprecated',
                        backColor: 'background: linear-gradient(#8F4309, #a57202)'
                    },
                    uncertain: {
                        title: 'U',
                        toolTip: 'Uncertain',
                        backColor: 'background: linear-gradient(#2d2b2b, #757575)'
                    },
                    in_development: {
                        title: 'I',
                        toolTip: 'In Development',
                        backColor: 'background: linear-gradient(#35baef, #02364b)'
                    },
                    undefined: {
                        title: '?',
                        toolTip: 'Undefined',
                        backColor: 'background: linear-gradient(red, red)'
                    },
                },
                recordType: {
                    collection: {
                        icon: require("@/assets/records/collection-icon.svg"),
                        toolTip: 'Collection'
                    },
                    journal: {
                        icon: require("@/assets/records/policy.png"),
                        toolTip: 'Journal',
                    },
                    identifier_schema:{
                      icon: require("@/assets/records/policy.png"),
                      toolTip: 'Identifier Schema',
                    },
                    society: {
                        icon: require("@/assets/records/policy.png"),
                        toolTip: 'Society',
                    },
                    funder: {
                        icon: require("@/assets/records/policy.png"),
                        toolTip: 'Founder',
                    },
                    terminology_artefact: {
                        icon: require("@/assets/records/terminology_artifact.png"),
                        toolTip: 'Terminology Artefact'
                    },
                    model_and_format: {
                        icon: require("@/assets/records/model_and_format.png"),
                        toolTip: 'Model and Format'
                    },
                    reporting_guideline: {
                        icon: require("@/assets/records/reporting_guidelines.png"),
                        toolTip: 'Reporting Guideline',
                    },
                    metric: {
                        icon: require("@/assets/records/std-metric.png"),
                        toolTip: 'Metric'
                    },
                    repository: {
                        icon: require("@/assets/records/db-icon.png"),
                        toolTip: 'Repository',
                    },
                },
            }
        }, computed: {
            getRecordStatus: function () {
                let _module = this;
                if (this.statusStyles[_module.record.status] !== undefined && _module.record.status !== undefined)
                    return this.statusStyles[_module.record.status];
                else {
                    return this.statusStyles[undefined]
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .circle {
        position: relative;
        border: lightgray 1px solid;
        background: linear-gradient(#a7a7a7, white);
        height: 100px;
        width: 100px;
        border-radius: 150px;
        -moz-border-radius: 150px;
        -webkit-border-radius: 150px;

        #innerCircle {
            position: absolute;
            right: -25%;
            top: 30%;
            height: 45px;
            border-radius: 45px;
            -moz-border-radius: 45px;
            -webkit-border-radius: 45px;
            width: 45px;
            opacity: .9;
            background: linear-gradient(gray, lightgray);

            #status-style {
                color: white;
                position: absolute;
                top: 20%;
                left: 35%;
                font-size: 20px;
                cursor: help;
            }
        }

        .iconClass {
            position: absolute;
            left: 25%;
            top: 25%;
            width: 50%;
            border: #b3b3b3 dotted 3px;
            border-radius: 50%;
            -moz-border-radius: 50%;
            -webkit-border-radius: 50%;
            cursor: help;
        }
    }
</style>
