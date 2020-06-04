<template>
  <div class="circle">
    <v-icon
      size="50"
      class="iconClass"
    >
      {{ getRecordStatus.icon }}
    </v-icon>
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
        name: "CircleHolder",
        props: {
            status: {default: null, type: String}
        },
        data() {
            return {
                statusStyles: {
                    ready: {
                        title: 'R',
                        toolTip: 'Ready',
                        icon: 'mdi-database',
                        backColor: 'background: linear-gradient(green, lightgreen)'
                    },
                    deprecated: {
                        title: 'D',
                        toolTip: 'Deprecated',
                        icon: 'mdi-database',
                        backColor: 'background: linear-gradient(#8F4309, #a57202)'
                    },
                    uncertain: {
                        title: 'U',
                        toolTip: 'Uncertain',
                        icon: 'mdi-database',
                        backColor: 'background: linear-gradient(yellow, yellow)'
                    },
                    inDevelopment: {
                        title: 'I',
                        toolTip: 'In Development',
                        icon: 'mdi-database',
                        backColor: 'background: linear-gradient(pink, pink)'
                    }
                },
            }
        }, computed: {
            getRecordStatus: function () {
                return this.statusStyles[this.status];
            }
        }
    }
</script>

<style scoped lang="scss">
    .circle {
        position: relative;
        border: lightgray 1px solid;
        background-color: white;
        height: 100px;
        border-radius: 150px;
        -moz-border-radius: 150px;
        -webkit-border-radius: 150px;
        width: 100px;

        #innerCircle {
            position: absolute;
            right: -25%;
            top: 30%;
            height: 45px;
            border-radius: 45px;
            -moz-border-radius: 45px;
            -webkit-border-radius: 45px;
            width: 45px;
            opacity: .8;
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
        }
    }


</style>