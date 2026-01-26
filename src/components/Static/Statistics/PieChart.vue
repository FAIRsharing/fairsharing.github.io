<template>
  <highcharts :ref="nameChart" :options="optionChartPie" />
</template>

<script>
import Highcharts from "highcharts";
import { Chart } from "highcharts-vue"; //Pie (Highcharts);
import Exporting from "highcharts/modules/exporting";

//Pie (Highcharts);
const colourPalete = [
  "#aec7e8",
  "#ffbb78",
  "#98df8a",
  "#ff9896",
  "#c5b0d5",
  "#c49c94",
  "#f7b6d2",
  "#c7c7c7",
  "#dbdb8d",
  "#9edae5",
];
Highcharts.setOptions({
  lang: {
    thousandsSep: ",",
  },
  colors: colourPalete,
});

if (typeof Exporting === "function") {
  Exporting(Highcharts);
} else if (typeof Exporting.default === "function") {
  Exporting.default(Highcharts);
}

export default {
  name: "PieChart",
  components: {
    highcharts: Chart,
  },
  props: {
    refName: {
      type: String,
      default: "",
    },
    fieldsChart: {
      type: Object,
      default: null,
    },
    linkWork: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      nameChart: "",
      optionChartPie: {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: "pie",
          style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
        },
        title: {
          text: "", //The title text of the chart
        },
        credits: {
          enabled: true,
        },
        tooltip: {
          pointFormat:
            "{series.name}: <b>{point.y} ({point.percentage:.1f}%)</b>",
        },
        plotoptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
          },
        },
        series: [
          {
            type: "pie",
            name: "Records",
            colorByPoint: true,
            data: [],
            cursor: "pointer",
            point: {
              events: {
                click:
                  /* istanbul ignore next */
                  function (e) {
                    if (this.options.url) {
                      location.href = this.options.url;
                    } else {
                      e.stopPropagation();
                    }
                  },
              },
            },
          },
        ],
        exporting: {
          enabled: true, // explicit enable
          sourceWidth: 1500,
          sourceHeight: 1600,
          scale: 1,
          filename: "FAIRsharing PieChart",
          buttons: {
            contextButton: {
              // You can customize the menu symbol or position here if needed
              // symbol: 'menu',
              // align: 'right',
            },
          },
        },
      },
    };
  },
  mounted: function () {
    this.optionChartPie.title.text = this.fieldsChart.title;
    this.optionChartPie.series[0].data = this.fieldsChart.data;
    this.nameChart = this.refName;
    if (!this.linkWork) {
      this.optionChartPie.series[0].point.events.click = null;
    }
  },
};
</script>
