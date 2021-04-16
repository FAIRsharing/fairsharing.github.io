import { shallowMount, createLocalVue } from "@vue/test-utils"
import PieChart from "@/components/Static/Statistics/PieChart.vue"
import VueRouter from "vue-router"


const router = new VueRouter();
const $router = { push: jest.fn() };

const localVue = createLocalVue();

describe("PieChart.vue", () => {
  let wrapper;
  beforeAll( () => {
      wrapper = shallowMount(PieChart, {
          localVue,
          router,
          propsData: {
            refName: "Name of the Pie chart",
            textTitle: "This a pie chart",
            dataChart:
            [
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
      });
  });

  it("can be mounted", () => {
      expect(wrapper.name()).toMatch("PieChart");
      expect(wrapper.vm.optionChartPie.title.text).toBe("This a pie chart");
      expect(wrapper.vm.nameChart).toBe("Name of the Pie chart");
      expect(wrapper.vm.optionChartPie.series[0].data[1].y).toBe(10);
  });
});
