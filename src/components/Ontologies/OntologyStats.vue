<template>
  <v-container fluid>
    <v-row>
      <v-col
        xs="12"
        sm="12"
        md="12"
        lg="12"
        xl="5"
      >
        <highcharts :options="pieOptions" />
      </v-col>
      <v-col
        xs="12"
        sm="12"
        md="12"
        lg="12"
        xl="7"
      >
        <highcharts :options="barOptions" />
      </v-col><v-col
        xs="12"
        sm="12"
        md="12"
        lg="12"
        xl="5"
      >
        <highcharts :options="pieOptions" />
      </v-col>
      <v-col
        xs="12"
        sm="12"
        md="12"
        lg="12"
        xl="7"
      >
        <highcharts :options="barOptions" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: "OntologyStats",
  props: {
    tree: { required: true, type: Array }
  },
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
      totalSize: 0
    }
  },
  computed: {
    pieOptions(){
      let options = JSON.parse(JSON.stringify(this.options))
      options.chart.type = 'pie'
      options.chart.height = this.$vuetify.breakpoint.lgAndUp ? 420 : 300
      return options
    },
    barOptions(){
      let options = JSON.parse(JSON.stringify(this.options))
      options.chart.type = 'column'
      options.chart.margin = [80, 40, 40, 40]
      options.chart.options3d.enabled = false
      options.chart.height = this.$vuetify.breakpoint.lgAndUp ? 420 : 300
      options.drilldown.drillUpButton = {position: {y: -40}}
      return options
    }
  },
  mounted() { this.$nextTick(() => { this.prepareData() }) },
  methods: {
    prepareData(){
      let sizedTree = [],
          pieData = []
      for (let category of this.tree){
        const size = this.getSize(category)
        this.totalSize += size
        sizedTree.push({...category, size})
      }
      for (let node of sizedTree) {
        pieData.push({
          name: node.name,
          y: (node.size * 100)/this.totalSize,
          size: node.size,
          drilldown: node.name
        });
        this.prepareDrilldown(node)
      }
      this.options.series[0].data = pieData
    },
    prepareDrilldown(cat){
      let drilldown = {
        name: cat.name,
        id: cat.name,
        data: [],
        y: (cat.size * 100) / this.totalSize
      }
      if (cat.children) {
        drilldown.drilldown = cat.name
        for (let node of cat.children) {
            drilldown.data.push(this.prepareDrilldown(node))
        }
      }
      this.options.drilldown.series.push(drilldown)
      return drilldown
    },
    getSize(cat, size = 1){
      if (cat.children) {
        size += cat.children.length;
        cat.size = size;
        for (const child of cat.children) {
          size = this.getSize(child, size)
          this.getSize(child, 1)
        }
      }
      else cat.size = 1
      return size
    }
  }
}
</script>

<style scoped>

</style>
