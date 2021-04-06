<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="2"
        class="pt-0 mt-0"
      >
        <v-card height="1180px">
          <v-card-title class="blue white--text">
            Legend and configuration
          </v-card-title>
          <v-card-text class="pt-3">
            <v-row>
              Select the depth of the graph:
              <v-select
                v-model="max_path_length"
                :items="depth"
                label="Graph Depth"
              />
            </v-row>
            <v-row class="text-info">
              The graph's centre is show in red. The registry of each record is as follows:
            </v-row>
            <v-row>
              <div class="square" /> Database
            </v-row>
            <v-row>
              <div class="circle" /> Standard
            </v-row>
            <v-row>
              <div class="triangle" /> Policy
            </v-row>
            <v-row>
              <div class="diamond" /> Collection
            </v-row>
            <v-row>
              Click on any point to re-draw the graph with that point as the centre.
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="10"
        class="pt-0 mt-0"
      >
        <v-card
          v-if="loading"
          height="100%"
        >
          <v-card-text class="text-center blue--text body-1">
            Loading your data
          </v-card-text>
          <Loaders />
        </v-card>
        <highcharts
          v-else
          ref="chartComponent"
          :options="options"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import {Chart} from 'highcharts-vue'
    import GraphClient from '@/components/GraphClient/GraphClient.js'
    import graphQuery from '@/components/GraphClient/queries/getGraphRelations.json'
    import Loaders from "../../components/Navigation/Loaders";

    const graphClient = new GraphClient();

    export default {
        name: "NetworkGraph",
        components: {
          Loaders,
            highcharts: Chart,
        },
        data () {
          let _module = this;
            return {
                loading: false,
                depth: [1, 2, 3, 4],
                max_path_length: 2,
                options: {
                    exporting: {
                        sourceWidth: 1502,
                        sourceHeight: 1600,
                        scale: 1,
                    },
                    tooltip: {
                      enabled: false
                    },
                    chart: {
                        type: 'networkgraph',
                        height: '1280px',
                        plotBorderWidth: 0,
                        plotShadow: true,
                        renderTo: 'container',
                        margin: 10,
                        marginBottom: 100,
                        plotBackgroundColor: "#FFFFFF",
                    },
                    title: {
                        text: 'FAIRsharing',
                        align: 'left',
                        verticalAlign: 'top',
                        y: 30,
                        x: 10,
                        style: {
                            color: '#2F2F30',
                            font: 'bold 32px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    subtitle: {
                        text: 'Network Graph',
                        align: 'left',
                        verticalAlign: 'top',
                        y: 60,
                        x: 10,
                        style: {
                            color: '#2F2F30',
                            font: 'bold 25px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    plotOptions: {
                        networkgraph: {
                            keys: ['from', 'to', 'rel'],
                            layoutAlgorithm: {
                                enableSimulation: true,
                                linkLength: 60,
                                maxIterations: 120
                            }
                        },
                    },
                    series: [{
                        animation: false,
                        events: {
                          click: /* istanbul ignore next */ async function(event) {
                            // Avoid redundant navigation to self...
                            if (parseInt(_module.$route.params.id) !== parseInt(event.point.record_id)) {
                              _module.$router.push({
                                path: "/graph/" +  event.point.record_id
                              })
                            }
                          }
                        },
                        dataLabels: {
                            enabled: true,
                            linkFormat: '{point.rel}',
                            color: '#2F2F30',
                            font: 'light 30px "Trebuchet MS", Verdana, sans-serif',
                            linkTextPath: {
                              attributes: {
                                dy: 12
                              }
                            },
                        formatter: /* istanbul ignore next */ function() {
                            // this is not the component but the point
                            if (this.key.length < 40) {
                              return this.key
                            }
                            return this.key.substring(0, 40) + "..."
                          }
                        },
                        link: {
                          color: "rgba(0, 0, 0, 0.5)",
                          width: 2,
                        },
                        id: 'relationships',
                        data: [],
                        states: {
                          inactive: {
                            enabled: true,
                            linkOpacity: 0.000001,
                            opacity: 0.000001
                          }
                        }
                    }],
                    nodes: null
                },
                relations: null
            }
        },
        computed: {
          currentRoute() {
            return this.target || this.$route.params['id'];
          }
        },
        watch: {
          async currentRoute() {
            await this.getData();
          },
          async max_path_length() {
            await this.getData();
          }
        },
        mounted() {
            this.$nextTick(async function () {
                await this.getData();
            })
        },
        methods: {
            async getData(){
                this.loading = true;

                // A maxPathLength of 1-4 may be specified (API's default is 2).
                // Higher values may make the resulting graph rather large...
                graphQuery.queryParam = {id: parseInt(this.$route.params.id), maxPathLength: this.max_path_length};
                const response = await graphClient.executeQuery(graphQuery);

                let nodes = response.fairsharingGraph.nodes;
                let data = response.fairsharingGraph.edges;

                this.options.plotOptions.networkgraph.layoutAlgorithm.linkLength = response.fairsharingGraph.linkLength;
                this.options.plotOptions.networkgraph.layoutAlgorithm.maxIterations = response.fairsharingGraph.maxIterations;

                this.options.series[0].data = data;
                this.options.series[0].nodes = nodes;
                this.options.subtitle.text = this.options.series[0].nodes[0].id + ' Network Graph';

                this.loading = false;
            }
        }
    }
</script>

<style>
.square {
  height: 25px;
  width: 25px;
  background-color: #51b0ff;
}
.circle {
  height: 25px;
  width: 25px;
  background-color: #51b0ff;
  border-radius: 50%;
}
.triangle {
  width: 0;
  height: 0;
  border-left: 12.5px solid transparent;
  border-right: 12.5px solid transparent;
  border-bottom: 25px solid #51b0ff;
}
.diamond {
  width: 0;
  height: 0;
  border: 16px solid transparent;
  border-bottom-color: #51b0ff;
  position: relative;
  top: -16px;
}
.diamond:after {
  content: '';
  position: absolute;
  left: -16px;
  top: 16px;
  width: 0;
  height: 0;
  border: 16px solid transparent;
  border-top-color: #51b0ff;
}

</style>