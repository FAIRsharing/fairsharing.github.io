<template>
  <v-main>
    <v-container fluid>
      <v-card-title
        primary-title
        class="justify-center"
      >
        <div align="center">
          <h3
            class="headline text--accent-2"
          >
            Summary Statistics
          </h3>
          <small>(click over pie sectors or bars to access specific data)</small>
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
      <v-container
        v-if="activeChart === 0"
        fluid
      >
        <v-row>
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
                :fields-chart="chartRegistries"
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
                :fields-chart="chartSubjects['standard']"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
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
                :fields-chart="chartSubjects['database']"
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
                :fields-chart="chartSubjects['policy']"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
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
                :fields-chart="chartCountriesAll"
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
                :fields-chart="chartCountries['standard']"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
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
                :fields-chart="chartCountries['database']"
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
                :fields-chart="chartCountries['policy']"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
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
                :fields-chart="chartSpecies['standard']"
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
                :fields-chart="chartSpecies['database']"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
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
                :fields-chart="chartSpecies['policy']"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartImplements['standard']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barImplementsStand"
                :fields-chart="chartImplements['standard']"
                :show-percent="false"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartImplements['database']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barImplementsDB"
                :fields-chart="chartImplements['database']"
                :show-percent="false"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartLinkPie['standard']"
              class="pa-2"
              outlined
              tile
            >
              <PieChart
                ref-name="pieLinkStand"
                :fields-chart="chartLinkPie['standard']"
                :link-work="false"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartLinkPie['database']"
              class="pa-2"
              outlined
              tile
            >
              <PieChart
                ref-name="pieLinkDB"
                :fields-chart="chartLinkPie['database']"
                :link-work="false"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartLinkPie['policy']"
              class="pa-2"
              outlined
              tile
            >
              <PieChart
                ref-name="pieLinkPol"
                :fields-chart="chartLinkPie['policy']"
                :link-work="false"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartJournals['standard']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barJourStand"
                :fields-chart="chartJournals['standard']"
                :show-percent="false"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartJournals['database']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barJourDB"
                :fields-chart="chartJournals['database']"
                :show-percent="false"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
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
                :fields-chart="chartLicences['standard']"
              />
            </v-card>
          </v-col>
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
                :fields-chart="chartLicences['database']"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartFunders['standard']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barFundStand"
                :fields-chart="chartFunders['standard']"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartFunders['database']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barFundDB"
                :fields-chart="chartFunders['database']"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartFunders['policy']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barFundPol"
                :fields-chart="chartFunders['policy']"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartNonFunders['standard']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barNonFundStand"
                :fields-chart="chartNonFunders['standard']"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartNonFunders['database']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barNonFundDB"
                :fields-chart="chartNonFunders['database']"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartNonFunders['policy']"
              class="pa-2"
              outlined
              tile
            >
              <BarChart
                ref-name="barNonFundPol"
                :fields-chart="chartNonFunders['policy']"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
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
                :fields-chart="chartMaintainer['standard']"
              />
            </v-card>
          </v-col>
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
                :fields-chart="chartMaintainer['database']"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
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
                :fields-chart="chartMaintainer['policy']"
              />
            </v-card>
          </v-col>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartHavePublication['standard']"
              class="pa-2"
              outlined
              tile
            >
              <PieChart
                ref-name="piePublicationStand"
                :fields-chart="chartHavePublication['standard']"
              />
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            md="12"
            sm="12"
            lg="6"
          >
            <v-card
              v-if="chartHavePublication['database']"
              class="pa-2"
              outlined
              tile
            >
              <PieChart
                ref-name="piePublicationDB"
                :fields-chart="chartHavePublication['database']"
              />
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <v-container
        v-else-if="activeChart === 1"
        fluid
      >
        <StatsStandard
          :chart-subjects="chartSubjects['standard']"
          :chart-countries="chartCountries['standard']"
          :chart-species="chartSpecies['standard']"
          :chart-implements="chartImplements['standard']"
          :chart-links="chartLinkPie['standard']"
          :chart-journals="chartJournals['standard']"
          :chart-licences="chartLicences['standard']"
          :chart-funders="chartFunders['standard']"
          :chart-non-funders="chartNonFunders['standard']"
          :chart-maintainers="chartMaintainer['standard']"
          :chart-publication="chartHavePublication['standard']"
        />
      </v-container>
      <v-container
        v-else-if="activeChart === 2"
        fluid
      >
        <StatsDB
          :chart-subjects="chartSubjects['database']"
          :chart-countries="chartCountries['database']"
          :chart-species="chartSpecies['database']"
          :chart-implements="chartImplements['database']"
          :chart-links="chartLinkPie['database']"
          :chart-journals="chartJournals['database']"
          :chart-licences="chartLicences['database']"
          :chart-funders="chartFunders['database']"
          :chart-non-funders="chartNonFunders['database']"
          :chart-maintainers="chartMaintainer['database']"
          :chart-publication="chartHavePublication['database']"
        />
      </v-container>
      <v-container
        v-else-if="activeChart === 3"
        fluid
      >
        <StatsPolicy
          :chart-subjects="chartSubjects['policy']"
          :chart-countries="chartCountries['policy']"
          :chart-species="chartSpecies['policy']"
          :chart-links="chartLinkPie['policy']"
          :chart-funders="chartFunders['policy']"
          :chart-non-funders="chartNonFunders['policy']"
          :chart-maintainers="chartMaintainer['policy']"
        />
      </v-container>
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
     import Loaders from "@/components/Navigation/Loaders"
     import PieChart from "@/components/Static/Statistics/PieChart.vue"
     import BarChart from "@/components/Static/Statistics/BarChart.vue"
     import getRecordStats from "@/lib/GraphClient/queries/getRecordStats.json"
     import StatsStandard from "@/components/Static/Statistics/StatsStandard.vue"
     import StatsPolicy from "@/components/Static/Statistics/StatsPolicy.vue"
     import StatsDB from "@/components/Static/Statistics/StatsDB.vue"
     const client = new GraphClient();

     export default {
       name: "Statistics",
       components: {
         Loaders,
         PieChart,
         BarChart,
         StatsStandard,
         StatsPolicy,
         StatsDB
       },
       data () {
           return {
             isLoading: false,
             allDataStats: null,
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
             chartImplements : {
               standard: null,
               database: null
             },
             chartLinkPie: {
               standard: null,
               database: null,
               policy: null
             },
             chartJournals : {
               standard: null,
               database: null
             },
             chartFunders : {
               standard: null,
               database: null,
               policy: null
             },
             chartNonFunders : {
               standard: null,
               database: null,
               policy: null
             },
             chartHavePublication: {
               standard: null,
               database: null
             },
             chartCountriesAll: null
         }
       },
       async mounted() {
         const _module = this;
         _module.$nextTick(async () => {
           _module.isLoading = true;
           let dataAPI = await client.executeQuery(getRecordStats);
           _module.allDataStats = dataAPI.latestStats.data;
           _module.prepareData();
           _module.isLoading = false;
         })
       },
       methods: {
         chartSelection(id) {
           this.activeChart = id;
         },
         prepareData(){
           const _module = this;
           _module.prepareRegistryCounts(_module.allDataStats.aggregations.all);
           const registries = ["standard", "database", "policy"];
           let   auxBarChart = {
                          title: "",
                          textXAxis: "",
                          textYAxis: "",
                          series: []
                        },
                 auxPieChart= {
                           title: "",
                           data: []
                         }
           registries.forEach(function (item) {
             //JSON.parse(JSON.stringify(_module.auxBarChart))
             _module.chartSubjects[item] = JSON.parse(JSON.stringify(auxBarChart));
             _module.prepareSubject(_module.allDataStats.aggregations[item], _module.chartSubjects[item], item);
             _module.chartCountries[item] = JSON.parse(JSON.stringify(auxBarChart));
             _module.prepareRecordCountry(_module.allDataStats.aggregations[item], _module.chartCountries[item], item);
             _module.chartSpecies[item] = JSON.parse(JSON.stringify(auxBarChart));
             _module.prepareSpecies(_module.allDataStats.aggregations[item], _module.chartSpecies[item], item);
             if (item!== 'policy'){
               _module.chartLicences[item] = JSON.parse(JSON.stringify(auxBarChart));
               _module.prepareLicences(_module.allDataStats.aggregations[item], _module.chartLicences[item], item);
               _module.chartImplements[item] = JSON.parse(JSON.stringify(auxBarChart));
               _module.chartJournals[item] = JSON.parse(JSON.stringify(auxBarChart));
               _module.chartHavePublication[item] = JSON.parse(JSON.stringify(auxPieChart));
             }
             _module.chartMaintainer[item] = JSON.parse(JSON.stringify(auxPieChart));
             _module.prepareHasMaintainer(_module.allDataStats.aggregations[item], _module.chartMaintainer[item], item);
             _module.chartLinkPie[item] = JSON.parse(JSON.stringify(auxPieChart));
             _module.chartFunders[item] = JSON.parse(JSON.stringify(auxBarChart));
             _module.prepareOrganisation(_module.allDataStats.top_10_orgs_records[item].funders,_module.chartFunders[item],item,true,_module.allDataStats.aggregations[item].countries.doc_count);
             _module.chartNonFunders[item] = JSON.parse(JSON.stringify(auxBarChart));
             _module.prepareOrganisation(_module.allDataStats.top_10_orgs_records[item].non_funders,_module.chartNonFunders[item],item,false,_module.allDataStats.aggregations[item].countries.doc_count);
           });
           _module.chartCountriesAll = JSON.parse(JSON.stringify(auxBarChart));
           _module.prepareRecordCountry(_module.allDataStats.aggregations.all, _module.chartCountriesAll,"record");
           _module.prepareImplementAndJournal(_module.allDataStats.top_10_stds_recommended_by_pols, _module.chartImplements['standard'],'standard');
           _module.prepareImplementAndJournal(_module.allDataStats.top_10_std_recs_journal, _module.chartJournals['standard'],'journalStand');
           _module.prepareImplementAndJournal(_module.allDataStats.top_10_db_recs_journal, _module.chartJournals['database'],'journalDB');
           _module.prepareImplementDB(_module.allDataStats.dbs_implementing_most_stds,_module.chartImplements['database']);
           _module.prepareLinkPie(_module.allDataStats.stds_implemented_by_a_db,_module.chartLinkPie['standard'],"Standards that have been implemented by a database");
           _module.prepareLinkPie(_module.allDataStats.dbs_linked_to_stds,_module.chartLinkPie['database'],"Databases that are linked to one or more standard");
           _module.prepareLinkPie(_module.allDataStats.pols_linked_to_std_or_db,_module.chartLinkPie['policy'],"Policies that are linked to one or more standard or database");
           _module.prepareHasPublication(_module.allDataStats.stds_to_pubs,_module.chartHavePublication['standard'],'standard');
           _module.prepareHasPublication(_module.allDataStats.dbs_to_pubs,_module.chartHavePublication['database'],'database');
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
           chartField.textYAxis = 'Number of '+textPlural;
           chartField.textXAxis = 'Subjects';
           let totRecords = data.subjects.doc_count;
           let regBucket = data.subjects.buckets.slice(0,10);
           let varX = 0;
           let nameC = "";
           regBucket.forEach(item => {
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
           chartField.textYAxis = 'Number of '+text+'s';
           chartField.textXAxis = 'Countries';
           let totRecords = data.countries.doc_count;
           let regBucket = data.countries.buckets.slice(0,10);
           let nameMap = { "united states of america":"USA",
           "united kingdom of great britain and northern ireland":"UK",
           "european union":"European Union"};
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
           chartField.textYAxis = 'Number of '+textPlural;
           chartField.textXAxis = 'Species';
           let totRecords = data.taxonomies.doc_count;
           let regBucket = data.taxonomies.buckets.slice(0,10);
           let varX = 0;
           let nameC = "";
           regBucket.forEach(item => {
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
           chartField.textYAxis = 'Number of '+text+'s';
           chartField.textXAxis = 'Licenses';
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
         },
         prepareImplementAndJournal(data,chartField,type){
           if (type === "standard"){
             chartField.title = "Top 10 standards recommended by policies";
             chartField.textYAxis = 'Number of policies';
             chartField.textXAxis = 'Standards';
           }else{
             chartField.textYAxis = 'Number of policy recommendations';
             if (type === "journalStand"){
               chartField.title = "Top 10 standards recommended by journal publishers";
               chartField.textXAxis = 'Standards';
             }else{
               chartField.title = "Top 10 databases recommended by journal publishers";
               chartField.textXAxis = 'Databases';
             }
           }
           let varX = 0;
           let sortable = Object.fromEntries(
             Object.entries(data).sort(([,a],[,b]) => b.count-a.count)
           );
           Object.keys(sortable).forEach(key => {
             let vectItem = {
               name: key,
               cursor: 'pointer',
               point: {
                   events: {
                     click: function() {
                       location.href = '/#/'+data[key].id;
                     }
                   }
               },
               data: []
             };
             let datItem = {
               name: "",
               x: varX,
               y: data[key].count
             };
             vectItem.data.push(datItem);
             varX +=1;
             chartField.series.push(vectItem);
           });
         },
         prepareImplementDB(data,chartField){
           chartField.title = "Top 10 databases that implement the most standards";
           chartField.textYAxis = 'Number of standards';
           chartField.textXAxis = 'Databases';
           let varX = 0;
           data.forEach(item => {
             let vectItem = {
               name: item.name,
               cursor: 'pointer',
               point: {
                   events: {
                     click: function() {
                       location.href = '/#/'+item.id;
                     }
                   }
               },
               data: []
             };
             let datItem = {
               name: "",
               x: varX,
               y: item.standards_implemented
             };
             vectItem.data.push(datItem);
             varX +=1;
             chartField.series.push(vectItem);
           });
         },
         prepareLinkPie(data,chartField,textTitle){
           chartField.title = textTitle;
           Object.keys(data).forEach(key => {
             let vectItem = {
               name: key,
               y: data[key]
             };
             chartField.data.push(vectItem);
           });
         },
         prepareOrganisation(data,chartField,type,funder,numRecords){
           let textPlural = "";
           if (type === "policy"){
             textPlural = "policies";
           }else{
             textPlural = type+"s";
           }
           if (funder){
             chartField.title = "Top 10 funders of "+textPlural;
           }else{
             chartField.title = "Top 10 organisations (excluding funders) of "+textPlural ;
           }
           chartField.textXAxis = "Organisations";
           chartField.textYAxis = "Number of "+textPlural ;
           let varX = 0;
           let sortable = Object.fromEntries(
             Object.entries(data).sort(([,a],[,b]) => b.count-a.count)
           );
           let nameC = "";
           Object.keys(sortable).forEach(key => {
             let par = key.indexOf('(');
             if (par >=0 ){
               nameC = key.substring(par+1,key.indexOf(')'));
             }else{
               let comm = key.split(',')
               if (comm.length > 2){
                 nameC = comm[0]+','+comm[comm.length-1];
               }else{
                 nameC = key;
               }

             }
             let vectItem = {
               name: nameC,
               cursor: 'pointer',
               point: {
                   events: {
                     click: function() {
                       location.href = '/#/organisations/'+data[key].id;
                     }
                   }
               },
               data: []
             };
             let datItem = {
               name: "",
               x: varX,
               y: data[key].count,
               z: 100*data[key].count/numRecords
             };
             vectItem.data.push(datItem);
             varX +=1;
             chartField.series.push(vectItem);
           });
         },
         prepareHasPublication(data,chartField,text){
           chartField.title = text[0].toUpperCase() + text.substring(1) +" records that have publications";
           let nameMap = { "standards_with_publication":"Yes", "standards_without_publication":"No", "databases_with_publication":"Yes", "databases_without_publication":"No"};
           Object.keys(data).forEach(key => {
             let vectItem = {
               name: nameMap[key],
               y: data[key]
             };//window.location.hostname+
             chartField.data.push(vectItem);
           });
         },
      }
    }
  </script>
