<template>
  <div
    :id="id"
    :option="option"
  />
</template>
<script>
import highcharts from "highcharts"
export default {
  props:{
    content:{
        type: Array,
        default: null
    }
  },
  data () {
      return {
        id: "pieChart",
        option:{
          chart:{
            type:"pie", //pie chart
             options3d:{
               enabled:false
             }
          },
          title:{
            text:"Content divided by type" //The title text of the chart
          },
          subtitle:{
            text:"" //Subtitle text
          },
          plotoptions:{
            pie:{
              allowpointselect:true, //Can each sector be selected
              cursor:"pointer", //mouse pointer
              depth:35, //The thickness of the pie chart
              datalabels:{
                enabled:true, //Whether to display the linear tip of the pie chart
              }
            }
          },
          series:[
          {
            type:"pie",
            name: "Registry",
            data:[
              ["Test 1", 12], //module name and proportion,Or {name:"Test 1", y:12}
              ["Test 2", 23],
              ["Test 3", 19],
              ["Test 4", 29]
            ]
           }
          ]
        }
      }
  },
  async mounted () {
    this.option.series[0].data = await this.content;
    //console.log(this.option.series[0].data);
    highcharts.chart (this.id,this.option);
  }
}
</script>
<style scoped>

</style>
