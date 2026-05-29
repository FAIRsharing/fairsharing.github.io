<template>
  <div class="highcharts-wrapper">
    <ClientOnly>
      <highcharts
        v-if="!loadingData && isBrowser && modulesReady"
        :options="sunburstOptions"
      />
    </ClientOnly>
  </div>
</template>

<script>
import { ClientOnly } from "vike-vue/ClientOnly";
import { defineAsyncComponent } from "vue";
import { mapActions, mapGetters, mapState } from "vuex";
import { useTheme } from "vuetify";

export default {
  name: "OntologySunburst",
  components: {
    ClientOnly,
    highcharts: defineAsyncComponent(() =>
      import("highcharts-vue").then(
        (module) => module.Chart || module.default.Chart || module,
      ),
    ),
  },
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
      isBrowser: false,
      modulesReady: false,
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
        credits: { enabled: false },
        breadcrumbs: { enabled: false },
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
                .subject_topLevel_3,
              "white",
              "white",
              this.theme.computedThemes.value.fairSharingTheme.colors
                .subject_topLevel_1,
              "white",
              "white",
              "white",
              this.theme.computedThemes.value.fairSharingTheme.colors
                .subject_topLevel_2,
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
              { level: 2, colorByPoint: true, levelSize: { value: 3 } },
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
              { level: 6, colorVariation: { key: "brightness", to: 0.2 } },
              { level: 7, colorVariation: { key: "brightness", to: 0.5 } },
              { level: 8, colorVariation: { key: "brightness", to: 0.5 } },
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
        enabled: true,
        sourceWidth: 1500,
        sourceHeight: 1600,
        scale: 1,
        filename: "FAIRsharing Subject Sunburst",
        buttons: { contextButton: {} },
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
      options.series[0].point = {
        events: {
          click: function () {
            _client.processClickEvent(this);
          },
        },
      };
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
  async mounted() {
    if (typeof window !== "undefined") {
      this.isBrowser = true;

      // Await module initialization
      const { default: Highcharts } = await import("highcharts");
      const { default: Sunburst } = await import("highcharts/modules/sunburst");
      const { default: Exporting } = await import(
        "highcharts/modules/exporting"
      );

      if (typeof Sunburst === "function") {
        Sunburst(Highcharts);
      } else if (Sunburst && typeof Sunburst.default === "function") {
        Sunburst.default(Highcharts);
      }

      if (typeof Exporting === "function") {
        Exporting(Highcharts);
      } else if (Exporting && typeof Exporting.default === "function") {
        Exporting.default(Highcharts);
      }

      //Flip flag strictly AFTER modules attach to Highcharts
      this.modulesReady = true;
    }

    if (this.tree) {
      this.flattenedOriginalTree(this.tree);
    }
  },
  methods: {
    flattenedOriginalTree(tree) {
      if (!tree || !Array.isArray(tree)) return;
      tree.forEach((item) => {
        this.subjectsArrList.push(item);
        if (item["children"] && item["children"].length) {
          this.flattenedOriginalTree(item["children"]);
        }
      });
    },
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

        if (node["ancestors"] && !node["ancestors"].length) {
          this.$emit("subjectNode", []);
        } else {
          if (this.nodeClicked !== node["identifier"]) {
            this.nodeClicked = node["identifier"];
          } else {
            let nodeAncestor = node["ancestors"].pop();
            this.nodeClicked = nodeAncestor;
          }

          let selectedSubject = this.subjectsArrList.filter(
            (n) => n.identifier === this.nodeClicked,
          );

          if (
            selectedSubject[0] &&
            selectedSubject[0]["children"] &&
            selectedSubject[0]["children"].length
          ) {
            selectedSubject[0]["hasChildren"] = true;
            selectedSubject[0]["isSunburst"] = true;
          }

          if (selectedSubject[0]) {
            this.$emit("subjectNode", selectedSubject);
          }
        }
      }
    },
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
