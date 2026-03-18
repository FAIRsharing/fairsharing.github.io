/* eslint-env jest */

import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import terms from "@/../tests/fixtures/subjectsOntologyBrowser.json";
import OntologySunburst from "@/components/Ontologies/OntologySunburst";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import fairSharingTheme from "@/plugins/theme";
import ontologyBrowserStore from "@/store/ontologyBrowser";

const sinon = require("sinon");
const vuetify = createVuetify({
    theme: {
      defaultTheme: "fairSharingTheme",
      themes: { fairSharingTheme },
    },
  }),
  $router = { push: vi.fn() },
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
        plugins: [vuetify, $store],

        mocks: {
          $route,
          $router,
          $store,
        },

        //Add highcharts to stubs to stop the "Failed to resolve" warning
        stubs: {
          highcharts: { template: "<div></div>" },
        },
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
    const node = {
      name: "test",
      descendants_count: 0,
      identifier: 2,
      id: 1,
      ancestors: [1],
    };

    wrapper.vm.processClickEvent(node);

    // Use objectContaining to ignore any extra hidden properties
    expect($router.push).toHaveBeenCalledWith(
      expect.objectContaining({
        path: "/browse/",
        query: { term: "test" },
      }),
    );

    $router.push.mockClear();
  });
});
