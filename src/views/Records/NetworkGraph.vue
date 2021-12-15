<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="3"
        xs="12"
        sm="12"
        md="12"
        lg="12"
        xl="3"
        class="pt-0 mt-2"
      >
        <v-card height="100%">
          <v-card-title class="blue white--text">
            Legend and configuration
          </v-card-title>
          <v-card-text class="pt-3">
            <v-container fluid>
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
                        :disabled="!typesFound.includes('square')"
                        @change="drawGraph($event)"
                      />
                      <div class="square mb-3 mr-5" /> Database
                    </v-row>
                    <v-row class="pl-2">
                      <v-switch
                        v-model="legend.types.circle"
                        inset
                        class="field mx-3 switch mt-0 pt-0"
                        :disabled="!typesFound.includes('circle')"
                        @change="drawGraph($event, false)"
                      />
                      <div class="circle mb-3 mr-5" /> Standard
                    </v-row>
                    <v-row class="pl-2">
                      <v-switch
                        v-model="legend.types.triangle"
                        inset
                        class="field mx-3 switch mt-0 pt-0"
                        :disabled="!typesFound.includes('triangle')"
                        @change="drawGraph($event)"
                      />
                      <div class="triangle mb-3 mr-5" /> Policy
                    </v-row>
                    <v-row class="pl-2">
                      <v-switch
                        v-model="legend.types.diamond"
                        inset
                        class="field mx-3 switch mt-0 pt-0"
                        :disabled="!typesFound.includes('diamond')"
                        @change="drawGraph($event)"
                      />
                      <div class="diamond mb-3 mr-3" /> Collection
                    </v-row>
                  </v-container>
                  <span>Click on any point to re-draw the graph with that point as the centre. Click on the centre to view the record.</span>
                </v-col>
              </v-row>
              <v-divider />
              <!-- Color definition meaning in NetworkGraph -->
              <p class="ma-0">
                Color definition and meaning in NetworkGraph
              </p>
              <v-row no-gutters>
                <v-container
                  fluid
                  class="pl-4"
                >
                  <b
                    class="ready_color white--text d-flex align-center justify-center status_style mb-2"
                  >
                    ready
                  </b>
                  <b
                    class="deprecated_color white--text d-flex align-center justify-center status_style mb-2"
                  >
                    deprecated
                  </b>
                  <b
                    class="uncertain_color white--text d-flex align-center justify-center status_style mb-2"
                  >
                    uncertain
                  </b>
                  <b
                    class="dev_color white--text d-flex align-center justify-center status_style"
                  >
                    in Development
                  </b>
                </v-container>
              </v-row>
              <v-divider />
              <v-row v-if="initialized">
                <v-col
                  cols="12"
                  class="mt-0 pt-0 mb-0"
                >
                  <h4>Record Relationships</h4>
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
        xs="12"
        sm="12"
        md="12"
        lg="12"
        xl="9"
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
        <div id="networkGraph">
          <v-card
            v-if="noData"
            height="100%"
          >
            <v-card-title class="blue white--text">
              No graph data found!
            </v-card-title>
            <v-card-text class="pt-3">
              <v-container fluid>
                <v-row no-gutters>
                  <v-col cols="12">
                    <p>No data were found showing links between this record and others. This could be because:</p>
                    <ul style="list-style-type: square;">
                      <li>The record has just been created and the graph data are still being generated.</li>
                      <li>This record has no links to other records.</li>
                      <li>Something went wrong.</li>
                    </ul>
                    <p>If you need assistance, please <a href="mailto:contact@fairsharing.org">contact us</a>.</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import GraphClient from '@/lib/GraphClient/GraphClient.js'
    import graphQuery from '@/lib/GraphClient/queries/getGraphRelations.json'
    import Loaders from "../../components/Navigation/Loaders";
    import relationColors from "@/data/RelationsColors.json"
    import Highcharts from "highcharts"

    const graphClient = new GraphClient();

    export default {
        name: "NetworkGraph",
        components: {
          Loaders,
        },
        data () {
          let _module = this;
            return {
                loading: false,
                noData: false,
                initialized: false,
                depth: [1, 2, 3],
                registry: "unknown",
                type: "unknown",
                options: {
                    exporting: {
                        sourceWidth: 1502,
                        sourceHeight: 1600,
                        scale: 1,
                        filename: 'FAIRsharing-network-graph'
                    },
                    tooltip: {
                      enabled: false
                    },
                    chart: {
                        type: 'networkgraph',
                        //height: '62.8%',
                        height: '82.8%',
                        plotBorderWidth: 0,
                        plotShadow: true,
                        renderTo: 'networkGraph',
                        marginBottom: 2,
                        marginTop: 0,
                        plotBackgroundColor: "#FFFFFF",
                        animation: false,
                    },
                    title: {
                        text: 'FAIRsharing Network Graph',
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
                                enableSimulation: false,
                                linkLength: 60,
                                maxIterations: 120
                            },
                          enableMouseTracking: true,
                          findNearestPointBy: "xy"
                        },
                    },
                    series: [{
                        animation: false,
                        events: {
                          click: /* istanbul ignore next */  async function(event) {
                            // Avoid redundant navigation to self...
                            if (parseInt(_module.$route.params.id) == parseInt(event.point.record_id)) {
                              _module.$router.push({
                                path: "/" +  event.point.record_id
                              })
                            }
                            else {
                              _module.$router.push({
                                path: "/graph/" +  event.point.record_id
                              })
                            }
                          }
                        },
                        dataLabels: {
                            enabled: true,
                            linkFormat: '',
                            formatter: /* istanbul ignore next */ function() {
                                return (this.key.length < 30) ? this.key : this.key.substring(0, 30) + "..."
                            },
                            useHTML: true
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
                            linkOpacity: 0.05,
                          }
                        },
                        marker: {
                          states: {
                            inactive: {
                              opacity: 0.05,
                            }
                          }
                        },
                    }]
                },
                relations: null,
                relations_colors: relationColors,
                legend: {
                  relations: {},
                  types: {
                    circle: false,
                    square: false,
                    triangle: false,
                    diamond: false
                  }
                },
                typesFound: [],
                graphData: {},
                chart: null
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
        },
        async mounted() {
            this.$nextTick(async function () {
                await this.getData();
            })
        },
        methods: {
            async getData(){
                this.loading = true;
                this.legend.types = {
                    circle: false,
                    square: false,
                    triangle: false,
                    diamond: false
                }
                /* A maxPathLength of 1-4 may be specified (API's default is 2).
                 Higher values may make the resulting graph rather large... */
                graphQuery.queryParam = {id: parseInt(this.$route.params.id)};
                const response = await graphClient.executeQuery(graphQuery);
                //if (Object.entries(this.graphData).length === 0 || this.graphData.edges.length === 0) {
                if (response.fairsharingGraph === undefined ||
                    response.fairsharingGraph.edges === undefined ||
                    response.fairsharingGraph.edges.length === 0) {
                  this.loading = false;
                  this.noData = true;
                  this.registry = "N/A";
                  this.type = "N/A";
                  this.initialized = true;
                }
                else {
                  this.graphData = response.fairsharingGraph;
                  this.registry = this.graphData.registry;
                  this.type = this.graphData.type;
                  this.drawGraph(true)
                  this.loading = false;
                  this.initialized = true;
                }
            },
             updateNodeSymbol(node,index) {
              const DEFAULT_LINE_WIDTH = 10
              switch (node.status) {
                case 'ready':
                  node.marker = {
                    symbol: node.marker.symbol,
                    fillColor: this.$vuetify.theme.themes.light.ready_color,
                    lineColor: this.$vuetify.theme.themes.light.ready_color,
                    lineWidth: DEFAULT_LINE_WIDTH,
                  }
                  break;
                case 'in_development':
                  node.marker = {
                    symbol: node.marker.symbol,
                    fillColor: this.$vuetify.theme.themes.light.dev_color,
                    lineColor: this.$vuetify.theme.themes.light.dev_color,
                    lineWidth: DEFAULT_LINE_WIDTH,
                  }
                  break;
                case 'deprecated':
                  node.marker = {
                    symbol: node.marker.symbol,
                    fillColor: this.$vuetify.theme.themes.light.deprecated_color,
                    lineColor: this.$vuetify.theme.themes.light.deprecated_color,
                    lineWidth: DEFAULT_LINE_WIDTH,
                  }
                  break;
                case 'uncertain':
                  node.marker = {
                    symbol: node.marker.symbol,
                    fillColor: this.$vuetify.theme.themes.light.uncertain_color,
                    lineColor: this.$vuetify.theme.themes.light.uncertain_color,
                    lineWidth: DEFAULT_LINE_WIDTH,
                  }
                  break;
              }
              // If its the main central node make its marker red circle.
              if (index === 0) {
                node.marker = {
                  lineWidth: 15,
                  lineColor: "#ff0000",
                  fillColor: "#ff0000",
                }
              }
              // return the updated node
              return {
                content: node,
                marker: node.marker.symbol,
                children: {},
              }
            },
            drawGraph(start=false){
                let _module = this;
                this.typesFound = [];
                // TODO: This re-drawing of the graph could be moved to the server.
                // Its purpose is to re-draw when some nodes are removed, making sure that children are also removed.
                let raw_nodes = this.graphData.nodes,
                    raw_edges = this.graphData.edges,
                    tree = {},
                    nodes_processed = [],
                    edges = [],
                    nodes = []
                raw_nodes.forEach((node,index) => {
                  tree[node.id] = this.updateNodeSymbol(node,index)
                })
                raw_edges.forEach(edge => { tree[edge[0]].children[edge[1]] = edge });
                this.processNode(edges, tree, Object.keys(tree)[0], nodes, nodes_processed, start);
                this.legend.relations = {}
                edges.forEach(edge => {
                  if (Object.keys(this.relations_colors).includes(edge[2].toLowerCase())) {
                    edge.push(this.relations_colors[edge[2].toLowerCase()])
                    if (!(Object.keys(this.legend.relations).includes(this.relations_colors[edge[2].toLowerCase()]))) {
                      this.legend.relations[this.relations_colors[edge[2].toLowerCase()]] = edge[2]
                    }
                  }
                })
                this.options.plotOptions.networkgraph.layoutAlgorithm.linkLength = this.graphData.linkLength;
                this.options.plotOptions.networkgraph.layoutAlgorithm.maxIterations = this.graphData.maxIterations;
                this.options.series[0].nodes = nodes;
                this.options.series[0].data = edges;
                const rtype = "<br/>(" + _module.registry + "/" + _module.type + ")";
                this.options.subtitle.text = this.options.series[0].nodes[0].id + rtype;
                this.chart = new Highcharts.chart(this.options)

            },
            processNode(edges, tree, nodeID, outputNodes, nodes_processed, start){
              let node = tree[nodeID]
              /* istanbul ignore else */
              if (!nodes_processed.includes(nodeID)) {
                outputNodes.push(node.content)
                nodes_processed.push(nodeID)
                Object.keys(node.children).forEach(childName => {
                  const child = node.children[childName],
                        childNode = tree[childName]
                  if (start) this.legend.types[childNode.marker] = true;
                  /* istanbul ignore else */
                  if (!this.typesFound.includes(childNode.marker)) this.typesFound.push(childNode.marker)
                  if (this.legend.types[childNode.marker] || start) {
                    edges.push(child)
                    this.processNode(edges, tree, childName, outputNodes, nodes_processed, false)
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

.status_style {
  height: 25px;
  width: 100px;
}
</style>
