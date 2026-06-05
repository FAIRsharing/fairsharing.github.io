<template>
  <div>
    <component
      :is="chartComponent"
      v-if="modulesReady"
      :ref="nameChart"
      :options="optionChartBars"
    />
  </div>
</template>

<script>
// import markRaw to tell Vue 3 not to make the component itself reactive,
// which improves performance and avoids Vue warnings.
import { markRaw } from "vue";

export default {
  name: "BarChart",
  props: {
    refName: {
      type: String,
      default: "",
    },
    fieldsChart: {
      type: Object,
      default: null,
    },
    showPercent: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      modulesReady: false,
      chartComponent: null, // This will hold the Highcharts component
      nameChart: "",
      optionChartBars: {
        chart: {
          type: "column",
        },
        title: {
          text: "",
          style: {
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          },
        },
        xAxis: {
          type: "category",
          title: {
            text: "",
          },
        },
        credits: {
          enabled: false,
        },
        yAxis: {
          min: 0,
          title: {
            text: "",
          },
        },
        tooltip: {
          headerFormat:
            '<span style="font-size:10px">{series.name}</span><table>',
          pointFormat:
            '<tr><td style="padding:0">Records: </td>' +
            '<td style="padding:0"><b>{point.y} ({point.z:.1f}%)</b></td></tr>',
          footerFormat: "</table>",
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          column: {
            pointWidth: 45,
            borderWidth: 0,
            grouping: false,
          },
        },
        legend: {
          alignColumns: false,
        },
        series: [],
        exporting: {
          enabled: true,
          sourceWidth: 1500,
          sourceHeight: 1600,
          scale: 1,
          filename: "FAIRsharing BarChart",
          buttons: {
            contextButton: {},
          },
        },
      },
    };
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
      } else if (Exporting && typeof Exporting.default === "function") {
        Exporting.default(Highcharts);
      }

      // Assign the dynamically imported component and mark it as raw
      this.chartComponent = markRaw(Chart);

      //Render the chart
      this.modulesReady = true;
    }

    if (this.fieldsChart) {
      this.optionChartBars.title.text = this.fieldsChart.title;
      this.optionChartBars.xAxis.title.text = this.fieldsChart.textXAxis;
      this.optionChartBars.yAxis.title.text = this.fieldsChart.textYAxis;
      this.optionChartBars.series = this.fieldsChart.series;
    }

    this.nameChart = this.refName;

    if (!this.showPercent) {
      this.optionChartBars.tooltip.pointFormat =
        '<tr><td style="padding:0">Records: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>';
    }
  },
};
</script>
