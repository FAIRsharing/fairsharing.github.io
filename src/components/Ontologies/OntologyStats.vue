<template>
  <!-- TODO MAKE RECOMMENDED NO BUTTON GREY INSTEAD OF RED -->
  <v-container fluid>
    <v-row>
      <v-col
        xs="12"
        sm="12"
        md="12"
        lg="12"
        xl="5"
      >
        <v-container
          fluid
          class="pa-0"
        >
          <v-row>
            <v-col cols="12">
              <highcharts :options="pieOptions" />
            </v-col>
            <v-col cols="12">
              <highcharts :options="barOptions" />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
      <v-col
        xs="12"
        sm="12"
        md="12"
        lg="12"
        xl="7"
      >
        <v-container class="pa-0">
          <v-row>
            <v-col cols="12">
              <highcharts :options="sunburstOptions" />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "OntologyStats",
  props: { tree: { required: true, type: Array }},
  data() {
    return {
      options: {
        chart: {
          options3d:  {
            alpha: 45,
            beta: 0,
            enabled: true
          },
          borderWidth: 2,
          borderColor: '#DD7920',
          backgroundColor: '#FCEFE4',
          margin: [40, 20, 40, 20],
          height: 600
        },
        title: {
          text: 'Subject ontology drilldown',
          style: {
            color: '#DD7920'
          }
        },
        subtitle: {
          text: 'Click a term to drilldown the children terms'
        },
        accessibility: {
          announceNewData: {
            enabled: true
          },
          point: {
            valueSuffix: '%'
          }
        },
        plotOptions: {
          series: {
            dataLabels: {
              enabled: true,
              format: '{point.name}'
            },
            depth: 35
          }
        },
        tooltip: {
          headerFormat: '',
          pointFormat: '<span style="color:{point.color}">{point.name}</span>'
        },
        series: [
          {
            name: "Subjects",
            colorByPoint: true,
            data: []
          }
        ],
        drilldown: {
          series: []
        }
      },
      totalDescendants: 0,
      totalRecords: 0,
      sunburstData: [
        {
          id: 'Subjects',
          parent: '',
          name: 'Subjects'
        }
      ],
      pieData: [],
      barData: [],
      drilldownData: []
    }
  },
  computed: {
    pieOptions () {
      let options = JSON.parse(JSON.stringify(this.options))
      options.chart.type = 'pie'
      options.chart.height = this.$vuetify.breakpoint.lgAndUp ? 420 : 300
      options.series[0].data = this.pieData;
      options.drilldown.series = this.drilldownData.map((node) => {
        return {
          name: node.name,
          id: node.id,
          data: node.data,
          y: node.pieY
        }
      })
      return options
    },
    barOptions () {
      let options = JSON.parse(JSON.stringify(this.options))
      options.chart.type = 'column'
      options.chart.margin = [80, 40, 40, 40]
      options.chart.options3d.enabled = false
      options.chart.height = this.$vuetify.breakpoint.lgAndUp ? 420 : 300
      options.drilldown.drillUpButton = {position: {y: -40}}
      options.series[0].data = this.barData;
      options.drilldown.series = this.drilldownData.map((node) => {
        return {
          name: node.name,
          id: node.id,
          data: node.data,
          y: node.barY
        }
      })
      return options
    },
    sunburstOptions () {
      return {
        chart: {
          ...this.options.chart,
          height: this.$vuetify.breakpoint.lgAndUp ? 865 : 300,
          margin: [80, 40, 40, 40]
        },
        colors: [
          '#aec7e8', '#ffbb78',
          '#98df8a', '#ff9896',
          '#c5b0d5',
          '#f7b6d2',
          '#dbdb8d', '#9edae5'
        ],
        title: this.options.title,
        subtitle: this.options.subtitle,
        series: [
            {
              type: 'sunburst',
              data: this.sunburstData,
              allowDrillToNode: true,
              cursor: 'pointer',
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
                  }
                },
                {
                  level: 2,
                  colorByPoint: true
                },
                {
                  level: 3,
                  colorVariation: {
                    key: 'brightness',
                    to: -0.5
                  }
                },
                {
                  level: 4,
                  colorVariation: {
                    key: 'brightness',
                    to: 0.5
                  }
                },
                {
                  level: 5,
                  colorVariation: {
                    key: 'brightness',
                    to: 0.5
                  }
                }
              ],
              point: {
                events: {
                  click: function() {
                    if (!this.node.childrenTotal) window.alert('END OF TREE REACHED')
                  }
                }
              },
              tooltip: {
                pointFormat: '{point.name} : {point.descendantsCount}'
              }
            }
        ]
      }
    }
  },
  mounted() { this.$nextTick(() => { this.prepareData() }) },
  methods: {
    prepareData(){
      let pieData = [],
          barData = []
      for (let category of this.tree) {
        this.totalDescendants += category.descendantsCount
        this.totalRecords += category.recordsCount
      }
      for (let node of this.tree) {
        const newNode = { name: node.name, drilldown: node.name, value: 1, descendantsCount: node.descendantsCount }
        pieData.push({ ...newNode, y: this.getYValue(node) });
        barData.push({ ...newNode, y: this.getYValue(node, "hits") })
        this.prepareDrilldown(node)
      }
      this.pieData = pieData
      this.barData = barData
    },
    prepareDrilldown(cat, parent = 'Subjects'){
      let newNode = { name: cat.name, id: cat.name, descendantsCount: cat.descendantsCount || 0 }
      let drilldown = {
        ...newNode,
        data: [],
        pieY: this.getYValue(cat),
        barY: this.getYValue(cat, 'hits')
      };
      if (cat.children) {
        this.sunburstData.push({ ...newNode, parent: parent })
        drilldown.drilldown = cat.name
        for (let node of cat.children) {
            drilldown.data.push(this.prepareDrilldown(node, cat.name))
        }
      }
      else this.sunburstData.push({ ...newNode, parent: parent, value: 1 })
      this.drilldownData.push(drilldown)
      return drilldown
    },
    getYValue(node, computeType = "size"){
      if (computeType === "hits") return node.recordsCount || 1
      if (computeType === "size") return (node.descendantsCount * 100) / this.totalDescendants
    }
  }
}
</script>

<style scoped>

</style>
