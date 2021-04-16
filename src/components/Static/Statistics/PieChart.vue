<template>
  <highcharts
    :ref="nameChart"
    :options="optionChartPie"
  />
</template>

<script>
    import {Chart} from 'highcharts-vue'
    import Highcharts from 'highcharts'

    //Pie (Highcharts);
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
      name: "PieChart",
      components: {
        highcharts: Chart
      },
      props: {
        refName:{
          type: String,
          default: ""
        },
        textTitle: {
            type: String,
            default: ""
        },
        dataChart: {
            type: Array,
            default: null
        }
      },
      data () {
          return {
            nameChart: "",
            optionChartPie:{
              chart:{
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
              },
              title:{
                text:"" //The title text of the chart
              },
              credits: {
                enabled: true
              },
              tooltip: {
                pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>'
              },
              plotoptions:{
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
              },
              series:[
              {
                type:"pie",
                name: "Records",
                colorByPoint: true,
                data:[],
                cursor: 'pointer',
                point: {
                  events: {
                    click: /* istanbul ignore next */ function() {
                      location.href = this.options.url;
                    }
                  }
                }
               }
              ]
            }
          }
        },
        mounted: function () {
          this.optionChartPie.title.text = this.textTitle;
          this.optionChartPie.series[0].data = this.dataChart;
          this.nameChart=this.refName;
        }
      }
</script>
