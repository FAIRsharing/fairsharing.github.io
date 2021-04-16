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
    //graphStub.withArgs(getFilters).returns(fakeDataStats);
    //See tests/unit/components/Editor/GeneralInformation/GeneralInformation.spec.js

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
      //console.log(wrapper.vm.allDataStats);
      expect(wrapper.vm.chartRegistries.title).toBe("Content divided by type");
      expect(wrapper.vm.chartRegistries.data[0].name).toBe("Standards");
      expect(wrapper.vm.chartRegistries.data[3].y).toBe(500);

      expect(wrapper.vm.chartSubjects["policy"].yAxisTitle).toBe('Number of policies');
      expect(wrapper.vm.chartSubjects["policy"].series[0].name).toBe('Natural Science');
      expect(wrapper.vm.chartSubjects["standard"].series[2].data[0].z).toBe(100*4/74);

      expect(wrapper.vm.chartCountries["database"].xAxisTitle).toBe('Countries');
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




  });
  it("clicks methods work properly", async () => {
    expect(wrapper.vm.activeChart).toBe(0);
    wrapper.vm.chartSelection(3);
    expect(wrapper.vm.activeChart).toBe(3);
  });

});
