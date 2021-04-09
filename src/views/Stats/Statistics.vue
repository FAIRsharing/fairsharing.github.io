<template>
  <v-main>
    <v-container fluid>
      <v-card-title
        primary-title
        class="justify-center"
      >
        <div>
          <h3
            class="headline text--accent-2"
          >
            Summary Statistics (under construction)
          </h3>
        </div>
      </v-card-title>
      <v-row
        align="center"
        justify="space-around"
      >
        <v-btn
          depressed
          :outlined="activeChart !== 0"
          color="primary"
          @click="chartSelection(0)"
        >
          All
        </v-btn>
        <v-btn
          depressed
          :outlined="activeChart !== 1"
          color="primary"
          @click="chartSelection(1)"
        >
          Standards
        </v-btn>
        <v-btn
          depressed
          :outlined="activeChart !== 2"
          color="primary"
          @click="chartSelection(2)"
        >
          Databases
        </v-btn>
        <v-btn
          depressed
          :outlined="activeChart !== 3"
          color="primary"
          @click="chartSelection(3)"
        >
          Policies
        </v-btn>
      </v-row>
      <v-divider
        class="mx-4"
        vertical
      />
      <template v-if="activeChart === 0">
        <v-row
          no-gutters
        >
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartRegistries"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartRegistries"
                :options="chartRegistries"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartSubjectsStand"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartSubjectsStand"
                :options="chartSubjectsStand"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row
          no-gutters
        >
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartSubjectsDB"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartSubjectsDB"
                :options="chartSubjectsDB"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartSubjectsPol"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartSubjectsPol"
                :options="chartSubjectsPol"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row
          no-gutters
        >
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountriesAll"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartCountriesAll"
                :options="chartCountriesAll"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountriesStand"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartCountriesStand"
                :options="chartCountriesStand"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row
          no-gutters
        >
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountriesDB"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartCountriesDB"
                :options="chartCountriesDB"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountriesPol"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartCountriesPol"
                :options="chartCountriesPol"
              />
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-else-if="activeChart === 1">
        <v-row
          no-gutters
        >
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartSubjectsStand"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartSubjectsStand2"
                :options="chartSubjectsStand"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountriesStand"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartCountriesStand2"
                :options="chartCountriesStand"
              />
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-else-if="activeChart === 2">
        <v-row
          no-gutters
        >
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartSubjectsDB"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartSubjectsDB2"
                :options="chartSubjectsDB"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountriesDB"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartCountriesDB2"
                :options="chartCountriesDB"
              />
            </v-card>
          </v-col>
        </v-row>
      </template>
      <template v-else-if="activeChart === 3">
        <v-row
          no-gutters
        >
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartSubjectsPol"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartSubjectsPol2"
                :options="chartSubjectsPol"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountriesPol"
              class="pa-2"
              outlined
              tile
            >
              <highcharts
                ref="chartCountriesPol2"
                :options="chartCountriesPol"
              />
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-container>
    <v-fade-transition>
      <v-overlay
        v-if="isLoading"
        :absolute="false"
        opacity="0.8"
      >
        <Loaders />
      </v-overlay>
    </v-fade-transition>
  </v-main>
</template>

