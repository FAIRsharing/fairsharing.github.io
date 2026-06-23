<template>
  <div>
    <component
      :is="chartComponent"
      v-if="modulesReady"
      :ref="nameChart"
      :options="optionChartPie"
    />
  </div>
</template>

<script>
import { markRaw } from "vue";

export default {
  name: "PieChart",
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
      modulesReady: false,
      chartComponent: null, // This will hold the Highcharts component
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
          style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
        },
        credits: {
          enabled: false,
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
                    }
                    else {
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
  created() {
    this.optionChartPie.title.text = this.fieldsChart.title;
    this.optionChartPie.series[0].data = this.fieldsChart.data;
    this.nameChart = this.refName;
    if (!this.linkWork) {
      this.optionChartPie.series[0].point.events.click = null;
    }
  },
  mounted: async function () {
    if (!import.meta.env.SSR) {
      // Import the Vue wrapper component alongside Highcharts
      const { Chart } = await import("highcharts-vue");
      const { default: Highcharts } = await import("highcharts");
      const { default: Exporting } = await import(
        "highcharts/modules/exporting"
      );

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
      }
      else if (Exporting && typeof Exporting.default === "function") {
        Exporting.default(Highcharts);
      }

      this.chartComponent = markRaw(Chart);

      // Flip the flag to tell the template it is safe to render the chart
      this.modulesReady = true;
    }
  },
};
</script>
