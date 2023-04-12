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
            ref="chartdiv"
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
    import miserables from "./miserables.json"

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
              buttonsActive: false,
              nodesArray: [],
              linksArray: []
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
          async getData() {
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
            } else {
              this.graphData = response.fairsharingGraph.data;
              this.loading = false;
              this.registry = this.graphData.registry;
              this.type = this.graphData.type;
            }
          },
          getLengthColour(length) {
            if (length) {
              return 'green';
            }
            return 'red';
          },
          async plotGraph() {
            let _module = this;
            // console.log(JSON.stringify(_module.graphData));
            // let nodes = _module.graphData.nodes;
            // console.log("NODES: " + JSON.stringify(nodes));
            // let links = _module.graphData.edges;
            // console.log("LINKS: " + JSON.stringify(links));
            // let graph = _module.forceGraph(miserables.nodes, miserables.links);
            // console.log(graph);
            await _module.d3Graph(miserables.nodes, miserables.edges)
          },

          async d3Graph(nodes, links) {
            function getNodeColor(node) {
              return node.group === 1 ? 'red' : 'gray'
            }

            var width = window.innerWidth
            var height = window.innerHeight

            const divSelected = this.$refs.chartdiv;
            d3.select(divSelected).append("svg")
            var svg = d3.select(divSelected).append("svg")
            svg.attr('width', width).attr('height', height)

          // simulation setup with all forces
            var linkForce = d3
                .forceLink()
                .id(function (link) { return link.id })

            var simulation = d3
                .forceSimulation()
                .force('link', linkForce)
                .force('charge', d3.forceManyBody().strength(-120))
                .force('center', d3.forceCenter(width / 2, height / 2))

            var linkElements = svg.append("g")
                .attr("class", "links")
                .selectAll("line")
                .data(links)
                .enter().append("line")
                .attr("stroke-width", 1)
                .attr("stroke", "rgba(50, 50, 50, 0.2)")

            var nodeElements = svg.append("g")
                .attr("class", "nodes")
                .selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("r", 10)
                .attr("fill", getNodeColor)

            var textElements = svg.append("g")
                .attr("class", "texts")
                .selectAll("text")
                .data(nodes)
                .enter().append("text")
                .text(function (node) { return  node.id })
                .attr("font-size", 15)
                .attr("dx", 15)
                .attr("dy", 4)

            simulation.nodes(nodes).on('tick', () => {
              nodeElements
                  .attr('cx', function (node) { return node.x })
                  .attr('cy', function (node) { return node.y })
              textElements
                  .attr('x', function (node) { return node.x })
                  .attr('y', function (node) { return node.y })
              linkElements
                  .attr('x1', function (link) { return link.source.x })
                  .attr('y1', function (link) { return link.source.y })
                  .attr('x2', function (link) { return link.target.x })
                  .attr('y2', function (link) { return link.target.y })
            })

            simulation.force("link").links(links)
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
