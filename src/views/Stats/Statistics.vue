<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col
        md="12"
        sm="12"
        lg="6"
      >
        <v-card
          v-if="optionChartPie1"
          class="pa-2"
          outlined
          tile
        >
          <highcharts
            ref="chartComponent1"
            :options="optionChartPie1"
          />
        </v-card>
      </v-col>
      <v-col
        md="12"
        sm="12"
        lg="6"
      >
        <v-card
          v-if="optionChartBars1"
          class="pa-2"
          outlined
          tile
        >
          <highcharts
            ref="chartComponent2"
            :options="optionChartBars1"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
    /** This component handles the statistic page
     *
     */
     import {Chart} from 'highcharts-vue'
     import GraphClient from "@/components/GraphClient/GraphClient.js"
     import getFilters from "@/components/GraphClient/queries/getFilters.json"
     import Highcharts from 'highcharts'
     import Pie from 'highcharts/modules/variable-pie'


     const client = new GraphClient();
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

     // pie chart data
     Pie (Highcharts);

     export default {
       name: "Statistics",
       components: {
         highcharts: Chart
       },
       data () {
           return {
             allDataStats: null,
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
                 enabled: false
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
                     click: function() {
                       location.href = this.options.url;
                     }
                   }
                 }
                }
               ]
             },
             optionChartBars:{
               chart: {
                 type: 'column'
               },
               title: {
                 text: ""
               },
               xAxis: {
                 type: 'category'
               },
               credits: {
                 enabled: false
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
             },
             optionChartPie1: null,
             optionChartBars1: null
         }
       },
       async mounted() {
         this.$nextTick(async function () {

           let data = await client.executeQuery(getFilters);
           this.allDataStats = data.searchFairsharingRecords.aggregations;
           //console.log(this.allDataStats);
           this.prepareData();
         })
         //console.log(this.allDataStats.fairsharing_registry.buckets)
         //console.log(this.allDataStats.countries.buckets);
       },
       methods: {
         prepareData(){
           this.prepareRegistryCounts(this.allDataStats);
           this.prepareRecordCountry(this.allDataStats);
         },
         prepareRegistryCounts(data){
           this.optionChartPie1 = this.optionChartPie;
           this.optionChartPie1.title.text= "Content divided by type";
           this.optionChartPie1.series[0].data = [];
           let regBucket = data.fairsharing_registry.buckets;
           let nameMap = { policy:"Policies", standard:"Standards", database:"Databases", collection:"Collections" };
           regBucket.forEach(item => {
             let vectItem = {
               name: nameMap[item.key],
               y: item.doc_count,
               url: '/#/search?fairsharingRegistry='+item.key
             };//window.location.hostname+
             this.optionChartPie1.series[0].data.push(vectItem);
           });
         },
         prepareRecordCountry(data){
           this.optionChartBars1 = this.optionChartBars;
           this.optionChartBars1.title.text= "Top 10 countries by content"
           this.optionChartBars1.yAxis.title.text = 'Number of records'
           this.optionChartBars1.series = [];
           let totRecords = data.countries.doc_count;
           let regBucket = data.countries.buckets.slice(0,10);
           let nameMap = { "united states of america":"USA",
           "united kingdom of great britain and northern ireland":"UK",
           "european union":"European Union"};
           let varX = 0;
           let nameC = "";
           regBucket.forEach(item => {
             //console.log(item.key);
             if (item.key in nameMap){
               nameC = nameMap[item.key];
             }else{
               nameC = item.key[0].toUpperCase() + item.key.substring(1);
             }
             let vectItem = {
               name: nameC,
               cursor: 'pointer',
               point: {
                   events: {
                     click: function() {
                       location.href = '/#/search?countries='+item.key;
                     }
                   }
               },
               data: []
             };
             let datItem = {
               name: "",
               x: varX,
               y: item.doc_count,
               z: 100*item.doc_count/totRecords
             };
             vectItem.data.push(datItem);
             varX +=1;
             this.optionChartBars1.series.push(vectItem);
           });
         }
      }
    }
  </script>
  <style scoped>
  </style>
