<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="3"
        class="pt-0 mt-2"
      >
        <v-card
          height="99.3%"
          min-height="80vh"
        >
          <v-card-title class="blue white--text">
            Legend and configuration
          </v-card-title>
          <v-card-text class="pt-3">
            <v-container fluid>
              <v-row no-gutters>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="max_path_length"
                    class="mt-2 px-2"
                    :items="depth"
                    label="Select the depth of the graph"
                    outlined
                    hint="Setting to greater than 2 is not recommended."
                    persistent-hint
                  />
                </v-col>
              </v-row>
              <v-divider />
              <v-row no-gutters>
                <v-col cols="12">
                  The graph's centre is shown in <span class="red--text">red.</span> The registry of each record is as follows:
                </v-col>
                <v-col cols="12">
                  <v-container
                    fluid
                    class="pb-0 mt-0"
                  >
                    <v-row class="pl-2">
                      <v-switch
                        v-model="legend.types.square"
                        inset
                        class="field mx-3 switch mt-0 pt-0"
                        @change="getData($event)"
                      />
                      <div class="square mb-3 mr-5" /> Database
                    </v-row>
                    <v-row class="pl-2">
                      <v-switch
                        v-model="legend.types.circle"
                        inset
                        class="field mx-3 switch mt-0 pt-0"
                        @change="getData($event)"
                      />
                      <div class="circle mb-3 mr-5" /> Standard
                    </v-row>
                    <v-row class="pl-2">
                      <v-switch
                        v-model="legend.types.triangle"
                        inset
                        class="field mx-3 switch mt-0 pt-0"
                        @change="getData($event)"
                      />
                      <div class="triangle mb-3 mr-5" /> Policy
                    </v-row>
                    <v-row class="pl-2">
                      <v-switch
                        v-model="legend.types.diamond"
                        inset
                        class="field mx-3 switch mt-0 pt-0"
                        @change="getData($event)"
                      />
                      <div class="diamond mb-3 mr-3" /> Collection
                    </v-row>
                  </v-container>
                  <span>Click on any point to re-draw the graph with that point as the centre.</span>
                </v-col>
              </v-row>
              <v-divider />
              <v-row v-if="initialized">
                <v-col
                  cols="12"
                  class="mt-0 pt-0 mb-0"
                >
                  <h4>Records Relationships</h4>
                </v-col>
                <v-col
                  v-for="(relationName, relationColor, relationIndex) in legend.relations"
                  :key="'relationInLegend_' + relationIndex"
                  cols="12"
                  sm="12"
                  md="12"
                  lg="6"
                  xl="4"
                  class="pt-1"
                >
                  <div
                    class="legendColor"
                    :style="'background:' + relationColor"
                  >
                    <span class="white--text">{{ relationName }}</span>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="9"
        class="pt-0 mt-2"
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
    import GraphClient from '@/lib/GraphClient/GraphClient.js'
    import graphQuery from '@/lib/GraphClient/queries/getGraphRelations.json'
    import Loaders from "../../components/Navigation/Loaders";
    import relationColors from "@/data/RelationsColors.json"

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
                initialized: false,
                depth: [1, 2, 3],
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
                        height: '62.8%',
                        plotBorderWidth: 0,
                        plotShadow: true,
                        renderTo: 'container',
                        margin: 10,
                        marginTop: 0,
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
                        enabled: true
                    },
                    plotOptions: {
                        networkgraph: {
                            keys: ['from', 'to', 'rel', 'color'],
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
                            linkFormat: '',
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
                relations: null,
                relations_colors: relationColors,
                legend: {
                  relations: {},
                  types: {
                    circle: true,
                    square: true,
                    triangle: true,
                    diamond: true
                  }
                }
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
        async mounted() {
            this.$nextTick(async function () {
                await this.getData();
            })
        },
        methods: {
            async getData(){
                this.loading = true;
                /* A maxPathLength of 1-4 may be specified (API's default is 2).
                 Higher values may make the resulting graph rather large... */
                graphQuery.queryParam = {id: parseInt(this.$route.params.id), maxPathLength: this.max_path_length};
                const response = await graphClient.executeQuery(graphQuery);
                /* istanbul ignore next */
                if (!this.initialized && response.fairsharingGraph.nodes.length > 50 && this.max_path_length > 1){
                  this.max_path_length--;
                }
                else {
                  this.drawGraph(response.fairsharingGraph)
                  this.loading = false;
                  this.initialized = true;
                }

            },
            drawGraph(graphData){
                let raw_nodes = graphData.nodes,
                    raw_edges = graphData.edges,
                    tree = {},
                    nodes_processed = [],
                    edges = [],
                    nodes = []
                raw_nodes.forEach(node => {
                  tree[node.id] = {
                    content: node,
                    marker: node.marker.symbol,
                    children: {}
                  }
                })
                raw_edges.forEach(edge => {
                  tree[edge[0]].children[edge[1]] = edge
                })
                this.processNode(edges, tree, tree[Object.keys(tree)[0]], Object.keys(tree)[0], nodes, nodes_processed)
                this.legend.relations = {}
                edges.forEach(edge => {
                  if (Object.keys(this.relations_colors).includes(edge[2].toLowerCase())) {
                    edge.push(this.relations_colors[edge[2].toLowerCase()])
                    if (!(Object.keys(this.legend.relations).includes(this.relations_colors[edge[2].toLowerCase()]))) {
                      this.legend.relations[this.relations_colors[edge[2].toLowerCase()]] = edge[2]
                    }
                  }
                })
                this.options.plotOptions.networkgraph.layoutAlgorithm.linkLength = graphData.linkLength;
                this.options.plotOptions.networkgraph.layoutAlgorithm.maxIterations = graphData.maxIterations;
                this.options.series[0].data = edges;
                this.options.series[0].nodes = nodes;
                this.options.subtitle.text = this.options.series[0].nodes[0].id + ' Network Graph';

            },
            processNode(edges, tree, node, nodeID, outputNodes, nodes_processed){
              if (!nodes_processed.includes(nodeID)) {
                outputNodes.push(node.content)
                nodes_processed.push(nodeID)
                Object.keys(node.children).forEach(childName => {
                  const child = node.children[childName],
                  childNode = tree[childName]
                  if (this.legend.types[childNode.marker]) {
                    edges.push(child)
                    this.processNode(edges, tree, childNode, childName, outputNodes, nodes_processed)
                  }
                })
              }
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
  left:-3px;
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

.legendColor {
  padding: 10px;
  font-size: 16px;
  text-align: center;
  border: 1px solid #ccc;
  box-shadow: 3px 3px 6px #ccc;
}

</style>
