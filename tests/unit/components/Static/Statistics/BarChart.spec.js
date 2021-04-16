import { shallowMount, createLocalVue } from "@vue/test-utils"
import BarChart from "@/components/Static/Statistics/BarChart.vue"

const localVue = createLocalVue();

describe("BarChart.vue", () => {
  let wrapper;
  beforeAll( () => {
      wrapper = shallowMount(BarChart, {
          localVue,
          propsData: {
            refName: "Name of the chart",
            textTitle: "This a bar chart",
            textXAxis: "X axis",
            textYAxis: "Y axis",
            dataChart: [
                {
                  name: "USA",
                  data: [
                    {
                      y: 50
                    }
                  ]
                },
                {
                  name: "EU",
                  data: [
                    {
                      y: 100
                    }
                  ]
                }
            ]
          }
      });
  });

  it("can be mounted", () => {
      expect(wrapper.name()).toMatch("BarChart");
      expect(wrapper.vm.optionChartBars.title.text).toBe("This a bar chart");
      expect(wrapper.vm.nameChart).toBe("Name of the chart");
      expect(wrapper.vm.optionChartBars.series[1].name).toMatch("EU");
  });
});
