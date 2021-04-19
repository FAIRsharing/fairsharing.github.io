<template>
  <v-main>
    <v-container fluid>
      <v-card-title
        primary-title
        class="justify-center"
      >
        <div class="center">
          <h3
            class="headline text--accent-2"
          >
            Summary Statistics
          </h3>
          <small>(click over the pie sector or bar to access specific data)</small>
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
              <PieChart
                ref-name="pieRegistries"
                :text-title="chartRegistries.title"
                :data-chart="chartRegistries.data"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartSubjects['standard']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barSubjectsStand"
                :text-title="chartSubjects['standard'].title"
                :text-x-axis="chartSubjects['standard'].textXAxis"
                :text-y-axis="chartSubjects['standard'].textYAxis"
                :data-chart="chartSubjects['standard'].series"
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
              v-if="chartSubjects['database']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barSubjectsDB"
                :text-title="chartSubjects['database'].title"
                :text-x-axis="chartSubjects['database'].textXAxis"
                :text-y-axis="chartSubjects['database'].textYAxis"
                :data-chart="chartSubjects['database'].series"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartSubjects['policy']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barSubjectsPol"
                :text-title="chartSubjects['policy'].title"
                :text-x-axis="chartSubjects['policy'].textXAxis"
                :text-y-axis="chartSubjects['policy'].textYAxis"
                :data-chart="chartSubjects['policy'].series"
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
              <BarChart
                ref-name="barCountriesAll"
                :text-title="chartCountriesAll.title"
                :text-x-axis="chartCountriesAll.textXAxis"
                :text-y-axis="chartCountriesAll.textYAxis"
                :data-chart="chartCountriesAll.series"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountries['standard']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barCountriesStand"
                :text-title="chartCountries['standard'].title"
                :text-x-axis="chartCountries['standard'].textXAxis"
                :text-y-axis="chartCountries['standard'].textYAxis"
                :data-chart="chartCountries['standard'].series"
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
              v-if="chartCountries['database']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barCountriesDB"
                :text-title="chartCountries['database'].title"
                :text-x-axis="chartCountries['database'].textXAxis"
                :text-y-axis="chartCountries['database'].textYAxis"
                :data-chart="chartCountries['database'].series"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountries['policy']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barCountriesPol"
                :text-title="chartCountries['policy'].title"
                :text-x-axis="chartCountries['policy'].textXAxis"
                :text-y-axis="chartCountries['policy'].textYAxis"
                :data-chart="chartCountries['policy'].series"
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
              v-if="chartSpecies['standard']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barSpeciesStand"
                :text-title="chartSpecies['standard'].title"
                :text-x-axis="chartSpecies['standard'].textXAxis"
                :text-y-axis="chartSpecies['standard'].textYAxis"
                :data-chart="chartSpecies['standard'].series"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartSpecies['database']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barSpeciesDB"
                :text-title="chartSpecies['database'].title"
                :text-x-axis="chartSpecies['database'].textXAxis"
                :text-y-axis="chartSpecies['database'].textYAxis"
                :data-chart="chartSpecies['database'].series"
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
              v-if="chartSpecies['policy']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barSpeciesPol"
                :text-title="chartSpecies['policy'].title"
                :text-x-axis="chartSpecies['policy'].textXAxis"
                :text-y-axis="chartSpecies['policy'].textYAxis"
                :data-chart="chartSpecies['policy'].series"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartLicences['standard']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barLicenseStand"
                :text-title="chartLicences['standard'].title"
                :text-x-axis="chartLicences['standard'].textXAxis"
                :text-y-axis="chartLicences['standard'].textYAxis"
                :data-chart="chartLicences['standard'].series"
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
              v-if="chartLicences['database']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barLicenseDB"
                :text-title="chartLicences['database'].title"
                :text-x-axis="chartLicences['database'].textXAxis"
                :text-y-axis="chartLicences['database'].textYAxis"
                :data-chart="chartLicences['database'].series"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartMaintainer['standard']"
              class="pa-2"
              outlined
              tile
            >
              <PieChart
                ref-name="pieMaintainerStand"
                :text-title="chartMaintainer['standard'].title"
                :data-chart="chartMaintainer['standard'].data"
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
              v-if="chartMaintainer['database']"
              class="pa-2"
              outlined
              tile
            >
              <PieChart
                ref-name="pieMaintainerDB"
                :text-title="chartMaintainer['database'].title"
                :data-chart="chartMaintainer['database'].data"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartMaintainer['policy']"
              class="pa-2"
              outlined
              tile
            >
              <PieChart
                ref-name="pieMaintainerPol"
                :text-title="chartMaintainer['policy'].title"
                :data-chart="chartMaintainer['policy'].data"
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
              v-if="chartSubjects['standard']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barSubjectsStand2"
                :text-title="chartSubjects['standard'].title"
                :text-x-axis="chartSubjects['standard'].textXAxis"
                :text-y-axis="chartSubjects['standard'].textYAxis"
                :data-chart="chartSubjects['standard'].series"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountries['standard']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barCountriesStand2"
                :text-title="chartCountries['standard'].title"
                :text-x-axis="chartCountries['standard'].textXAxis"
                :text-y-axis="chartCountries['standard'].textYAxis"
                :data-chart="chartCountries['standard'].series"
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
              v-if="chartSubjects['database']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barSubjectsDB2"
                :text-title="chartSubjects['database'].title"
                :text-x-axis="chartSubjects['database'].textXAxis"
                :text-y-axis="chartSubjects['database'].textYAxis"
                :data-chart="chartSubjects['database'].series"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountries['database']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barCountriesDB2"
                :text-title="chartCountries['database'].title"
                :text-x-axis="chartCountries['database'].textXAxis"
                :text-y-axis="chartCountries['database'].textYAxis"
                :data-chart="chartCountries['database'].series"
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
              v-if="chartSubjects['policy']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barSubjectsPol2"
                :text-title="chartSubjects['policy'].title"
                :text-x-axis="chartSubjects['policy'].textXAxis"
                :text-y-axis="chartSubjects['policy'].textYAxis"
                :data-chart="chartSubjects['policy'].series"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartCountries['policy']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barCountriesPol2"
                :text-title="chartCountries['policy'].title"
                :text-x-axis="chartCountries['policy'].textXAxis"
                :text-y-axis="chartCountries['policy'].textYAxis"
                :data-chart="chartCountries['policy'].series"
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
     import GraphClient from "@/lib/GraphClient/GraphClient.js"
     import getFilters from "@/lib/GraphClient/queries/getFilters.json"
     import Loaders from "@/components/Navigation/Loaders"
     import {cloneDeep} from 'lodash'
     import PieChart from "@/components/Static/Statistics/PieChart.vue"
     import BarChart from "@/components/Static/Statistics/BarChart.vue"


     const client = new GraphClient();

     export default {
       name: "Statistics",
       components: {
         Loaders,
         PieChart,
         BarChart
       },
       data () {
           return {
             isLoading: false,
             allDataStats: null,
             allDataStatsRegistry: {
               standard: null,
               database: null,
               policy: null
             },
             allDataStatsPol: null,
             allDataStatsDB: null,
             activeChart : 0,
             chartRegistries: null,
             chartSubjects: {
               standard: null,
               database: null,
               policy: null
             },
             chartCountries: {
               standard: null,
               database: null,
               policy: null
             },
             chartSpecies: {
               standard: null,
               database: null,
               policy: null
             },
             chartLicences: {
               standard: null,
               database: null
             },
             chartMaintainer: {
               standard: null,
               database: null,
               policy: null
             },
             chartCountriesAll: null,
             auxBarChart : {
               title: "",
               xAxisTitle: "",
               yAxisTitle: "",
               series: []
             },
             auxPieChart: {
               title: "",
               data: []
             }
         }
       },
       async mounted() {
         const _module = this;
         _module.$nextTick(async () => {
           _module.isLoading = true;
           let data = await client.executeQuery(getFilters);
           _module.allDataStats = data.searchFairsharingRecords.aggregations;
           //console.log(this.allDataStats);
           let QueryStand = cloneDeep(getFilters);
           let filter ={};
           filter['fairsharingRegistry']='Standard';
           QueryStand['queryParam'] =filter;
           let dataStand;
           dataStand = await client.executeQuery(QueryStand);
           _module.allDataStatsRegistry['standard'] = dataStand.searchFairsharingRecords.aggregations;

           let QueryDB = cloneDeep(getFilters);
           filter['fairsharingRegistry']='Database';
           QueryDB['queryParam'] =filter;
           let dataDB;
           dataDB = await client.executeQuery(QueryDB);
           _module.allDataStatsRegistry['database'] = dataDB.searchFairsharingRecords.aggregations;

           let QueryPol= cloneDeep(getFilters);
           filter['fairsharingRegistry']='Policy';
           QueryPol['queryParam'] =filter;
           let dataPol;
           dataPol = await client.executeQuery(QueryPol);
           _module.allDataStatsRegistry['policy'] = dataPol.searchFairsharingRecords.aggregations;

           //console.log(this.allDataStatsStand);
           _module.prepareData();
           _module.isLoading = false;
         })
         //console.log(this.allDataStats.fairsharing_registry.buckets)
         //console.log(this.allDataStats.countries.buckets);
       },
       methods: {
         chartSelection(id) {
           this.activeChart = id;
         },
         prepareData(){
           const _module = this;
           _module.prepareRegistryCounts(_module.allDataStats);
           const registries = ["standard", "database", "policy"];
           registries.forEach(function (item) {
             _module.chartSubjects[item] = cloneDeep(_module.auxBarChart);
             _module.prepareSubject(_module.allDataStatsRegistry[item], _module.chartSubjects[item], item);
             _module.chartCountries[item] = cloneDeep(_module.auxBarChart);
             _module.prepareRecordCountry(_module.allDataStatsRegistry[item], _module.chartCountries[item], item);
             _module.chartSpecies[item] = cloneDeep(_module.auxBarChart);
             _module.prepareSpecies(_module.allDataStatsRegistry[item], _module.chartSpecies[item], item);
             if (item!== 'policy'){
               _module.chartLicences[item] = cloneDeep(_module.auxBarChart);
               _module.prepareLicences(_module.allDataStatsRegistry[item], _module.chartLicences[item], item);
             }
             _module.chartMaintainer[item] = cloneDeep(_module.auxPieChart);
             _module.prepareHasMaintainer(_module.allDataStatsRegistry[item], _module.chartMaintainer[item], item);
             //console.log(item);
             //console.log(_module.allDataStatsRegistry[item]);
           });
           _module.chartCountriesAll = cloneDeep(_module.auxBarChart);
           _module.prepareRecordCountry(_module.allDataStats, _module.chartCountriesAll,"record");

         },
         prepareRegistryCounts(data){
           let auxObj = {
             title: "Content divided by type",
             data: []
           };
           this.chartRegistries = auxObj
           let regBucket = data.fairsharing_registry.buckets;
           let nameMap = { policy:"Policies", standard:"Standards", database:"Databases", collection:"Collections" };
           regBucket.forEach(item => {
             let vectItem = {
               name: nameMap[item.key],
               y: item.doc_count,
               url: '/#/search?fairsharingRegistry='+item.key
             };//window.location.hostname+
             this.chartRegistries.data.push(vectItem);
           });
         },
         prepareSubject(data,chartField,text){
           let textPlural = "";
           if (text === "policy"){
             textPlural = "policies";
           }else{
             textPlural = text+"s";
           }
           chartField.title= "Top 10 ontologies subjects covered by "+textPlural;
           chartField.yAxisTitle = 'Number of '+textPlural;
           chartField.xAxisTitle = 'Subjects';
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
             nameC = words.join(" ");
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
         },
         prepareRecordCountry(data,chartField,text){
           let searchText = "";
           if ( text === 'record' ){
             chartField.title = "Top 10 countries by content";
           }else{
             chartField.title = "Top 10 "+text+ " producing countries";
             searchText = "&fairsharingRegistry="+text;
           }
           chartField.yAxisTitle = 'Number of '+text+'s';
           chartField.xAxisTitle = 'Countries';
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
         prepareSpecies(data,chartField,text){
           let textPlural = "";
           if (text === "policy"){
             textPlural = "policies";
           }else{
             textPlural = text+"s";
           }
           chartField.title= "Top 10 species covered by "+textPlural;
           chartField.yAxisTitle = 'Number of '+textPlural;
           chartField.xAxisTitle = 'Species';
           chartField.series = [];
           let totRecords = data.taxonomies.doc_count;
           let regBucket = data.taxonomies.buckets.slice(0,10);
           let varX = 0;
           let nameC = "";
           regBucket.forEach(item => {
             //console.log(item.key);
             nameC = item.key[0].toUpperCase() + item.key.substring(1);
             let vectItem = {
               name: nameC,
               cursor: 'pointer',
               point: {
                   events: {
                     click: function() {
                       location.href = '/#/search?fairsharingRegistry='+text+'&taxonomies='+item.key;
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
         prepareLicences(data,chartField,text){
           if ( text === 'database' ){
             chartField.title = "Top 10 licenses for database content";
           }else{
             chartField.title = "Top 10 licenses for standards";
           }
           chartField.yAxisTitle = 'Number of '+text+'s';
           chartField.xAxisTitle = 'Licenses';
           chartField.series = [];
           let totRecords = data.licences.doc_count;
           let regBucket = data.licences.buckets.slice(0,10);
           let nameMap = { "creative commons attribution 4.0 international (cc by 4.0)": "CC BY 4.0",
           "creative commons cc0 1.0 universal (cc0 1.0) public domain dedication": "CC0 1.0",
           "creative commons attribution 3.0 unported (cc by 3.0)": "CC BY 3.0",
           "iso privacy and copyright": "ISO Privacy and Copyright",
           "apache license 2.0" :"Apache License 2.0","w3c document license": "W3C Document License",
           "bsd-3-clause license (modified bsd license) (new bsd license)":"Modified BSD License",
           "embl-ebi terms of use": "EMBL-EBI Terms of Use",
           "creative commons attribution-sharealike 3.0 unported (cc by-sa 3.0)": "CC BY-SA 3.0",
           "creative commons attribution-sharealike 4.0 international (cc by-sa 4.0)": "CC BY-SA 4.0",
           "umls metathesaurus license": "UMLS Metathesaurus License","gnu general public license (gpl) 3.0":"GPL 3.0",
           "creative commons attribution-noncommercial-noderivatives 4.0 international (cc by-nc-nd 4.0)": "CC BY-ND 4.0",
           "creative commons attribution-noncommercial-sharealike 3.0 unported (cc by-nc-sa 3.0)": "CC BY-NC-SA 3.0",
           "ogc document notice": "OGC Document Notice","creative commons attribution 2.0 generic (cc by 2.0)": "CC BY 2.0",
           "library of congress legal information": "Library of Congress Legal Information",
           "creative commons attribution-noncommercial-sharealike 3.0 igo (cc by-nc-sa 3.0 igo)": "CC BY-NC-SA 3.0 IGO",
           "open data commons (odc) public domain dedication and licence (pddl) 1.0": "PDDL 1.0",
           "creative commons attribution-noncommercial 4.0 international (cc by-nc 4.0)": "CC BY-NC 4.0",
           "gnu lesser general public license (lgpl) 2.1": "LPGL 2.1","nih web policies and notices": "NIH Web Policies and Notices",
           "creative commons attribution 3.0 china mainland  (cc by 3.0 cn)": "(CC BY 3.0 CN)",
           "creative commons attribution-noncommercial-sharealike 4.0 international (cc by-nc-sa 4.0)" :"CC BY-NC-SA 4.0",
           "gnu general public license (gpl) 2.0": "GPL 2.0"}
           let varX = 0;
           let nameC = "";
           regBucket.forEach(item => {
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
                       location.href = '/#/search?fairsharingRegistry='+text+'&licences='+item.key;
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
         prepareHasMaintainer(data,chartField,text){
           chartField.title = text[0].toUpperCase() + text.substring(1) +" records that have maintainers";
           let regBucket = data.is_maintained.buckets;
           let nameMap = { 0:"No", 1:"Yes" };
           regBucket.forEach(item => {
             let vectItem = {
               name: nameMap[item.key],
               y: item.doc_count,
               url: '/#/search?fairsharingRegistry='+text+"&isMaintained="+item.key_as_string
             };//window.location.hostname+
             chartField.data.push(vectItem);
           });
         }
      }
    }
  </script>
