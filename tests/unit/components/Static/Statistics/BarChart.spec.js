import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import BarChart from "@/components/Static/Statistics/BarChart.vue";

describe("BarChart.vue", () => {
  let wrapper;

  // Re-render a clean instance before each test to prevent shared state leakage
  beforeEach(async () => {
    wrapper = shallowMount(BarChart, {
      props: {
        refName: "Name of the chart",
        fieldsChart: {
          title: "This a bar chart",
          textXAxis: "X axis",
          textYAxis: "Y axis",
          series: [
            { name: "USA", data: [{ y: 50 }] },
            { name: "EU", data: [{ y: 100 }] },
          ],
        },
      },
    });

    // Wait for the asynchronous mounted() hook to complete
    await nextTick();
  });

  it("can be mounted", () => {
    expect(wrapper.vm.$options.name).toBe("BarChart");
    expect(wrapper.vm.optionChartBars.title.text).toBe("This a bar chart");
    expect(wrapper.vm.nameChart).toBe("Name of the chart");
    expect(wrapper.vm.optionChartBars.series[1].name).toBe("EU");
  });

  it("can use not percentage", async () => {
    const noPercentWrapper = shallowMount(BarChart, {
      props: {
        refName: "Name of the chart",
        showPercent: false,
        fieldsChart: {
          title: "",
          textXAxis: "X axis",
          textYAxis: "X axis",
          series: [],
        },
      },
    });

    // Wait for mounted() to run for this specific instance
    await nextTick();

    expect(noPercentWrapper.vm.optionChartBars.tooltip.pointFormat).toBe(
      '<tr><td style="padding:0">Records: </td>' +
        '<td style="padding:0"><b>{point.y}</b></td></tr>',
    );
  });
});
