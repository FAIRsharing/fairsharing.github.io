import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { flushPromises, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import terms from "@/../tests/fixtures/subjectsOntologyBrowser.json";
import OntologySunburst from "@/components/Ontologies/OntologySunburst";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import fairSharingTheme from "@/plugins/theme";
import ontologyBrowserStore from "@/store/ontologyBrowser";

const sinon = require("sinon");
const modules = vi.hoisted(() => ({ sunburst: vi.fn(), exporting: vi.fn() }));
vi.mock("highcharts", () => ({ default: { chart: vi.fn() } }));
vi.mock("highcharts/modules/sunburst", () => ({
  get default() {
    return modules.sunburst;
  },
}));
vi.mock("highcharts/modules/exporting", () => ({
  get default() {
    return modules.exporting;
  },
}));
vi.mock("highcharts-vue", () => ({
  Chart: { props: ["options"], template: '<div data-test="chart" />' },
}));
const initialState = structuredClone(ontologyBrowserStore.state);
const vuetify = createVuetify({
    theme: {
      defaultTheme: "fairSharingTheme",
      themes: { fairSharingTheme },
    },
  }),
  $router = { push: vi.fn() };
let $store,
  graphStub,
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
  });

  afterAll(() => {
    graphStub.restore();
  });

  beforeEach(async () => {
    $router.push.mockClear();
    $route.query = {};
    modules.sunburst = vi.fn();
    modules.exporting = vi.fn();
    $store = new Vuex.Store({
      modules: {
        ontologyBrowser: {
          ...ontologyBrowserStore,
          state: structuredClone(initialState),
        },
      },
    });
    graphStub.returns({ browseSubjects: { data: structuredClone(terms) } });
    await $store.dispatch("ontologyBrowser/fetchTerms");
    wrapper = mount(OntologySunburst, {
      global: {
        plugins: [vuetify, $store],

        mocks: {
          $route,
          $router,
          $store,
        },

        //Add highcharts to stubs to stop the "Failed to resolve" warning
        stubs: {
          highcharts: false,
        },
      },
    });
    await flushPromises();
  });

  afterEach(() => wrapper.unmount());

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

  it("initializes chart modules before showing the chart and hides it while loading", async () => {
    expect(modules.sunburst).toHaveBeenCalledWith(
      expect.objectContaining({ chart: expect.any(Function) }),
    );
    expect(modules.exporting).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.isBrowser).toBe(true);
    expect(wrapper.vm.modulesReady).toBe(true);
    expect(wrapper.find('[data-test="chart"]').exists()).toBe(true);
    $store.commit("ontologyBrowser/setLoadingData", true);
    await wrapper.vm.$nextTick();
    expect(wrapper.find('[data-test="chart"]').exists()).toBe(false);
    $store.commit("ontologyBrowser/setLoadingData", false);
    await wrapper.setData({ modulesReady: false });
    expect(wrapper.find('[data-test="chart"]').exists()).toBe(false);
    await wrapper.setData({ modulesReady: true, isBrowser: false });
    expect(wrapper.find('[data-test="chart"]').exists()).toBe(false);
  });

  it.each(["nested", "unavailable"])(
    "supports %s module export formats",
    async (format) => {
      const sunburst = vi.fn(),
        exporting = vi.fn();
      modules.sunburst =
        format === "nested" ? { default: sunburst } : undefined;
      modules.exporting = format === "nested" ? { default: exporting } : null;
      await OntologySunburst.mounted.call(wrapper.vm);
      expect(wrapper.vm.modulesReady).toBe(true);
      if (format === "nested") {
        expect(sunburst).toHaveBeenCalledTimes(1);
        expect(exporting).toHaveBeenCalledTimes(1);
      } else {
        expect(sunburst).not.toHaveBeenCalled();
        expect(exporting).not.toHaveBeenCalled();
      }
    },
  );

  it("flattens nested terms and ignores malformed trees", () => {
    wrapper.vm.subjectsArrList = [];
    const child = { identifier: 2, name: "Child", children: [] };
    const parent = { identifier: 1, name: "Parent", children: [child] };
    wrapper.vm.flattenedOriginalTree(null);
    wrapper.vm.flattenedOriginalTree({ children: [] });
    expect(wrapper.vm.subjectsArrList).toEqual([]);
    wrapper.vm.flattenedOriginalTree([parent, { identifier: 3, name: "Leaf" }]);
    expect(wrapper.vm.subjectsArrList.map((n) => n.identifier)).toEqual([
      1, 2, 3,
    ]);
  });

  it("connects chart click and tooltip callbacks to subject behavior", () => {
    const node = {
      name: "Cell biology",
      identifier: 17,
      descendants_count: 0,
      ancestors: [],
    };
    const options = wrapper.vm.sunburstOptions;
    options.series[0].point.events.click.call(node);
    expect($router.push).toHaveBeenCalledWith({
      path: "/browse/",
      query: { term: "Cell%20biology" },
    });
    expect(wrapper.emitted("subjectNode")).toEqual([[[]]]);
    expect(options.tooltip.formatter.call({ point: node })).toBe(
      '<div class="HC-tooltip">Cell biology</div>',
    );
    expect(
      options.tooltip.formatter.call({ point: { name: "Subjects" } }),
    ).toBe(false);
    expect(options.series[0].data).toEqual(
      $store.state.ontologyBrowser.sunburstData,
    );
  });

  it("ignores the singular root subject", () => {
    wrapper.vm.processClickEvent({
      name: "Subject",
      identifier: 0,
      descendants_count: 0,
    });
    expect($router.push).not.toHaveBeenCalled();
    expect(wrapper.emitted("subjectNode")).toBeUndefined();
    expect(wrapper.vm.nodeClicked).toBe("");
  });

  it("does not navigate again for the current decoded leaf term", () => {
    $route.query = { term: "Cell%20biology" };
    wrapper.vm.processClickEvent({
      name: "Cell biology",
      identifier: 17,
      descendants_count: 0,
      ancestors: [],
    });
    expect($router.push).not.toHaveBeenCalled();
    expect(wrapper.emitted("subjectNode")).toEqual([[[]]]);
  });

  it("selects branches and returns to their ancestor on a repeated click", () => {
    const child = { identifier: 2, name: "Child", children: [] };
    const parent = { identifier: 1, name: "Parent", children: [child] };
    wrapper.vm.subjectsArrList = [parent, child];
    const node = { ...child, descendants_count: 1, ancestors: [1] };
    wrapper.vm.processClickEvent(node);
    expect(wrapper.vm.nodeClicked).toBe(2);
    expect(wrapper.emitted("subjectNode")[0]).toEqual([[child]]);
    wrapper.vm.processClickEvent(node);
    expect(wrapper.vm.nodeClicked).toBe(1);
    expect(wrapper.emitted("subjectNode")[1]).toEqual([
      [{ ...parent, hasChildren: true, isSunburst: true }],
    ]);
    expect($router.push).not.toHaveBeenCalled();
  });

  it("does not emit a subject when a clicked identifier has no matching term", () => {
    wrapper.vm.subjectsArrList = [];
    wrapper.vm.processClickEvent({
      name: "Missing",
      identifier: 999,
      descendants_count: 1,
    });
    expect(wrapper.vm.nodeClicked).toBe(999);
    expect(wrapper.emitted("subjectNode")).toBeUndefined();
  });
});
