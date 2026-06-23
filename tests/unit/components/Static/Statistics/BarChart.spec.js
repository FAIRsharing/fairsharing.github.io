import { flushPromises, shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import BarChart from "@/components/Static/Statistics/BarChart.vue";

const setOptionsMock = vi.fn();
const exportingMock = vi.fn();

vi.mock("highcharts-vue", () => ({
  Chart: {
    name: "HighchartsChart",
    props: ["options"],
    template: "<div class='highcharts-chart'></div>",
  },
}));

vi.mock("highcharts", () => ({
  default: {
    setOptions: setOptionsMock,
  },
}));

vi.mock("highcharts/modules/exporting", () => ({
  default: exportingMock,
}));

describe("BarChart.vue", () => {
  let wrapper;

  const fieldsChart = {
    title: "This a bar chart",
    textXAxis: "X Axis Label",
    textYAxis: "Y Axis Label",
    series: [
      {
        name: "Records",
        data: [
          {
            name: "database",
            y: 50,
            z: 83.3,
          },
          {
            name: "policy",
            y: 10,
            z: 16.7,
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    wrapper = shallowMount(BarChart, {
      props: {
        refName: "Name of the Bar chart",
        fieldsChart,
      },
    });

    await flushPromises();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toBe("BarChart");
  });

  it("maps chart props into Highcharts options", () => {
    expect(wrapper.vm.optionChartBars.title.text).toBe("This a bar chart");
    expect(wrapper.vm.optionChartBars.xAxis.title.text).toBe("X Axis Label");
    expect(wrapper.vm.optionChartBars.yAxis.title.text).toBe("Y Axis Label");
    expect(wrapper.vm.optionChartBars.series).toEqual(fieldsChart.series);
    expect(wrapper.vm.nameChart).toBe("Name of the Bar chart");
  });

  it("loads Highcharts modules on mount", () => {
    expect(wrapper.vm.modulesReady).toBe(true);
    expect(wrapper.vm.chartComponent).toBeTruthy();

    expect(setOptionsMock).toHaveBeenCalledWith({
      lang: {
        thousandsSep: ",",
      },
      colors: [
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
      ],
    });

    expect(exportingMock).toHaveBeenCalled();
  });

  it("renders chart component after modules are ready", () => {
    const chart = wrapper.findComponent({ name: "HighchartsChart" });

    expect(chart.exists()).toBe(true);
    expect(chart.props("options")).toEqual(wrapper.vm.optionChartBars);
  });

  it("shows percentage in tooltip by default", () => {
    expect(wrapper.vm.optionChartBars.tooltip.pointFormat).toContain(
      "{point.y} ({point.z:.1f}%)",
    );
  });

  it("does not show percentage in tooltip when showPercent is false", async () => {
    wrapper = shallowMount(BarChart, {
      props: {
        refName: "Name of the Bar chart",
        fieldsChart,
        showPercent: false,
      },
    });

    await flushPromises();

    expect(wrapper.vm.optionChartBars.tooltip.pointFormat).toBe(
      '<tr><td style="padding:0">Records: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
    );
  });
});
