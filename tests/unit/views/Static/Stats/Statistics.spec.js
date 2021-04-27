import { shallowMount, createLocalVue } from "@vue/test-utils"
import sinon from "sinon"
import VueRouter from "vue-router"
import GraphClient from "@/lib/GraphClient/GraphClient.js"
//import getFilters from "@/lib/GraphClient/queries/getFilters.json"
import Stats from "@/views/Static/Stats/Statistics.vue"
import dataStats from "../../../../fixtures/getRecordsForStats.json"

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

  afterEach(() => {
    graphStub.restore();
  });

  it("can be mounted and data properly created", async () => {
      const title = "Statistics";
      expect(wrapper.name()).toMatch(title);
      //console.log(wrapper.vm.allDataStats.aggregations.policy.subjects);
      expect(wrapper.vm.chartRegistries.title).toBe("Content divided by type");
      expect(wrapper.vm.chartRegistries.data[0].name).toBe("Standards");
      expect(wrapper.vm.chartRegistries.data[3].y).toBe(500);

      expect(wrapper.vm.chartSubjects["policy"].textYAxis).toBe('Number of policies');
      expect(wrapper.vm.chartSubjects["policy"].series[0].name).toBe('Natural Science');
      expect(wrapper.vm.chartSubjects["standard"].series[2].data[0].z).toBe(100*4/74);

      expect(wrapper.vm.chartCountries["database"].textXAxis).toBe('Countries');
      expect(wrapper.vm.chartCountries["database"].series.length).toBe(10);
      expect(wrapper.vm.chartCountries["policy"].series[0].name).toBe('USA');
      expect(wrapper.vm.chartCountries["standard"].series[9].data[0].y).toBe(50);

      expect(wrapper.vm.chartSpecies["policy"].title).toBe('Top 10 species covered by policies');
      expect(wrapper.vm.chartSpecies["standard"].series.length).toBe(1);
      expect(wrapper.vm.chartSpecies["database"].series[0].data[0].y).toBe(27);

      expect(wrapper.vm.chartLicences["database"].title).toBe("Top 10 licenses for database content");
      expect(wrapper.vm.chartLicences["standard"].series[0].name).toBe("CC BY 3.0");
      expect(wrapper.vm.chartLicences["database"].series[1].data[0].y).toBe(15);

      expect(wrapper.vm.chartMaintainer["policy"].title).toBe("Policy records that have maintainers");
      expect(wrapper.vm.chartMaintainer["standard"].data[0].name).toBe("No");
      expect(wrapper.vm.chartMaintainer["database"].data[1].y).toBe(27);
      expect(wrapper.vm.chartMaintainer["policy"].data[1].url).toBe('/#/search?fairsharingRegistry=policy&isMaintained=false');

      expect(wrapper.vm.chartLinkPie['database'].data.length).toBe(5);
      expect(wrapper.vm.chartLinkPie['database'].data[3].name).toBe("11-100");
      expect(wrapper.vm.chartLinkPie['database'].data[0].y).toBe(212);

      expect(wrapper.vm.chartImplements['database'].series.length).toBe(2);
      expect(wrapper.vm.chartImplements['database'].series[0].name).toBe("name1");
      expect(wrapper.vm.chartImplements['database'].series[1].data[0].y).toBe(22);

      expect(wrapper.vm.chartHavePublication['database'].data[0].y).toBe(1115);
      expect(wrapper.vm.chartHavePublication['database'].data[1].name).toBe("No");

      expect(wrapper.vm.chartImplements['standard'].series.length).toBe(4);
      expect(wrapper.vm.chartImplements['standard'].series[1].name).toBe("POTR");
      expect(wrapper.vm.chartJournals['standard'].series[1].data[0].y).toBe(25);
      expect(wrapper.vm.chartJournals['database'].series[0].name).toBe("ENA");

      expect(wrapper.vm.chartFunders['standard'].series[0].name).toBe("org1, Germany");
      expect(wrapper.vm.chartFunders['database'].series[1].data[0].y).toBe(22);
      expect(wrapper.vm.chartFunders['policy'].series.length).toBe(3);
      expect(wrapper.vm.chartNonFunders['standard'].title).toBe("Top 10 organisations (excluding funders) of standards");
      expect(wrapper.vm.chartNonFunders['database'].series[0].name).toBe("BLADB");
      expect(wrapper.vm.chartNonFunders['policy'].series[0].data[0].y).toBe(33);

  });
  it("clicks methods work properly", async () => {
    expect(wrapper.vm.activeChart).toBe(0);
    wrapper.vm.chartSelection(3);
    expect(wrapper.vm.activeChart).toBe(3);
  });

});
