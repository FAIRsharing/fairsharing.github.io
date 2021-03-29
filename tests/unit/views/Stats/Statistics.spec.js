import { shallowMount, createLocalVue } from "@vue/test-utils"
import sinon from "sinon"
import VueRouter from "vue-router"
import GraphClient from "@/components/GraphClient/GraphClient.js"
import Stats from "@/views/Stats/Statistics.vue"
import dataStats from "../../../fixtures/getRecordsForStats.json"

const localVue = createLocalVue();

const router = new VueRouter();
const $router = { push: jest.fn() };

let fakeDataStats =  dataStats;

describe("Statistics.vue", () => {
  let wrapper;
  let graphStub;

  beforeAll( async (done) => {

    graphStub = sinon.stub(GraphClient.prototype, "executeQuery").returns(fakeDataStats);

    wrapper = await shallowMount(Stats, {
        localVue,
        router,
        mocks: {$router}
    });
    done();
  });

  it("can be mounted and data properly created", async () => {
      const title = "Statistics";
      expect(wrapper.name()).toMatch(title);
      expect(wrapper.vm.optionChartPie1.chart.type).toBe("pie");

      expect(wrapper.vm.optionChartPie1.series[0].data.length).toBe(4);
      expect(wrapper.vm.optionChartPie1.series[0].data[0].name).toBe("Standards");
      expect(wrapper.vm.optionChartPie1.series[0].data[3].y).toBe(500);

      expect(wrapper.vm.optionChartBars1.chart.type).toBe("column");
      expect(wrapper.vm.optionChartBars1.series.length).toBe(10);
      expect(wrapper.vm.optionChartBars1.series[0].name).toBe("USA");
      expect(wrapper.vm.optionChartBars1.series[2].name).toBe("Germany");
      expect(wrapper.vm.optionChartBars1.series[9].data[0].y).toBe(50);
  });

});
