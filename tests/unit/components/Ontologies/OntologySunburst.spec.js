import { shallowMount  } from "@vue/test-utils";
import Highcharts from "highcharts";
import Sunburst from "highcharts/modules/sunburst";
import HighchartsVue from "highcharts-vue";
import VueRouter from "vue-router";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import terms from "@/../tests/fixtures/subjectsOntologyBrowser.json";
import OntologySunburst from "@/components/Ontologies/OntologySunburst";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import fairSharingTheme from "@/plugins/theme";
import ontologyBrowserStore from "@/store/ontologyBrowser";

const sinon = require("sinon");
const router = new VueRouter(),
  vuetify = createVuetify({
    theme: {
      defaultTheme: "fairSharingTheme",
      themes: { fairSharingTheme },
    },
  }),
  $router = { push: jest.fn() },
  $store = new Vuex.Store({
    modules: { ontologyBrowser: ontologyBrowserStore },
  });
let graphStub,
  wrapper,
  $route = {
    name: "Ontology Browser",
    path: "/browse/",
    params: { id: "subject" },
    query: {},
  };

describe("OntologyBrowser.vue", function () {
  beforeAll(async () => {
    graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
    graphStub.returns({ browseSubjects: { data: terms } });
    await $store.dispatch("ontologyBrowser/fetchTerms");
  });

  afterAll(() => {
    graphStub.restore();
  });

  beforeEach(async () => {
    wrapper = await shallowMount(OntologySunburst, {
      global: {
        plugins: [vuetify, router],
        mocks: { $store, $route, $router },
      },
    });
  });

  it("can be mounted and get dynamic width", async () => {
    expect(wrapper.vm.$options.name).toMatch("OntologySunburst");
    expect(wrapper.vm.sunburstOptions.series[0].type).toBe("sunburst");
    expect(Array.isArray(wrapper.vm.sunburstOptions.series[0].data)).toBe(true);
  });

  it("can get a tooltip", () => {
    expect(wrapper.vm.getTooltip({ name: "Subjects" })).toBeFalsy();
    expect(wrapper.vm.getTooltip({ name: "Biology" })).toBe(
      '<div class="HC-tooltip">Biology</div>',
    );
  });

  it("can process click events", () => {
    wrapper.vm.$route.query = { term: "test" };
    const node = {
      name: "test",
      descendants_count: 0,
      identifier: 2,
      id: 1,
      ancestors: [1],
    };
    wrapper.vm.processClickEvent(node);
    expect($router.push).toHaveBeenCalledWith({
      path: "/browse/",
      query: { term: "test" },
    });
    $router.push.mockClear();

    wrapper.vm.$route.query = {};
    wrapper.vm.processClickEvent(node);
    expect($router.push).toHaveBeenCalledWith({
      path: "/browse/",
      query: { term: "test" },
    });

    node.descendants_count = 1;
    wrapper.vm.$route.query = { term: "test" };
    node.name = "Subject";
    wrapper.vm.processClickEvent(node);
    expect(wrapper.emitted("subjectNode")).toBeTruthy();

    node.name = "biology";
    wrapper.vm.processClickEvent(node);
    const emittedAfterBiology = wrapper.emitted("subjectNode");
    expect(Array.isArray(emittedAfterBiology.at(-1)[0])).toBe(true);

    node.innerArcLength = 0;
    wrapper.vm.processClickEvent(node);
    const emittedAfterSecondClick = wrapper.emitted("subjectNode");
    expect(Array.isArray(emittedAfterSecondClick.at(-1)[0])).toBe(true);

    node.descendants_count = 0;
    wrapper.vm.processClickEvent(node);
    expect($router.push).toHaveBeenCalledWith({
      path: "/browse/",
      query: { term: "biology" },
    });
  });
});
