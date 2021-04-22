<template>
  <div>
    <highcharts
      :ref="nameChart"
      :options="optionChartBars"
    />
  </div>
</template>

<script>
    import {Chart} from 'highcharts-vue'
    import Highcharts from 'highcharts'

    const colourPalete = ['#aec7e8', '#ffbb78', '#98df8a', '#ff9896', '#c5b0d5', '#c49c94', '#f7b6d2', '#c7c7c7', '#dbdb8d', '#9edae5'];
    //['#50B432', '#ED561B', '#24CBE5', '#DDDF00', '#64E572', '#FF9655', '#FFF263',      '#6AF9C4']
    Highcharts.setOptions({
      lang: {
        thousandsSep: ','
      }
    })
    Highcharts.setOptions({
     colors: colourPalete
    });

    export default {
      name: "BarChart",
      components: {
        highcharts: Chart
      },
      props: {
        refName:{
          type: String,
          default: ""
        },
        fieldsChart: {
          type: Object,
          default: null
        },
        showPercent:{
            type: Boolean,
            default: true
        }
      },
      data () {
          return {
            nameChart: "",
            optionChartBars:{
              chart: {
                type: 'column'
              },
              title: {
                text: ""
              },
              xAxis: {
                type: 'category',
                title: {
                   text: ''
                 }
              },
              credits: {
                enabled: true
              },
              yAxis: {
                min: 0,
                title: {
                   text: ''
                 }
               },
               tooltip: {
                 headerFormat: '<span style="font-size:10px">{series.name}</span><table>',
                 pointFormat: '<tr><td style="padding:0">Records: </td>' +
                 '<td style="padding:0"><b>{point.y} ({point.z:.1f}%)</b></td></tr>',
                 footerFormat: '</table>',
                 shared: true,
                 useHTML: true
               },
               plotOptions: {
                 column: {
                   pointWidth: 45,
                   borderWidth: 0,
                   grouping: false
                 }
               },
               legend: {
                 alignColumns: false
               },
               series: []
            }
        }
      },
      mounted: function () {
        this.optionChartBars.title.text = this.fieldsChart.title;
        this.optionChartBars.xAxis.title.text = this.fieldsChart.textXAxis;
        this.optionChartBars.yAxis.title.text = this.fieldsChart.textYAxis;
        this.optionChartBars.series = this.fieldsChart.series;
        this.nameChart=this.refName;
        if (!this.showPercent){
          this.optionChartBars.tooltip.pointFormat = '<tr><td style="padding:0">Records: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>';
        }
      }
    }
</script>
