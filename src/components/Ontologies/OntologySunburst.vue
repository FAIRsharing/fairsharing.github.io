<template>
  <highcharts v-if="!loadingData" :options="sunburstOptions" />
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import { useTheme } from "vuetify";
import Highcharts from "highcharts";
import Sunburst from "highcharts/modules/sunburst";
import Exporting from "highcharts/modules/exporting";

//Implement Sunburst module for Highcharts
// check if Sunburst is a function, if not try .default
if (typeof Sunburst === "function") {
  Sunburst(Highcharts);
} else if (typeof Sunburst.default === "function") {
  Sunburst.default(Highcharts);
}

if (typeof Exporting === "function") {
  Exporting(Highcharts);
} else if (typeof Exporting.default === "function") {
  Exporting.default(Highcharts);
}

export default {
  name: "OntologySunburst",
  props: {
    itemClicked: { default: null, type: Object },
  },
  emits: ["subjectNode"],
  setup() {
    const theme = useTheme();
    return { theme };
  },
  data() {
    return {
      options: {
        chart: {
          borderWidth: 0,
          borderColor: "#DD7920",
          backgroundColor: "#F9F9F9",
          height: "100%",
          style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
        },
        breadcrumbs: {
          enabled: false,
        },
        title: {
          text: "Subject Browser",
          style: { color: "#DD7920", fontSize: "26px", fontWeight: 500 },
        },
        subtitle: {
          text:
            "Clicking a term will drilldown the children terms and adjust the levels in the left panel. " +
            "If a term has no children it will display information about that term.",
          style: { fontSize: "18px" },
        },
        series: [
          {
            stickyTracking: false,
            turboThreshold: 2000,
            colors: [
              "white",
              this.theme.computedThemes.value.fairSharingTheme.colors
                .subject_topLevel_3, // here
              "white",
              "white",
              this.theme.computedThemes.value.fairSharingTheme.colors
                .subject_topLevel_1, // here
              "white",
              "white",
              "white",
              this.theme.computedThemes.value.fairSharingTheme.colors
                .subject_topLevel_2, // here
            ],
            type: "sunburst",
            allowDrillToNode: true,
            cursor: "pointer",
            color: "transparent",
            dataLabels: {
              format: "{point.name}",
              filter: {
                property: "innerArcLength",
                operator: ">",
                value: 16,
              },
              rotationMode: "circular",
            },
            levels: [
              {
                level: 1,
                levelIsConstant: false,
                dataLabels: {
                  filter: {
                    property: "outerArcLength",
                    operator: ">",
                    value: 64,
                  },
                },
                levelSize: { value: 2.3 },
              },
              {
                level: 2,
                colorByPoint: true,
                levelSize: { value: 3 },
              },
              {
                level: 3,
                colorVariation: { key: "brightness", to: -0.5 },
                levelSize: { value: 3 },
              },
              {
                level: 4,
                colorVariation: { key: "brightness", to: 0.2 },
                levelSize: { value: 3 },
              },
              {
                level: 5,
                colorVariation: { key: "brightness", to: 0.5 },
                levelSize: { value: 2 },
              },
              {
                level: 6,
                colorVariation: {
                  key: "brightness",
                  to: 0.2,
                },
              },
              {
                level: 7,
                colorVariation: {
                  key: "brightness",
                  to: 0.5,
                },
              },
              {
                level: 8,
                colorVariation: {
                  key: "brightness",
                  to: 0.5,
                },
              },
            ],
          },
        ],
        tooltip: {
          hideDelay: 1,
          followPointer: true,
          useHTML: true,
          backgroundColor: "white",
        },
        exporting: {
          sourceWidth: 1500,
          sourceHeight: 1600,
          scale: 1,
          filename: "SRAO-Sunburst",
        },
      },
      exporting: {
        enabled: true, // explicit enable
        sourceWidth: 1500,
        sourceHeight: 1600,
        scale: 1,
        filename: "SRAO-Sunburst",
        buttons: {
          contextButton: {
            // You can customize the menu symbol or position here if needed
            // symbol: 'menu',
            // align: 'right',
          },
        },
      },
      subjectsArrList: [],
      nodeClicked: "",
    };
  },
  computed: {
    sunburstOptions() {
      const _client = this;
      let options = { ..._client.options };
      options.series[0].data = _client.sunburstData;
      /* istanbul ignore next */
      options.series[0].point = {
        events: {
          click: function () {
            _client.processClickEvent(this);
          },
        },
      };
      /* istanbul ignore next */
      options.tooltip.formatter = function () {
        return _client.getTooltip(this.point);
      };
      return options;
    },
    ...mapState("ontologyBrowser", [
      "sunburstData",
      "loadingData",
      "tree",
      "flattenedTree",
    ]),
  },
  mounted() {
    this.flattenedOriginalTree(this.tree);
  },
  methods: {
    /**
     * Recursively flattens a hierarchical tree structure into a single array of nodes.
     * Each node is added to the `subjectsArrList` array. If a node has children,
     * the method is called recursively on the children.
     *
     * @param {Array<Object>} tree - The hierarchical tree structure to be flattened. Each node may have a `children` property containing an array of child nodes.
     * @return {void} This method does not return a value. It modifies the `subjectsArrList` array in place.
     */
    flattenedOriginalTree(tree) {
      tree.forEach((item) => {
        this.subjectsArrList.push(item);
        if (item["children"] && item["children"].length) {
          this.flattenedOriginalTree(item["children"]);
        }
      });
    },

    /**
     * Handles click events on a node and performs routing or emits a selected subject node to the parent component.
     *
     * @param {Object} node - The node object that was clicked. This object contains properties such as `descendants_count`,`name`, `identifier`, and `ancestors` which are used in processing the click event.
     * @return {void} This method does not return any value. It performs routing or emits an event based on the clicked node.
     */
    processClickEvent(node) {
      if (node.name !== "Subject") {
        if (node.descendants_count === 0) {
          let currentTerm = this.$route.query.term
            ? decodeURIComponent(this.$route.query.term)
            : null;
          if (!currentTerm || currentTerm !== node.name) {
            this.$router.push({
              path: this.$route.path,
              query: { term: encodeURIComponent(node.name) },
            });
          }
        }

        //If the node is clicked for the first time emit node, if the same node is clicked second time while it is active this means that node was already open.
        //Hence it's ancestor should be passed.
        if (node["ancestors"] && !node["ancestors"].length) {
          this.$emit("subjectNode", []);
        } else {
          if (this.nodeClicked !== node["identifier"]) {
            this.nodeClicked = node["identifier"];
          } else {
            let nodeAncestor = node["ancestors"].pop();
            this.nodeClicked = nodeAncestor;
          }

          //Filter the selected subject from the arrayList and emit to the parent component
          let selectedSubject = this.subjectsArrList.filter(
            (n) => n.identifier === this.nodeClicked,
          );

          //Adding key-value pair
          if (
            selectedSubject[0]["children"] &&
            selectedSubject[0]["children"].length
          ) {
            selectedSubject[0]["hasChildren"] = true;
            selectedSubject[0]["isSunburst"] = true;
          }

          this.$emit("subjectNode", selectedSubject);
        }
      }
    },

    /**
     * Get ToolTip
     * @param point
     * @return {boolean|string}
     */
    getTooltip(point) {
      return point.name === "Subjects"
        ? false
        : '<div class="HC-tooltip">' + point.name + "</div>";
    },
    ...mapActions("ontologyBrowser", ["openTerms"]),
    ...mapGetters("ontologyBrowser", ["getAncestors"]),
  },
};
</script>

<style>
.HC-tooltip {
  min-width: 100px;
  text-align: justify;
  font-size: 20px;
}

.highcharts-breadcrumbs-group,
.highcharts-button-traverse-up {
  display: none !important;
}
</style>
