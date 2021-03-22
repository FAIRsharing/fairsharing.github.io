<template>
  <section class="charts">
    <h3>pie-basic</h3>
    <vue-highcharts :options="pieOptions" ref="pieChart"></vue-highcharts>
  </section>
</template>

<script>
    /** This component handles the statistic page
     *
     */
     //import FirstGraph from "@/components/StatsPage/FirstGraph.vue"
     import Vue from "vue/dist/vue.js"
     import VueHighcharts from 'highcharts-vue';


     // pie chart data
     Vue.use(VueHighcharts);
     export const PieData = {
       chart: {
         type: "pie",
         options3d: {
           enabled: true,
           alpha: 45
         }
       },
       title: {
         text: "Contents of Highsoft's weekly fruit delivery"
       },
       subtitle: {
         text: "3D donut in Highcharts"
       },
       plotOptions: {
         pie: {
           innerSize: 100,
           depth: 45
         }
       },
       series: [
         {
           name: "Delivered amount",
           data: [
             ["Bananas", 8],
             ["Kiwi", 3],
             ["Mixed nuts", 1],
             ["Oranges", 6],
             ["Apples", 8],
             ["Pears", 4],
             ["Clementines", 4],
             ["Reddish (bag)", 1],
             ["Grapes (bunch)", 1]
           ]
         }
       ]
     };
     export default {
       name: "Statistics",
       components: {
         VueHighcharts
       },
       data() {
         return {
           pieOptions: PieData
         };
       },
       mounted() {},
       methods: {}
     }
</script>
