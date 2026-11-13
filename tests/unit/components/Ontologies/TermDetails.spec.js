import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";
import terms from "@/../tests/fixtures/subjectsOntologyBrowser.json";
import TermDetails from "@/components/Ontologies/TermDetails";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import ontologyQuery from "@/lib/GraphClient/queries/ontologies/subjectBrowser.json";
import editorStore from "@/store/editor";
import ontologyBrowserStore from "@/store/ontologyBrowser";

const TermDetailsTableStub = {
  name: "VDataTable",

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  template: `
    <table data-test="v-data-table">
      <tbody>
        <tr
          v-for="(item, index) in items"
          :key="item.id ?? index"
        >
          <td>
            <slot name="item.name" :item="item" />
          </td>
          <td>
            <slot name="item.status" :item="item" />
          </td>
          <td>
            <slot name="item.registry" :item="item" />
          </td>
        </tr>
      </tbody>
    </table>
  `,
};
const ClickableChipStub = {
  name: "VChip",
  inheritAttrs: false,
  template: `<button type="button" v-bind="$attrs"><slot /></button>`,
};

const sinon = require("sinon");
const vuetify = createVuetify(),
  $router = { push: vi.fn() },
  $store = new Vuex.Store({
    modules: {
      ontologyBrowser: ontologyBrowserStore,
      editor: editorStore,
    },
  });
let graphStub,
  wrapper,
  $route = {
    name: "Ontology Browser",
    path: "/browse/",
    params: { id: "subject" },
    query: {},
  };

describe("TermDetails.vue", () => {
  beforeAll(async () => {
    $store.state.ontologyBrowser.records = [];
    $store.state.currentPage = 1;

    graphStub = sinon.stub(GraphClient.prototype, "executeQuery");

    graphStub.returns({
      searchFairsharingRecords: {
        totalPages: 1,
        records: ["test"],
      },
    });

    graphStub.withArgs(ontologyQuery).returns({
      browseSubjects: {
        data: terms,
      },
    });

    await $store.dispatch("ontologyBrowser/fetchTerms");

    const biology = $store.state.ontologyBrowser.flattenedTree.find(
      (node) => node.name === "Biology",
    );

    if (!biology) {
      throw new Error("Biology is missing from the ontology fixture");
    }

    $store.state.ontologyBrowser.selectedTerm = {
      ...biology,
      records_count: biology.records_count ?? 0,
      descendants_count: biology.descendants_count ?? 0,
    };
  });

  afterAll(() => {
    graphStub.restore();
  });

  beforeEach(async () => {
    $router.push.mockClear();
    wrapper = await shallowMount(TermDetails, {
      global: {
        plugins: [vuetify],
        mocks: { $store, $route, $router },
        stubs: { VDataTable: TermDetailsTableStub, VChip: ClickableChipStub },
      },
      props: { selectedOntology: "Subject" },
    });
  });

  it("can be mounted", async () => {
    expect(wrapper.vm.$options.name).toMatch("TermDetails");
    expect(wrapper.vm.perPage).toBe(50);
    expect(wrapper.vm.currentPage).toBe(1);
    expect(wrapper.vm.selectedOntology).toBe("Subject");
    expect(wrapper.vm.selectedTerm.name).toBe("Biology");
    wrapper.vm.perPage = 10;
    expect(wrapper.vm.perPage).toBe(10);
    expect(wrapper.vm.currentPage).toBe(1);
  });

  it("can get a new page", async () => {
    await wrapper.vm.setPage(1);
    expect(wrapper.vm.currentPage).toBe(2);
    await wrapper.vm.setPage(-1);
    expect(wrapper.vm.currentPage).toBe(1);
  });

  it("can open a search page", () => {
    wrapper.vm.goToSearch();
    expect($router.push).toHaveBeenLastCalledWith({
      name: "search",
      query: { subjects: "Biology" },
    });
  });

  it("cam open a term page", () => {
    wrapper.vm.goToTerm("test");
    expect($router.push).toHaveBeenLastCalledWith({
      path: "/browse/",
      query: { term: "test" },
    });
  });

  it("returns to graph and clears the selected term", async () => {
    const dispatchSpy = vi.spyOn($store, "dispatch");
    await wrapper.vm.backToGraph();
    expect(wrapper.emitted("clearSelection")).toContainEqual([true]);
    expect(dispatchSpy).toHaveBeenCalledWith("ontologyBrowser/openTerms", []);
    expect($router.push).toHaveBeenCalledWith({
      path: "/browse/subject",
    });
    dispatchSpy.mockRestore();
  });

  it("renders record count and handles zero records", async () => {
    const selectedTerm = $store.state.ontologyBrowser.selectedTerm;
    selectedTerm.records_count = 0;
    await wrapper.vm.$nextTick();
    expect(wrapper.find("#metadata").text()).toContain("0");
    selectedTerm.records_count = 7;
    await wrapper.vm.$nextTick();
    expect(wrapper.find("#metadata").text()).toContain("7");
  });

  it("updates perPage through v-select", async () => {
    const select = wrapper.findComponent({
      name: "VSelect",
    });
    expect(select.exists()).toBe(true);
    select.vm.$emit("update:modelValue", 20);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.perPage).toBe(20);
  });

  it("navigates to search when Access All Search Options is clicked", async () => {
    const searchButton = wrapper
      .findAllComponents({ name: "VBtn" })
      .find((button) => button.text().includes("Access All Search Options"));
    expect(searchButton).toBeDefined();
    await searchButton.trigger("click");
    expect($router.push).toHaveBeenCalledWith({
      name: "search",
      query: {
        subjects: "Biology",
      },
    });
  });

  it("handles previous and next page icon clicks", async () => {
    const fetchSpy = vi
      .spyOn(wrapper.vm, "fetchNewPage")
      .mockResolvedValue(undefined);
    const icons = wrapper.findAllComponents({
      name: "VIcon",
    });
    const previousIcon = icons.find((icon) =>
      icon.text().includes("fa-chevron-left"),
    );
    const nextIcon = icons.find((icon) =>
      icon.text().includes("fa-chevron-right"),
    );
    expect(previousIcon).toBeDefined();
    expect(nextIcon).toBeDefined();
    await previousIcon.trigger("click");
    await nextIcon.trigger("click");
    expect(fetchSpy).toHaveBeenCalledWith(-1);
    expect(fetchSpy).toHaveBeenCalledWith(1);
    fetchSpy.mockRestore();
  });

  it("renders record name, status and registry in table slots", async () => {
    $store.state.ontologyBrowser.records = [
      {
        id: 101,
        name: "Test Database",
        type: "database",
        registry: "database",
        status: "ready",
      },
    ];
    await wrapper.vm.$nextTick();
    const table = wrapper.find('[data-test="v-data-table"]');
    expect(table.exists()).toBe(true);
    expect(table.text()).toContain("Test Database");
    expect(table.text()).toContain("database");
    const recordLink = table.find('a[href="/101"]');
    expect(recordLink.exists()).toBe(true);
  });

  it("navigates back to graph when the back chip is clicked", async () => {
    const backChip = wrapper
      .findAllComponents({ name: "VChip" })
      .find((chip) => chip.text().includes("GO BACK TO GRAPH"));

    expect(backChip).toBeDefined();

    await backChip.trigger("click");

    expect(wrapper.emitted("clearSelection")).toContainEqual([true]);

    expect($router.push).toHaveBeenCalledWith({
      path: "/browse/subject",
    });
  });
});
