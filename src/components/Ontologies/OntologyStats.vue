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
import Highcharts from 'highcharts'

Highcharts.setOptions({
  colors: [
    '#aec7e8', '#ffbb78',
    '#98df8a', '#ff9896',
    '#c5b0d5',
    '#f7b6d2',
    '#dbdb8d', '#9edae5'
  ]
})

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
          margin: [80, 40, 40, 40],
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
      pieData: {
        data: [],
        drilldownData: []
      },
      barData: {
        data: [],
        drilldownData: []
      }
    }
  },
  computed: {
    pieOptions () {
      let _client = this,
          options = JSON.parse(JSON.stringify(this.options))
      options.chart.type = 'pie'
      options.chart.height = this.$vuetify.breakpoint.lgAndUp ? 420 : 300
      options.series[0].data = this.pieData.data;
      options.drilldown.series = this.pieData.drilldownData.map((node) => {
        return {
          name: node.name,
          id: node.id,
          data: node.data,
          y: node.y
        }
      })
      options.plotOptions.series.point = { events: { click: function () { _client.processEndOfTree(this) }}}
      options.drilldown.drillUpButton = {position: {y: -40}}
      return options
    },
    barOptions () {
      let _client = this,
          options = JSON.parse(JSON.stringify(this.options))
      options.chart.type = 'column'
      options.chart.options3d.enabled = false
      options.chart.height = this.$vuetify.breakpoint.lgAndUp ? 420 : 300
      options.drilldown.drillUpButton = {position: {y: -40}}
      options.series[0].data = this.barData.data;
      options.drilldown.series = this.barData.drilldownData.map((node) => {
        return {
          name: node.name,
          id: node.id,
          data: node.data,
          y: node.y
        }
      })
      options.plotOptions.series.point = { events: { click: function () { _client.processEndOfTree(this) }}}
      return options
    },
    sunburstOptions () {
      let _client = this;
      return {
        chart: {
          ...this.options.chart,
          height: this.$vuetify.breakpoint.lgAndUp ? 865 : 300,
        },
        title: this.options.title,
        subtitle: this.options.subtitle,
        series: [
            {
              type: 'sunburst',
              data: this.sunburstData,
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
                    unit: 'pixels',
                    value: 65
                  }
                },
                {
                  level: 2,
                  colorByPoint: true,
                  levelSize: {
                    unit: 'pixels',
                    value: 140
                  }
                },
                {
                  level: 3,
                  colorVariation: {
                    key: 'brightness',
                    to: -0.5
                  },
                  levelSize: {
                    unit: 'pixels',
                    value: 80
                  }
                },
                {
                  level: 4,
                  colorVariation: {
                    key: 'brightness',
                    to: 0.5
                  },
                  levelSize: {
                    unit: 'pixels',
                    value: 60
                  }
                },
                {
                  level: 5,
                  colorVariation: {
                    key: 'brightness',
                    to: 0.5
                  },
                  levelSize: {
                    unit: 'pixels',
                    value: 60
                  }
                }
              ],
              point: { events: { click: function () { _client.processEndOfTree(this) }}},
              tooltip: {
                pointFormat: '{point.name} : {point.descendantsCount}'
              }
            }
        ]
      }
    }
  },
  created() { this.prepareData() },
  methods: {
    prepareData(){
      let pieData = [],
          barData = []
      for (let category of this.tree) {
        this.totalDescendants += category.descendantsCount
        this.totalRecords += category.recordsCount
      }
      for (let node of this.tree) {
        const newNode = {
          name: node.name,
          drilldown: node.descendantsCount > 0 ? node.name : null,
          value: 1,
          descendantsCount: node.descendantsCount,
        }
        pieData.push({ ...newNode, y: this.getYValue(node, 'size') });
        barData.push({ ...newNode, y: this.getYValue(node, "hits") })
        this.prepareDrilldown(node)
      }
      this.pieData.data = pieData
      this.barData.data = barData
    },
    prepareDrilldown(cat, parent = 'Subjects'){
      let newNode = {
        name: cat.name,
        id: cat.name,
        descendantsCount: cat.descendantsCount || 0,
        y: this.getYValue(cat, 'hits'),
        data: []
      }
      let barDrilldown = { ...newNode },
          pieDrilldown = { ...newNode, y: this.getYValue(cat, 'size') };

      if (cat.children) {
        this.sunburstData.push({ ...newNode, parent: parent })
        pieDrilldown.drilldown = barDrilldown.drilldown = cat.name
        for (let node of cat.children) {
            const drilldownData = this.prepareDrilldown(node, cat.name)
            pieDrilldown.data.push(drilldownData.pieDrilldown);
            barDrilldown.data.push(drilldownData.barDrilldown);
        }
      }
      else this.sunburstData.push({ ...newNode, parent: parent, value: 1 })
      this.pieData.drilldownData.push(pieDrilldown);
      this.barData.drilldownData.push(barDrilldown)
      return {pieDrilldown, barDrilldown}
    },
    getYValue(node, computeType = "size"){
      if (computeType === "hits") return node.recordsCount || 0
      if (computeType === "size") return node.descendantsCount || 0
    },
    processEndOfTree(node){
      if (node.descendantsCount === 0) {
        let currentTerm = decodeURIComponent(this.$route.query.term) || null
        if (currentTerm && currentTerm !== node.name) {
          this.$router.push({path: this.$route.path, query: {term: encodeURIComponent(node.name)}})
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
