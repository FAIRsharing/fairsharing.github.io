import { flushPromises, shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import PieChart from "@/components/Static/Statistics/PieChart.vue";

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

describe("PieChart.vue", () => {
  let wrapper;

  const fieldsChart = {
    title: "This a pie chart",
    data: [
      {
        name: "database",
        y: 50,
      },
      {
        name: "policy",
        y: 10,
      },
    ],
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    wrapper = shallowMount(PieChart, {
      props: {
        refName: "Name of the Pie chart",
        fieldsChart,
      },
    });

    await flushPromises();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toMatch("PieChart");
    expect(wrapper.vm.optionChartPie.title.text).toBe("This a pie chart");
    expect(wrapper.vm.nameChart).toBe("Name of the Pie chart");
    expect(wrapper.vm.optionChartPie.series[0].data[1].y).toBe(10);
  });

  it("can use not links", async () => {
    wrapper.unmount();

    wrapper = shallowMount(PieChart, {
      props: {
        linkWork: false,
        refName: "Name of the Pie chart",
        fieldsChart: {
          title: "This a pie chart",
          data: [],
        },
      },
    });

    await flushPromises();

    expect(wrapper.vm.optionChartPie.series[0].point.events.click).toBe(null);
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
    expect(chart.props("options")).toEqual(wrapper.vm.optionChartPie);
  });
});
