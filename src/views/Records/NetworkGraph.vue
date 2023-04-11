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
                  The graph's centre is shown in <span class="red--text">red.</span>
                </v-col>
                <v-col cols="12">
                  Click on any point to re-draw the graph with that point as the centre. 
                  Click on the centre to view the record. Hover over to view direct connections. Use the mouse/trackpad
                  to scroll and zoom.
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12">
                  Relations between records are coloured as follows:
                </v-col>
                <v-col cols="12">
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="red">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-list-item-icon>
                      Deprecates
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="orange">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-list-item-icon>
                      Recommends
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="#e6e600">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-list-item-icon>
                      Collects
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="green">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-list-item-icon>
                      Profiles
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="blue">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-list-item-icon>
                      Accepts
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="indigo">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-list-item-icon>
                      Outputs
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="#9966ff">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-list-item-icon>
                      Shares code with
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="#993300">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-list-item-icon>
                      Shares data with
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="#ff99ff">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-list-item-icon>
                      Implements
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="black">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-list-item-icon>
                      Extends
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon color="grey">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-list-item-icon>
                      Related to
                    </v-list-item>
                  </v-list>
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
                  <v-btn
                    class="white--text d-flex align-center justify-center status_style mb-2"
                    :color="active['collection'] ? '#A37146' : 'gray' "
                    style="width: 150px;"
                    :disabled="!buttonsActive"
                    @click="toggleRegistry('collection')"
                  >
                    Collection
                  </v-btn>
                  <v-btn
                    class="white--text d-flex align-center justify-center status_style mb-2"
                    :color="active['database'] ? '#4678A3' : 'gray' "
                    style="width: 150px;"
                    :disabled="!buttonsActive"
                    @click="toggleRegistry('database')"
                  >
                    Database
                  </v-btn>
                  <v-btn
                    class="white--text d-flex align-center justify-center status_style mb-2"
                    :color="active['standard'] ? '#29AE9E' : 'gray' "
                    style="width: 150px;"
                    :disabled="!buttonsActive"
                    @click="toggleRegistry('standard')"
                  >
                    Standard
                  </v-btn>
                  <v-btn
                    class="white--text d-flex align-center justify-center status_style"
                    :color="active['policy'] ? '#A046A3' : 'gray' "
                    style="width: 150px;"
                    :disabled="!buttonsActive"
                    @click="toggleRegistry('policy')"
                  >
                    Policy
                  </v-btn>
                </v-container>
              </v-row>
              <v-divider />
              <!-- Color definition meaning in NetworkGraph -->
              <p class="ma-0">
                Status (shown on mouseover)
              </p>
              <v-row no-gutters>
                <v-container
                  fluid
                  class="pl-4"
                >
                  <v-btn
                    class="d-flex align-center justify-center status_style mb-2"
                    :color="active['ready'] ? '#27aae1' : 'gray' "
                    style="width: 150px;"
                    :disabled="!buttonsActive"
                    @click="toggleStatus('ready')"
                  >
                    Ready
                  </v-btn>
                  <v-btn
                    class="d-flex align-center justify-center status_style mb-2"
                    :color="active['in_development'] ? '#27aae1' : 'gray' "
                    style="width: 150px;"
                    :disabled="!buttonsActive"
                    @click="toggleStatus('in_development')"
                  >
                    In development
                  </v-btn>
                  <v-btn
                    class="d-flex align-center justify-center status_style mb-2"
                    :color="active['uncertain'] ? '#27aae1' : 'gray' "
                    style="width: 150px;"
                    :disabled="!buttonsActive"
                    @click="toggleStatus('uncertain')"
                  >
                    Uncertain
                  </v-btn>
                  <v-btn
                    class="d-flex align-center justify-center status_style"
                    :color="active['deprecated'] ? '#27aae1' : 'gray' "
                    style="width: 150px;"
                    :disabled="!buttonsActive"
                    @click="toggleStatus('deprecated')"
                  >
                    Deprecated
                  </v-btn>
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
                    :disabled="!buttonsActive"
                    @click="lengthLimit(1)"
                  >
                    One hop
                  </v-btn>
                  <v-btn
                    id="distance_2"
                    class="d-flex align-center justify-center status_style mb-2 pa-2"
                    style="width: 150px;"
                    :color="getLengthColour(2)"
                    :disabled="!buttonsActive"
                    @click="lengthLimit(2)"
                  >
                    Two hops
                  </v-btn>
                  <v-btn
                    id="distance_3"
                    class="d-flex align-center justify-center status_style pa-2"
                    style="width: 150px;"
                    :color="getLengthColour(3)"
                    :disabled="!buttonsActive"
                    @click="lengthLimit(3)"
                  >
                    Three hops
                  </v-btn>
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
        <v-btn
          class="ml-2 my-2 white"
          :to="`/${$route.params.id}`"
        >
          <v-icon :class="`primary--text`">
            fa-arrow-left
          </v-icon>
          <span :class="`primary--text ml-3`"> Go to Record </span>
        </v-btn>
        <v-chip
          v-if="layoutRendering"
          class="ma-2"
          color="red"
          text-color="white"
        >
          Rendering
        </v-chip>
        <div v-if="noData">
          <v-card-title class="blue white--text"> 
            No graph found!
          </v-card-title>
        </div>
        <div v-else>
          <v-card-title 
            v-if="!loading"
            class="blue white--text"
          >
            {{ graphData.name }} ({{ graphData.id }})
          </v-card-title>
          <v-card-subtitle
            v-if="!loading"
            class="blue white--text"
          >
            {{ registry }}/{{ type }}
          </v-card-subtitle>
        </div>

        <v-card
          height="100%"
        >
          <div
            v-if="noData"
            height="100%"
          >
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
                    <br>
                    <p>If you need assistance, please <a href="mailto:contact@fairsharing.org">contact us</a>.</p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </div>
          <div
            id="sigma-container"
          />
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
    import relationColors from "@/data/RelationsColors.json"
    import Loaders from "@/components/Navigation/Loaders"
    import * as d3 from "d3"

    const graphClient = new GraphClient();

    //let container;

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
              selectedLength: 1,
              active: {
                database: true,
                collection: true,
                standard: true,
                policy: true,
                ready: true,
                in_development: true,
                uncertain: true,
                deprecated: true
              },
              buttonsActive: false
            }
        },
        computed: {
          currentRoute() {
            return this.target || this.$route.params['id'];
          },
          layoutRendering() {
            if (this.fa2Layout === undefined || this.fa2Layout === null) {
              return false
            }
            return this.fa2Layout.isRunning();
          }
        },
        watch: {
          async currentRoute() {
            await this.getData();
          },
          active: {
            async handler() {
              let _module = this;
              if (!_module.fa2Layout.isRunning()) {
                _module.fa2Layout.start();
                await new Promise(r => setTimeout(r, 1000));
                _module.fa2Layout.stop();
              }
              else {
                await new Promise(r => setTimeout(r, 1000));
                _module.fa2Layout.stop();
              }
            },
            deep: true
          },
          selectedLength: {
            async handler() {
              let _module = this;
              if (!_module.fa2Layout.isRunning()) {
                _module.fa2Layout.start();
                await new Promise(r => setTimeout(r, 1000));
                _module.fa2Layout.stop();
              }
              else {
                await new Promise(r => setTimeout(r, 1000));
                _module.fa2Layout.stop();
              }
            }
          }
        },
        async mounted() {
          let _module = this;
          this.$nextTick(async function () {
            await this.getData();
            //container = document.getElementById("sigma-container");
            if (_module.fa2Layout && _module.fa2Layout.isRunning()) {
              _module.fa2Layout.kill();
            }
            _module.plotGraph();
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
                    response.fairsharingGraph.data.length === 0 ||
                    Object.keys(response.fairsharingGraph.data).length === 0) {
                  this.loading = false;
                  this.noData = true;
                  this.registry = "N/A";
                  this.type = "N/A";
                  this.initialized = true;
                }
                else {
                  this.graphData = response.fairsharingGraph.data;
                  this.loading = false;
                  this.registry = this.graphData.registry;
                  this.type = this.graphData.type;
                }
            },
            async plotGraph(){
              let _module = this;
              //console.log(JSON.stringify(_module.graphData));
              let nodes = _module.graphData.nodes;
              console.log("NODES: " + JSON.stringify(nodes));
              let links = _module.graphData.edges;
              console.log("LINKS: " + JSON.stringify(links));
              let graph = _module.ForceGraph(nodes, links);
              console.log(graph);

            },
            ForceGraph({
                nodes, // an iterable of node objects (typically [{id}, …])
                links // an iterable of link objects (typically [{source, target}, …])
              }, {
                  nodeId = d => d.id, // given d in nodes, returns a unique identifier (string)
                  nodeGroup, // given d in nodes, returns an (ordinal) value for color
                  nodeGroups, // an array of ordinal values representing the node groups
                  nodeTitle, // given d in nodes, a title string
                  nodeFill = "currentColor", // node stroke fill (if not using a group color encoding)
                  nodeStroke = "#fff", // node stroke color
                  nodeStrokeWidth = 1.5, // node stroke width, in pixels
                  nodeStrokeOpacity = 1, // node stroke opacity
                  nodeRadius = 5, // node radius, in pixels
                  nodeStrength,
                  linkSource = ({source}) => source, // given d in links, returns a node identifier string
                  linkTarget = ({target}) => target, // given d in links, returns a node identifier string
                  linkStroke = "#999", // link stroke color
                  linkStrokeOpacity = 0.6, // link stroke opacity
                  linkStrokeWidth = 1.5, // given d in links, returns a stroke width in pixels
                  linkStrokeLinecap = "round", // link stroke linecap
                  linkStrength,
                  colors = d3.schemeTableau10, // an array of color strings, for the node groups
                  width = 640, // outer width, in pixels
                  height = 400, // outer height, in pixels
                  invalidation // when this promise resolves, stop the simulation
              } = {}) {
          // Compute values.
          const N = d3.map(nodes, nodeId).map(intern);
          const LS = d3.map(links, linkSource).map(intern);
          const LT = d3.map(links, linkTarget).map(intern);
          if (nodeTitle === undefined) nodeTitle = (_, i) => N[i];
          const T = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
          const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);
          const W = typeof linkStrokeWidth !== "function" ? null : d3.map(links, linkStrokeWidth);
          const L = typeof linkStroke !== "function" ? null : d3.map(links, linkStroke);

          // Replace the input nodes and links with mutable objects for the simulation.
          nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
          links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i]}));

          // Compute default domains.
          if (G && nodeGroups === undefined) nodeGroups = d3.sort(G);

          // Construct the scales.
          const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

          // Construct the forces.
          const forceNode = d3.forceManyBody();
          const forceLink = d3.forceLink(links).id(({index: i}) => N[i]);
          if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
          if (linkStrength !== undefined) forceLink.strength(linkStrength);

          const simulation = d3.forceSimulation(nodes)
              .force("link", forceLink)
              .force("charge", forceNode)
              .force("center",  d3.forceCenter())
              .on("tick", ticked);

          const svg = d3.create("svg")
              .attr("width", width)
              .attr("height", height)
              .attr("viewBox", [-width / 2, -height / 2, width, height])
              .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

          const link = svg.append("g")
              .attr("stroke", typeof linkStroke !== "function" ? linkStroke : null)
              .attr("stroke-opacity", linkStrokeOpacity)
              .attr("stroke-width", typeof linkStrokeWidth !== "function" ? linkStrokeWidth : null)
              .attr("stroke-linecap", linkStrokeLinecap)
              .selectAll("line")
              .data(links)
              .join("line");

          const node = svg.append("g")
              .attr("fill", nodeFill)
              .attr("stroke", nodeStroke)
              .attr("stroke-opacity", nodeStrokeOpacity)
              .attr("stroke-width", nodeStrokeWidth)
              .selectAll("circle")
              .data(nodes)
              .join("circle")
              .attr("r", nodeRadius)
              .call(drag(simulation));

          if (W) link.attr("stroke-width", ({index: i}) => W[i]);
          if (L) link.attr("stroke", ({index: i}) => L[i]);
          if (G) node.attr("fill", ({index: i}) => color(G[i]));
          if (T) node.append("title").text(({index: i}) => T[i]);
          if (invalidation != null) invalidation.then(() => simulation.stop());

          function intern(value) {
              return value !== null && typeof value === "object" ? value.valueOf() : value;
          }

          function ticked() {
              link
                  .attr("x1", d => d.source.x)
                  .attr("y1", d => d.source.y)
                  .attr("x2", d => d.target.x)
                  .attr("y2", d => d.target.y);

              node
                  .attr("cx", d => d.x)
                  .attr("cy", d => d.y);
          }

          function drag(simulation) {
              function dragstarted(event) {
                  if (!event.active) simulation.alphaTarget(0.3).restart();
                  event.subject.fx = event.subject.x;
                  event.subject.fy = event.subject.y;
              }

              function dragged(event) {
                  event.subject.fx = event.x;
                  event.subject.fy = event.y;
              }

              function dragended(event) {
                  if (!event.active) simulation.alphaTarget(0);
                  event.subject.fx = null;
                  event.subject.fy = null;
              }

              return d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended);
          }
          return Object.assign(svg.node(), {scales: {color}});
          },
            getLengthColour(length) {
                if (length) {
                    return 'green';
                }
                return 'red';
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
