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
                  Important note: This feature is not yet ready for change requests.
                </v-col>
                <v-col cols="12">
                  The graph's centre is shown in <span class="red--text">red.</span>
                </v-col>
                <v-col cols="12">
                  Click on any point to re-draw the graph with that point as the centre. 
                  Click on the centre to view the record. Hover over to view direct connections. Use the mouse/trackpad
                  to scroll and zoom.
                </v-col>
              </v-row>
              <v-divider />
              <!-- Color definition meaning in NetworkGraph -->
              <p class="ma-0">
                Registry
              </p>
              <v-row no-gutters>
                <v-container
                  fluid
                  class="pl-4"
                >
                  <v-chip
                    class="white--text d-flex align-center justify-center status_style mb-2"
                    color="orange"
                    style="width: 150px;"
                  >
                    Collection
                  </v-chip>
                  <v-chip
                    class="white--text d-flex align-center justify-center status_style mb-2"
                    color="yellow"
                    style="width: 150px;"
                  >
                    Database
                  </v-chip>
                  <v-chip
                    class="white--text d-flex align-center justify-center status_style mb-2"
                    color="green"
                    style="width: 150px;"
                  >
                    Standard
                  </v-chip>
                  <v-chip
                    class="white--text d-flex align-center justify-center status_style"
                    color="blue"
                    style="width: 150px;"
                  >
                    Policy
                  </v-chip>
                </v-container>
              </v-row>
              <v-divider />
              <!-- buttons here -->
              <p class="ma-0">
                Distance from centre
              </p>
              <v-row no-gutters>
                <v-container
                  fluid
                  class="pl-4"
                >
                  <!--
                  <v-btn
                    id="distance_0"
                    class="d-flex align-center justify-center status_style mb-2 pa-2"
                    style="width: 150px;"
                    :color="getLengthColour(0)"
                    @click="lengthLimit(0)"
                  >
                    Centre only (0)
                  </v-btn>
                  -->
                  <v-btn
                    id="distance_1"
                    class="d-flex align-center justify-center status_style mb-2 pa-2"
                    style="width: 150px;"
                    :color="getLengthColour(1)"
                    @click="lengthLimit(1)"
                  >
                    Adjacent (1)
                  </v-btn>
                  <v-btn
                    id="distance_2"
                    class="d-flex align-center justify-center status_style mb-2 pa-2"
                    style="width: 150px;"
                    :color="getLengthColour(2)"
                    @click="lengthLimit(2)"
                  >
                    Neighbours (2)
                  </v-btn>
                  <!--
                  <v-btn
                    id="distance_3"
                    class="d-flex align-center justify-center status_style pa-2"
                    style="width: 150px;"
                    :color="getLengthColour(3)"
                    @click="lengthLimit(3)"
                  >
                    Distant (3)
                  </v-btn>
                  -->
                </v-container>
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
        <v-card-title class="blue white--text">
          Relation graph for: {{ graphData.name }} ({{ graphData.id }})
        </v-card-title>
        <v-card
          v-if="loading"
          height="100%"
        >
          <v-card-text class="text-center blue--text body-1">
            Loading your data
          </v-card-text>
          <Loaders />
        </v-card>
        
        <v-card
          v-else
          height="100%"
        >
          <div id="sigma-container" />
        </v-card>
        
        <v-fade-transition>
          <v-overlay
            v-if="loading"
            :absolute="false"
            opacity="0.8"
          >
            <Loaders />
          </v-overlay>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    import GraphClient from '@/lib/GraphClient/GraphClient.js'
    import graphQuery from '@/lib/GraphClient/queries/getGraphRelations.json'
    //import Loaders from "../../components/Navigation/Loaders";
    import relationColors from "@/data/RelationsColors.json"
    import Loaders from "@/components/Navigation/Loaders";
    import Graph from "graphology";
    import Sigma from "sigma";
    import FA2Layout from "graphology-layout-forceatlas2/worker";
    import forceAtlas2 from "graphology-layout-forceatlas2";
    import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";


    const graphClient = new GraphClient();
    const graph = new Graph();
    let container;
    let renderer;

    export default {
        name: "NetworkGraph",
        components: {
          Loaders,
        },
        data () {
          return {
              loading: false,
              noData: false,
              initialized: false,
              depth: [1, 2, 3],
              registry: "unknown",
              type: "unknown",
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
              chart: null,
              cancelCurrentAnimation: null,
              sensibleSettings: null,
              fa2Layout: null,
              highlighted: 0, // ID of currently-hovered node.
              state: {},
              selectedLength: 2
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
              container = document.getElementById("sigma-container");
              this.plotGraph();
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
                /* A maxPathLength of 1-3 may be specified (API's default is 2).
                 Higher values may make the resulting graph rather large... */
                graphQuery.queryParam = {id: parseInt(this.$route.params.id)};
                const response = await graphClient.executeQuery(graphQuery);
                if (response.fairsharingGraph === undefined ||
                    response.fairsharingGraph.data === undefined ||
                    response.fairsharingGraph.data.length === 0) {
                  this.loading = false;
                  this.noData = true;
                  this.registry = "N/A";
                  this.type = "N/A";
                  this.initialized = true;
                }
                else {
                  this.graphData = response.fairsharingGraph.data;
                  this.loading = false;
                  /*
                  this.registry = this.graphData.registry;
                  this.type = this.graphData.type;
                  this.drawGraph(true)
                  this.initialized = true;
                   */
                }
            },
            async plotGraph(){
              let _module = this;
              try {
                graph.import(this.graphData);
                // eslint-disable-next-line no-empty
              }
              catch {
                // graph has presumably been loaded already...
                // Reloading the page like this to re-draw the graph is a dreadful hack.
                // TODO: Something better is needed here.
                this.$router.go();
              }

              // Graphology provides a easy to use implementation of Force Atlas 2 in a web worker
              _module.sensibleSettings = forceAtlas2.inferSettings(graph);
              _module.fa2Layout = new FA2Layout(graph, {
                settings: _module.sensibleSettings,
              });

              // eslint-disable-next-line no-unused-vars
              renderer = new Sigma(
                  graph,
                  container,
                  {
                    allowInvalidContainer: true,
                    nodeProgramClasses: {
                      image: getNodeProgramImage()
                    },
                  });
              this.fa2Layout.start();


              // Attempt to highlight nodes on hover...
              renderer.on("enterNode", ({ node }) => {
                _module.state.hoveredNode = node;
                _module.state.hoveredNeighbors = new Set(graph.neighbors(node));
                renderer.refresh();
              });
              renderer.on("leaveNode", () => {
                _module.state.hoveredNode = undefined;
                _module.state.hoveredNeighbors = undefined;
                renderer.refresh();
              });
              renderer.setSetting("nodeReducer", (node, data) => {
                const res = { ...data };

                if (
                    _module.state.hoveredNeighbors &&
                    !_module.state.hoveredNeighbors.has(node) &&
                    _module.state.hoveredNode !== node
                ) {
                  if (parseInt(node) !== parseInt(_module.$route.params.id))
                  {
                    /*
                    res.label = "";
                    res.color = "#f6f6f6";
                     */
                    res.hidden = true;
                  }
                }

                if (_module.state.selectedNode === node) {
                  _module.res.highlighted = true;
                }
                return res;
              });

              renderer.setSetting("edgeReducer", (edge, data) => {
                const res = { ...data };
                if (_module.state.hoveredNode && !graph.hasExtremity(edge, _module.state.hoveredNode)) {
                  res.hidden = true;
                }
                return res;
              });

              renderer.on("clickNode", ({ node }) => {
                this.setClickedNode(node);
              });

              renderer.refresh();
              await new Promise(r => setTimeout(r, 30000));
              this.fa2Layout.stop();
            },
            setClickedNode(node) {
              // node is the fairsharing_record_id
              let _module = this;
              if (parseInt(_module.$route.params.id) === parseInt(node)) {
                this.loading = true;
                // TODO: This requires two clicks to activate! Why?
                _module.$router.push({
                  path: "/" +  node
                })
                //this.loading = false;
              }
              else {
                this.loading = true;
                _module.$router.push({
                  path: "/graph/" +  node
                })
                //this.loading = false;
              }
            },
            lengthLimit(len) {
              let _module = this;
              renderer.setSetting("nodeReducer", (node, data) => {
                _module.selectedLength = len;
                const res = { ...data };

                if (res.length > len)
                {
                  res.hidden = true;
                }

                return res;
              });
            },
            getLengthColour(len) {
              if (len === this.selectedLength) {
                return "orange"
              }
              else {
                return "gray"
              }
            }
        }
    }
</script>

<style>
#sigma-container {
  width: 100%;
  height: 100%;
  min-height: 1000px;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

</style>