<script>
    /** This component handles the statistic page
     *
     */
     import {Chart} from 'highcharts-vue'
     import GraphClient from "@/components/GraphClient/GraphClient.js"
     import getFilters from "@/components/GraphClient/queries/getFilters.json"
     import Highcharts from 'highcharts'
     import Loaders from "@/components/Navigation/Loaders"
     import {cloneDeep} from 'lodash'


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
     //Pie (Highcharts);

     export default {
       name: "Statistics",
       components: {
         highcharts: Chart,
         Loaders
       },
       data () {
           return {
             isLoading: false,
             allDataStats: null,
             allDataStatsStand: null,
             allDataStatsPol: null,
             allDataStatsDB: null,
             activeChart : 0,
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
             chartRegistries: null,
             chartSubjectsStand: null,
             chartSubjectsDB: null,
             chartSubjectsPol: null,
             chartCountriesStand: null,
             chartCountriesDB: null,
             chartCountriesPol: null,
             chartCountriesAll: null
         }
       },
       async mounted() {
         this.$nextTick(async () => {
           this.isLoading = true;
           let data = await client.executeQuery(getFilters);
           this.allDataStats = data.searchFairsharingRecords.aggregations;
           //console.log(this.allDataStats);
           let QueryStand = cloneDeep(getFilters);
           let filter ={};
           filter['fairsharingRegistry']='Standard';
           QueryStand['queryParam'] =filter;
           let dataStand;
           dataStand = await client.executeQuery(QueryStand);
           this.allDataStatsStand = dataStand.searchFairsharingRecords.aggregations;

           let QueryDB = cloneDeep(getFilters);
           filter['fairsharingRegistry']='Database';
           QueryDB['queryParam'] =filter;
           let dataDB;
           dataDB = await client.executeQuery(QueryDB);
           this.allDataStatsDB = dataDB.searchFairsharingRecords.aggregations;

           let QueryPol= cloneDeep(getFilters);
           filter['fairsharingRegistry']='Policy';
           QueryPol['queryParam'] =filter;
           let dataPol;
           dataPol = await client.executeQuery(QueryPol);
           this.allDataStatsPol = dataPol.searchFairsharingRecords.aggregations;

           //console.log(this.allDataStatsStand);
           this.prepareData();
           this.isLoading = false;
         })
         //console.log(this.allDataStats.fairsharing_registry.buckets)
         //console.log(this.allDataStats.countries.buckets);
       },
       methods: {
         chartSelection(id) {
           this.activeChart = id;
         },
         prepareData(){
           this.prepareRegistryCounts(this.allDataStats);
           this.chartSubjectsStand = cloneDeep(this.optionChartBars);
           this.prepareSubject(this.allDataStatsStand, this.chartSubjectsStand, "standard");
           this.chartSubjectsDB = cloneDeep(this.optionChartBars);
           this.prepareSubject(this.allDataStatsDB, this.chartSubjectsDB, "database");
           this.chartSubjectsPol = cloneDeep(this.optionChartBars);
           this.prepareSubject(this.allDataStatsPol, this.chartSubjectsPol, "policy");
           this.chartCountriesStand = cloneDeep(this.optionChartBars);
           this.prepareRecordCountry(this.allDataStatsStand, this.chartCountriesStand,"standard");
           this.chartCountriesDB = cloneDeep(this.optionChartBars);
           this.prepareRecordCountry(this.allDataStatsDB, this.chartCountriesDB,"database");
           this.chartCountriesPol = cloneDeep(this.optionChartBars);
           this.prepareRecordCountry(this.allDataStatsPol, this.chartCountriesPol,"policy");
           this.chartCountriesAll = cloneDeep(this.optionChartBars);
           this.prepareRecordCountry(this.allDataStats, this.chartCountriesAll,"record");
           //console.log(this.allDataStats.fairsharing_registry.buckets.length)
           console.log(this.chartSubjectsStand.series[0]);
         },
         prepareRegistryCounts(data){
           this.chartRegistries = cloneDeep(this.optionChartPie);
           this.chartRegistries.title.text= "Content divided by type";
           this.chartRegistries.series[0].data = [];
           let regBucket = data.fairsharing_registry.buckets;
           let nameMap = { policy:"Policies", standard:"Standards", database:"Databases", collection:"Collections" };
           regBucket.forEach(item => {
             let vectItem = {
               name: nameMap[item.key],
               y: item.doc_count,
               url: '/#/search?fairsharingRegistry='+item.key
             };//window.location.hostname+
             this.chartRegistries.series[0].data.push(vectItem);
           });
         },
         prepareRecordCountry(data,chartField,text){
           let searchText = "";
           if ( text === 'record' ){
             chartField.title.text = "Top 10 countries by content";
           }else{
             chartField.title.text = "Top 10 "+text+ " producing countries";
             searchText = "&fairsharingRegistry="+text;
           }
           chartField.yAxis.title.text = 'Number of '+text+'s';
           chartField.series = [];
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
                       location.href = '/#/search?countries='+item.key+searchText;
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
             chartField.series.push(vectItem);
           });
         },
         prepareSubject(data,chartField,text){
           let textPlural = "";
           if (text === "policy"){
             textPlural = "policies";
           }else{
             textPlural = text+"s";
           }
           chartField.title.text= "Top 10 ontologies subjects covered by "+textPlural;
           chartField.yAxis.title.text = 'Number of '+textPlural;
           chartField.series = [];
           let totRecords = data.subjects.doc_count;
           let regBucket = data.subjects.buckets.slice(0,10);
           let varX = 0;
           let nameC = "";
           regBucket.forEach(item => {
             //console.log(item.key);
             let words = item.key.split(" ");
             for (let i = 0; i < words.length; i++) {
               words[i] = words[i][0].toUpperCase() + words[i].substr(1);
             }
             nameC =words.join(" ");
             let vectItem = {
               name: nameC,
               cursor: 'pointer',
               point: {
                   events: {
                     click: function() {
                       location.href = '/#/search?fairsharingRegistry='+text+'&subjects='+item.key;
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
             chartField.series.push(vectItem);
           });
         }

      }
    }
  </script>
