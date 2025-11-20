<template>
  <v-container fluid>
    <div v-if="error">
      <NotFound />
    </div>
    <v-row v-else>
      <v-col cols="12" xs="12" sm="12" md="3" lg="3" xl="3" class="pt-0 mt-2">
        <v-card height="100%">
          <v-card-title class="bg-blue text-white">
            Legend and configuration
          </v-card-title>
          <v-card-text class="pt-3">
            <v-container fluid>
              <v-row no-gutters>
                <v-col cols="12">
                  The graph's centre is shown in
                  <span class="text-red">red.</span>
                </v-col>
                <v-col cols="12">
                  Click on any point to re-draw the graph with that point as the
                  centre. Click on the centre to view the record. Hover over to
                  view direct connections. Use the mouse/trackpad to scroll and
                  zoom.
                </v-col>
                <v-col cols="12">
                  For more information, please see the
                  <a
                    href="https://fairsharing.gitbook.io/fairsharing/about-our-records/network-graphs"
                    target="_blank"
                  >
                    documentation </a
                  >.
                </v-col>
              </v-row>
              <v-row no-gutters>
                <v-col cols="12">
                  Relations between records are coloured as follows:
                </v-col>
                <v-col cols="12">
                  <v-list density="compact">
                    <v-list-item
                      v-for="legendItem in networkGraph['legend']"
                      :key="legendItem['name']"
                    >
                      <v-avatar>
                        <v-icon :color="legendItem['color']">
                          fa fa-long-arrow-alt-right
                        </v-icon>
                      </v-avatar>
                      <v-list-item-title
                        class="font-weight-regular text-body-2"
                      >
                        {{ legendItem["name"] }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
              <v-divider />
              <!-- Color definition meaning in NetworkGraph -->
              <div>
                <h3 class="mb-4">Registry</h3>
                <v-row
                  no-gutters
                  :class="{
                    'd-flex justify-space-around': $vuetify.display.smOnly,
                  }"
                >
                  <v-col
                    cols="12"
                    xs="12"
                    sm="3"
                    md="12"
                    lg="12"
                    xl="12"
                    fluid
                    class="d-flex justify-center"
                    :class="
                      $vuetify.display.smOnly
                        ? 'flex-row align-center flex-grow-0 flex-shrink-1'
                        : 'flex-column'
                    "
                  >
                    <v-btn
                      v-for="registryItem in networkGraph['registry']"
                      :key="registryItem['name']"
                      class="status_style mx-3 mb-2"
                      :color="
                        registryItem['active'] ? registryItem['color'] : 'gray'
                      "
                      :class="[
                        $vuetify.display.xsOnly
                          ? 'full-width'
                          : 'button-filters',
                        registryItem['active'] ? 'text-white ' : 'black--text ',
                      ]"
                      :disabled="!buttonsActive"
                      @click="toggleClick(registryItem)"
                    >
                      {{ registryItem["name"] }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <v-divider />
              <div>
                <!-- Color definition meaning in NetworkGraph -->
                <h3 class="mb-4">Status (shown on mouseover)</h3>
                <v-row
                  no-gutters
                  :class="{
                    'd-flex justify-space-around': $vuetify.display.smOnly,
                  }"
                >
                  <v-col
                    cols="12"
                    xs="12"
                    sm="3"
                    md="12"
                    lg="12"
                    xl="12"
                    fluid
                    class="d-flex justify-center"
                    :class="
                      $vuetify.display.smOnly
                        ? 'flex-row align-center flex-grow-0 flex-shrink-1'
                        : 'flex-column'
                    "
                  >
                    <v-btn
                      v-for="status in networkGraph['status']"
                      :key="status['name']"
                      class="status_style mx-3 mb-2"
                      :color="status['active'] ? status['color'] : 'gray'"
                      :class="[
                        $vuetify.display.xsOnly
                          ? 'full-width'
                          : 'button-filters',
                        status['active'] ? 'text-white ' : 'black--text ',
                      ]"
                      :disabled="!buttonsActive"
                      @click="toggleClick(status)"
                    >
                      {{ status["name"] }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
              <v-divider />
              <div>
                <!-- buttons here -->
                <h3 class="mb-4">Distance from centre</h3>
                <v-row
                  no-gutters
                  :class="{
                    'd-flex justify-space-around': $vuetify.display.smOnly,
                  }"
                >
                  <v-col
                    cols="12"
                    xs="12"
                    sm="3"
                    md="12"
                    lg="12"
                    xl="12"
                    fluid
                    class="d-flex justify-center"
                    :class="
                      $vuetify.display.smOnly
                        ? 'flex-row align-center flex-grow-0 flex-shrink-1'
                        : 'flex-column'
                    "
                  >
                    <v-btn
                      v-for="distance in networkGraph['distance']"
                      :id="`distance_${distance['hops']}`"
                      :key="distance['name']"
                      class="status_style mx-3 mb-2"
                      :color="getLengthColour(distance['hops'])"
                      :class="[
                        $vuetify.display.xsOnly
                          ? 'full-width'
                          : 'button-filters',
                        distance['active'] ? 'text-white ' : 'black--text ',
                      ]"
                      :disabled="!buttonsActive"
                      @click="lengthLimit(distance)"
                    >
                      {{ distance["name"] }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" xs="12" sm="12" md="9" lg="9" xl="9" class="pt-0 mt-2">
        <v-btn class="ml-2 my-2 bg-white" :to="`/${$route.params.id}`">
          <v-icon :class="`text-primary`"> fa-arrow-left </v-icon>
          <span :class="`text-primary ml-3`"> Go to Record </span>
        </v-btn>
        <div v-if="noData">
          <v-card-title class="bg-blue text-white">
            No graph found!
          </v-card-title>
        </div>
        <div v-else>
          <v-card-title v-if="!loading" class="bg-blue text-white">
            {{ graphData.name }} ({{ graphData.id }})
          </v-card-title>
          <v-card-subtitle v-if="!loading" class="bg-blue text-white">
            {{ registry }}/{{ type }}
          </v-card-subtitle>
        </div>

        <v-card height="100%">
          <div v-if="noData" height="100%">
            <v-card-text class="pt-3">
              <v-container fluid>
                <v-row no-gutters>
                  <v-col cols="12">
                    <p>
                      No data were found showing links between this record and
                      others. This could be because:
                    </p>
                    <ul style="list-style-type: square">
                      <li>
                        The record has just been created and the graph data are
                        still being generated.
                      </li>
                      <li>This record has no links to other records.</li>
                      <li>Something went wrong.</li>
                    </ul>
                    <br />
                    <p>
                      If you need assistance, please
                      <a href="mailto:contact@fairsharing.org">contact us</a>.
                    </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </div>
          <div id="sigma-container" />
        </v-card>

        <v-fade-transition>
          <div>
            <v-overlay
              v-model="layoutRendering"
              :absolute="false"
              opacity="0.8"
              class="align-center justify-center"
            >
              <Loaders />
            </v-overlay>
          </div>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import FA2Layout from "graphology-layout-forceatlas2/worker";
import Sigma from "sigma";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";

import Loaders from "@/components/Navigation/Loaders";
import networkGraph from "@/data/networkGraph.json";
import relationColors from "@/data/RelationsColors.json";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import graphQuery from "@/lib/GraphClient/queries/getGraphRelations.json";
import NotFound from "@/views/Errors/404";

const graphClient = new GraphClient();
const graph = new Graph();
let container;
let renderer;

export default {
  name: "NetworkGraph",
  components: {
    Loaders,
    NotFound,
  },
  data() {
    return {
      error: false,
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
          diamond: false,
        },
      },
      typesFound: [],
      graphData: {},
      chart: null,
      cancelCurrentAnimation: null,
      sensibleSettings: null,
      fa2Layout: null,
      highlighted: 0, // ID of currently-hovered node.
      state: {},
      selectedLengths: {
        1: true,
        2: false,
        3: false,
      },
      active: {
        database: true,
        collection: true,
        standard: true,
        policy: true,
        fairassist: true,
        ready: true,
        in_development: true,
        uncertain: true,
        deprecated: true,
      },
      buttonsActive: false,
      networkGraph: networkGraph,
    };
  },
  computed: {
    currentRoute() {
      return this.target || this.$route.params["id"];
    },
    layoutRendering() {
      if (this.fa2Layout === undefined || this.fa2Layout === null) {
        return false;
      }
      return this.fa2Layout.isRunning();
    },
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
          await new Promise((r) => setTimeout(r, 2000));
          _module.fa2Layout.stop();
        }
        else {
          await new Promise((r) => setTimeout(r, 2000));
          _module.fa2Layout.stop();
        }
      },
      deep: true,
    },
    selectedLengths: {
      async handler() {
        let _module = this;
        if (!_module.fa2Layout.isRunning()) {
          _module.fa2Layout.start();
          await new Promise((r) => setTimeout(r, 2000));
          _module.fa2Layout.stop();
        }
        else {
          await new Promise((r) => setTimeout(r, 2000));
          _module.fa2Layout.stop();
        }
      },
      deep: true,
    },
  },
  async mounted() {
    let _module = this;
    this.$nextTick(async function() {
      await this.getData();
      if (_module.error) {
        return;
      }
      container = document.getElementById("sigma-container");
      if (_module.fa2Layout && _module.fa2Layout.isRunning()) {
        _module.fa2Layout.kill();
      }
      await _module.plotGraph();
    });
  },
  methods: {
    async getData() {
      this.loading = true;
      this.legend.types = {
        circle: false,
        square: false,
        triangle: false,
        diamond: false,
      };
      /* A maxPathLength of 1-3 may be specified (API's default is 2).
       Higher values may make the resulting graph rather large... */
      graphQuery.queryParam = { id: parseInt(this.$route.params.id) };
      const response = await graphClient.executeQuery(graphQuery);
      //Check if response is array format
      if (
        Array.isArray(response) &&
        response[0].message === "record not found"
      ) {
        this.error = true;
      }
      //response is in object format
      else if (
        response.fairsharingGraph === undefined ||
        response.fairsharingGraph.data === undefined ||
        response.fairsharingGraph.data.length === 0 ||
        Object.keys(response.fairsharingGraph.data).length === 0
      ) {
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
    async plotGraph() {
      let _module = this;
      graph.clear();
      graph.import(this.graphData);

      // Graphology implementation of Force Atlas 2 in a web worker
      _module.sensibleSettings = forceAtlas2.inferSettings(graph);
      _module.fa2Layout = new FA2Layout(graph, {
        iterations: 50,
        settings: _module.sensibleSettings,
      });

      // eslint-disable-next-line no-unused-vars
      renderer = new Sigma(graph, container, {
        allowInvalidContainer: true,
        nodeProgramClasses: {
          image: getNodeProgramImage(),
        },
      });
      _module.fa2Layout.start();

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

        // This is for hiding everything except the node being hovered over.
        if (
          _module.state.hoveredNeighbors &&
          !_module.state.hoveredNeighbors.has(node) &&
          _module.state.hoveredNode !== node
        ) {
          if (parseInt(node) !== parseInt(_module.$route.params.id)) {
            res.hidden = true;
          }
        }

        if (_module.state.selectedNode === node) {
          _module.res.highlighted = true;
        }

        // Hide nodes which are further away than the path length.
        if (_module.selectedLengths[res.length] === false) {
          res.hidden = true;
        }

        // Hide nodes when their registry is not selected
        if (
          !this.active[res.registry] &&
          parseInt(_module.$route.params.id) !== parseInt(node)
        ) {
          res.hidden = true;
        }

        // Hide nodes when their status is not selected
        if (
          !this.active[res.status] &&
          parseInt(_module.$route.params.id) !== parseInt(node)
        ) {
          res.hidden = true;
        }

        return res;
      });

      // This is for hiding everything except the node being hovered over.
      renderer.setSetting("edgeReducer", (edge, data) => {
        const res = { ...data };
        if (
          _module.state.hoveredNode &&
          !graph.hasExtremity(edge, _module.state.hoveredNode)
        ) {
          res.hidden = true;
        }
        return res;
      });

      // This is to link to another record's graph.
      renderer.on("clickNode", ({ node }) => {
        this.setClickedNode(node);
      });

      renderer.refresh();

      await new Promise((r) => setTimeout(r, 10000));
      _module.fa2Layout.stop();
      _module.buttonsActive = true;
    },
    setClickedNode(node) {
      // node is the fairsharing_record_id
      // TODO: This window.location.assign hackery is not great, but does at least cause
      // TODO: the correct graph to load and render.
      let _module = this;
      if (parseInt(_module.$route.params.id) === parseInt(node)) {
        this.loading = true;
        window.location.assign("/" + node);
        //this.loading = false;
      }
      else {
        this.loading = true;
        window.location.assign("/graph/" + node);
        //this.loading = false;
      }
    },
    lengthLimit(item) {
      const itemLength = item.hops;
      this.selectedLengths[itemLength] = !this.selectedLengths[itemLength];
      item.active = !item.active;
    },
    getLengthColour(len) {
      if (this.selectedLengths[len] === true) {
        return "#27aae1";
      }
      else {
        return "gray";
      }
    },
    toggleClick(item) {
      let itemName = item.name.toLowerCase();
      if (itemName === "in development") itemName = "in_development";
      this.active[itemName] = !this.active[itemName];
      item.active = !item.active;
    },
  },
};
</script>

<style scoped lang="scss">
#sigma-container {
  width: 100%;
  height: 100%;
  min-height: 1000px;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.button-filters {
  width: 150px;
}
</style>
