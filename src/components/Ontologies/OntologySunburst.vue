<template>
  <highcharts
    v-if="!loadingData"
    :options="sunburstOptions"
  />
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"

export default {
  name: "OntologySunburst",
  data() {
    return {
      options: {
        chart: {
          borderWidth: 0,
          borderColor: '#DD7920',
          backgroundColor: '#F9F9F9',
          height: this.getWidth()
        },
        title: {
          text: 'Subject Browser',
          style: { color: '#DD7920', fontSize: '26px' }
        },
        subtitle: {
          text: 'Clicking a term will drilldown the children terms and adjust the levels in the left panel. ' +
              'If a term has no children it will display information about that term.',
          style: { fontSize: "18px" }
        },
        series: [
          {
            stickyTracking: false,
            turboThreshold: 2000,
            colors: [
              this.$vuetify.theme.themes.light.subject_topLevel_3,
              this.$vuetify.theme.themes.light.subject_topLevel_1,
              this.$vuetify.theme.themes.light.subject_topLevel_2,
              'white', 'white', 'white', 'white',
              this.$vuetify.theme.themes.light.subject_topLevel_3,
              "white"
            ],
            type: 'sunburst',
            allowDrillToNode: true,
            cursor: 'pointer',
            color: 'transparent',
            dataLabels: {
              format: '{point.name}',
              filter: {
                property: 'innerArcLength',
                operator: '>',
                value: 16
              },
              rotationMode: 'circular'
            },
            levels: [
              {
                level: 1,
                levelIsConstant: false,
                dataLabels: { filter: { property: 'outerArcLength', operator: '>', value: 64 } },
                levelSize: { value: 2.3  }
              },
              {
                level: 2,
                colorByPoint: true,
                levelSize: { value: 3  }
              },
              {
                level: 3,
                colorVariation: {  key: 'brightness', to: -0.5 },
                levelSize: { value: 3 }
              },
              {
                level: 4,
                colorVariation: { key: 'brightness', to: 0.2 },
                levelSize: { value: 3 }
              },
              {
                level: 5, colorVariation: { key: 'brightness', to: 0.5 },
                levelSize: { value: 2 }
              },
              {
                level: 6,
                colorVariation: {
                  key: 'brightness',
                  to: 0.2
                }
              },
              {
                level: 7,
                colorVariation: {
                  key: 'brightness',
                  to: 0.5
                }
              },
              {
                level: 8,
                colorVariation: {
                  key: 'brightness',
                  to: 0.5
                }
              }
            ]
          }
        ],
        tooltip: {
          hideDelay: 1,
          followPointer: true,
          useHTML: true,
          backgroundColor: "white"
        },
        exporting: {
          sourceWidth: 1500,
          sourceHeight: 1600,
          scale: 1,
          filename: 'SRAO-Sunburst'
        }
      }
    }
  },
  computed: {
    sunburstOptions () {
      const _client = this;
      let options = { ..._client.options }
      options.series[0].data = _client.sunburstData
      /* istanbul ignore next */
      options.series[0].point = { events: { click: function () { _client.processClickEvent(this) }}}
      /* istanbul ignore next */
      options.tooltip.formatter = function() { return _client.getTooltip(this.point) }
      return options
    },
    ...mapState("ontologyBrowser", ["sunburstData", "loadingData", "tree"])
  },
  methods: {
    processClickEvent(node) {
      if (node.descendants_count === 0) {
        let currentTerm = this.$route.query.term ? decodeURIComponent(this.$route.query.term) : null
        if (!currentTerm || currentTerm !== node.name) {
          this.$router.push({path: this.$route.path, query: {term: encodeURIComponent(node.name)}})
        }
      }
      else {
        if (node.name !== "Subject") {
          let ancestors = this.getAncestors()(node.identifier)
          if (node['innerArcLength'] === 0) ancestors = ancestors.concat(node.id)
          this.openTerms(ancestors)
        }
      }
    },
    getWidth() { return (this.$vuetify.breakpoint.xlOnly) ? "60%" : "100%" },
    getTooltip(point) {
      return (point.name === "Subjects") ? false : '<div class="HC-tooltip">' + point.name  + '</div>'
    },
    ...mapActions("ontologyBrowser", ["openTerms"]),
    ...mapGetters("ontologyBrowser", ["getAncestors"])
  }
}
</script>

<style>
  .HC-tooltip {
    min-width: 100px;
    text-align: justify;
    font-size: 20px ;
  }
</style>
