<template>
  <div>
    <RegistryCountChart :content="registriesCounts" />
  </div>
</template>

<script>
    /** This component handles the statistic page
     *
     */
     import RegistryCountChart from "@/components/StatsPage/RegistryCountChart.vue"
     import Vue from "vue/dist/vue.js"
     import VueHighcharts from 'highcharts-vue';
     import highcharts from "highcharts"
     import highcharts3d from "highcharts/highcharts-3d"
     import GraphClient from "@/components/GraphClient/GraphClient.js"
     import getFilters from "@/components/GraphClient/queries/getFilters.json"



     const client = new GraphClient();

     Vue.use(VueHighcharts);
     // pie chart data
     highcharts3d (highcharts);

     export default {
       name: "Statistics",
       components: {
         RegistryCountChart
       },
       data () {
           return {
             allDataStats: null,
             registriesCounts: []
         }
       },
       async mounted() {
         let data = await client.executeQuery(getFilters);
         this.allDataStats = data.searchFairsharingRecords.aggregations;
         //console.log(this.dataStats);
         this.prepareData();
         //console.log(this.allDataStats.fairsharing_registry.buckets)
         //console.log(this.dataStats.countries.buckets);
       },
       methods: {
         prepareData(){
           this.prepareRegistryCounts(this.allDataStats);
         },
         prepareRegistryCounts(data){
           let regBucket = data.fairsharing_registry.buckets;
           regBucket.forEach(item => {
             let vectItem = {
               name: item.key,
               y: item.doc_count
             };
             this.registriesCounts.push(vectItem);
           });
         }
      }
    }
  </script>
  <style scoped>
  </style>
