import { shallowMount, createLocalVue } from "@vue/test-utils"
import PieChart from "@/components/Static/Statistics/PieChart.vue"

const localVue = createLocalVue();

describe("PieChart.vue", () => {
  let wrapper;
  beforeAll( () => {
      wrapper = shallowMount(PieChart, {
          localVue,
          propsData: {
            refName: "Name of the Pie chart",
            fieldsChart: {
              title: "This a pie chart",
              data:  [
                       {
                         name: "database",
                         y: 50
                        },
                        {
                         name: "policy",
                         y: 10
                        }
                    ]
              }
            }
        });
    });
  it("can be mounted", () => {
      expect(wrapper.name()).toMatch("PieChart");
      expect(wrapper.vm.optionChartPie.title.text).toBe("This a pie chart");
      expect(wrapper.vm.nameChart).toBe("Name of the Pie chart");
      expect(wrapper.vm.optionChartPie.series[0].data[1].y).toBe(10);
  });

  it("can use not links", () => {
    wrapper = shallowMount(PieChart, {
        localVue,
        propsData: {
          linkWork: false,
          refName: "Name of the Pie chart",
          fieldsChart: {
            title: "This a pie chart",
            data:  []
          }
        }
    });

    expect(wrapper.vm.optionChartPie.series[0].point.events.click).toBe(null);
  });

});
