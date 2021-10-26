<template>
  <highcharts
    v-if="!loadingData"
    :options="sunburstOptions"
  />
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex"

export default {
  name: "OntologyStats",
  data() {
    return {
      options: {
        chart: {
          borderWidth: 0,
          borderColor: '#DD7920',
          backgroundColor: '#F9F9F9',
          margin: [80, 40, 40, 40],
          height: this.$vuetify.breakpoint.lgAndUp ? 1132 : 300
        },
        title: {
          text: 'Subject ontology drilldown',
          style: { color: '#DD7920' }
        },
        subtitle: { text: 'Click a term to drilldown the children terms' },
        series: [
          {
            colors: [
              'white', '#1aadce', '#492970', '#910000',
              'white', 'white', 'white', '#8bbc21'
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
                dataLabels: {
                  filter: {
                    property: 'outerArcLength',
                    operator: '>',
                    value: 64
                  }
                },
                levelSize: {
                  value: 2.3
                }
              },
              {
                level: 2,
                colorByPoint: true,
                levelSize: {
                  value: 3
                }
              },
              {
                level: 3,
                colorVariation: {
                  key: 'brightness',
                  to: -0.5
                },
                levelSize: {
                  value: 3
                }
              },
              {
                level: 4,
                colorVariation: {
                  key: 'brightness',
                  to: 0.2
                },
                levelSize: {
                  value: 3
                }
              },
              {
                level: 5,
                colorVariation: {
                  key: 'brightness',
                  to: 0.5
                },
                levelSize: {
                  value: 2
                }
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
            ],
            tooltip: {
              pointFormat: '{point.name} : ' +
                  '<br> Children terms: {point.descendants_count}' +
                  '<br> Number of records: {point.records_count}'
            }
          }
        ]
      }
    }
  },
  computed: {
    sunburstOptions () {
      const _client = this;
      let options = { ..._client.options }
      options.series[0].data = _client.sunburstData
      options.series[0].point = { events: { click: function () { _client.processEndOfTree(this) }}}
      return options
    },
    ...mapState("ontologyBrowser", ["sunburstData", "loadingData", "tree"])
  },
  methods: {
    processEndOfTree(node){
      if (node.descendants_count === 0) {
        let currentTerm = decodeURIComponent(this.$route.query.term) || null
        if (currentTerm && currentTerm !== node.name) {
          this.$router.push({path: this.$route.path, query: {term: encodeURIComponent(node.name)}})
        }
      }
      else {
        let ancestors = this.getAncestors()(node.identifier).concat(node.id)
        this.openTerms(ancestors)
      }
    },
    ...mapActions("ontologyBrowser", ["openTerms"]),
    ...mapGetters("ontologyBrowser", ["getAncestors"])
  }
}
</script>

<style scoped>

</style>
