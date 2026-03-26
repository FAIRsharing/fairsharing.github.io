import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStore } from "vuex";
import OntologyBrowser from "@/views/Browsers/OntologyBrowser.vue";

describe("OntologyBrowser.vue", () => {
  let wrapper;
  let store;
  let mockActions;

  // Mock Router setup
  const mockRoute = {
    params: { id: "domain" }, // Valid ontology type
    query: {},
    path: "/ontology/domain",
  };
  const mockRouter = { push: vi.fn() };

  // Mock Tree Data
  const mockTree = [
    {
      identifier: 1,
      name: "Root",
      hasChildren: true,
      children: [
        { identifier: 10, name: "Child A", hasChildren: false, children: [] },
        {
          identifier: 11,
          name: "Child B",
          hasChildren: true,
          children: [
            {
              identifier: 110,
              name: "Grandchild",
              hasChildren: false,
              children: [],
            },
          ],
        },
      ],
    },
    { identifier: 2, name: "Root 2", hasChildren: false, children: [] },
  ];

  const mockFlattenedTree = [
    { identifier: 1, name: "Root" },
    { identifier: 10, name: "Child A" },
    { identifier: 11, name: "Child B" },
    { identifier: 110, name: "Grandchild" },
    { identifier: 10, name: "Child A (Duplicate)" }, // Intentional duplicate ID to test uniqueness
  ];

  const createVuexStore = (overrideState = {}) => {
    mockActions = {
      fetchTerms: vi.fn(),
      fetchRecords: vi.fn(),
      resetPagination: vi.fn(),
      activateTerms: vi.fn(),
      openTerms: vi.fn(),
      leavePage: vi.fn(),
    };

    return createStore({
      modules: {
        editor: {
          namespaced: true,
          state: { colors: { domain: "red", subject: "blue" } },
        },
        ontologyBrowser: {
          namespaced: true,
          state: {
            tree: mockTree,
            records: [],
            loadingData: false,
            flattenedTree: mockFlattenedTree,
            pagination: {},
            selectedTerm: null,
            activeTerms: [],
            openedTerms: [],
            ...overrideState,
          },
          actions: mockActions,
        },
      },
    });
  };

  const mountComponent = (stateOverrides = {}, customStubs = {}) => {
    store = createVuexStore(stateOverrides);

    wrapper = shallowMount(OntologyBrowser, {
      global: {
        plugins: [store],
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
        },
        stubs: {
          NotFound: true,
          Loaders: true,
          OntologySunburst: true,
          TermDetails: true,
          "v-autocomplete": true,
          "v-virtual-scroll": true,
          ...customStubs,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- 1. LIFECYCLE & BASIC COMPUTED PROPERTIES ---

  it("fetches terms on mount and cleans up on unmount", () => {
    mountComponent();
    expect(mockActions.fetchTerms).toHaveBeenCalled();

    wrapper.unmount();
    expect(mockActions.leavePage).toHaveBeenCalled();
  });

  it("computes error as false when the ontology route is valid", () => {
    // mockRoute is currently set to 'domain' by default
    mountComponent();
    expect(wrapper.vm.error).toBe(false);
  });

  it("computes error as true when the ontology route is invalid", () => {
    // 1. Temporarily change the mock route BEFORE mounting
    mockRoute.params.id = "invalid_ontology";

    // 2. Mount the component so the computed property evaluates with the bad route
    mountComponent();

    // 3. Now it will correctly evaluate to true!
    expect(wrapper.vm.error).toBe(true);

    // 4. Reset the mockRoute back to normal so we don't break the other tests!
    mockRoute.params.id = "domain";
  });

  it("filters uniqueSearchItems correctly to remove duplicate IDs", () => {
    mountComponent();
    const items = wrapper.vm.uniqueSearchItems;

    // flattenedTree has 5 items, but two share identifier '10'
    expect(items.length).toBe(4);
    const id10s = items.filter((i) => i.identifier === 10);
    expect(id10s.length).toBe(1); // Only one remains
  });

  // --- 2. TREE LOGIC: VISIBLE NODES & PRUNING ---

  it("computes visibleNodes correctly when nothing is expanded", () => {
    mountComponent({ openedTerms: [] }); // Nothing open
    const visible = wrapper.vm.visibleNodes;

    // Only root nodes should be visible
    expect(visible.length).toBe(2);
    expect(visible[0].identifier).toBe(1);
    expect(visible[1].identifier).toBe(2);
  });

  it("computes visibleNodes correctly when a node is expanded", () => {
    // Open node '1'
    mountComponent({ openedTerms: [1] });
    const visible = wrapper.vm.visibleNodes;

    // Roots (2) + Children of Node 1 (2) = 4 visible nodes
    expect(visible.length).toBe(4);
    expect(visible.map((n) => n.identifier)).toEqual([1, 10, 11, 2]);
    // Check depth
    expect(visible.find((n) => n.identifier === 10).depth).toBe(1);
  });

  it("prunes the tree correctly when searching for a nested child", () => {
    mountComponent();

    // Manually test the prune method
    const pruned = wrapper.vm.pruneTreeWithChildren(mockTree, 110);

    // It should keep Root (1) -> Child B (11) -> Grandchild (110)
    // And drop Root 2 and Child A entirely
    expect(pruned.length).toBe(1);
    expect(pruned[0].identifier).toBe(1);
    expect(pruned[0].children[0].identifier).toBe(11);
    expect(pruned[0].children[0].children[0].identifier).toBe(110);
  });

  it("finds all paths to a target node", () => {
    mountComponent();
    const paths = wrapper.vm.findAllPaths(mockTree, 110);

    expect(paths).toEqual([[1, 11, 110]]);
  });

  // --- 3. METHODS & INTERACTIONS ---

  it("toggles an open node to closed", () => {
    mountComponent({ openedTerms: [1, 11] }); // 1 and 11 are open

    const nodeToToggle = { identifier: 11, hasChildren: true };
    wrapper.vm.toggleNode(nodeToToggle);

    // It should dispatch openTerms without '11'
    expect(mockActions.openTerms).toHaveBeenCalled();
    const payload = mockActions.openTerms.mock.calls[0][1]; // [0] context, [1] payload
    expect(payload).toEqual([1]);
  });

  it("toggles a closed node to open", () => {
    mountComponent({ openedTerms: [1] }); // Only 1 is open

    const nodeToToggle = { identifier: 11, hasChildren: true };
    wrapper.vm.toggleNode(nodeToToggle);

    // It should dispatch openTerms adding '11'
    expect(mockActions.openTerms).toHaveBeenCalled();
    const payload = mockActions.openTerms.mock.calls[0][1];
    expect(payload).toEqual([1, 11]);
  });

  it("handles searchTerm correctly when term is NOT active", () => {
    mountComponent({ activeTerms: [1] });

    const newTerm = { identifier: 2, name: "Root 2" };
    wrapper.vm.searchTerm(newTerm);

    expect(mockActions.resetPagination).toHaveBeenCalled();
    // Should push to router with encoded name
    expect(mockRouter.push).toHaveBeenCalledWith({
      path: "/ontology/domain",
      query: { term: "Root%202" },
    });
  });

  it("handles searchTerm correctly when term IS already active", () => {
    mountComponent({ activeTerms: [2] }); // Term is active

    const existingTerm = { identifier: 2, name: "Root 2" };
    wrapper.vm.searchTerm(existingTerm);

    expect(mockActions.resetPagination).toHaveBeenCalled();
    // Should push to router WITHOUT the query term (clearing it)
    expect(mockRouter.push).toHaveBeenCalledWith({
      path: "/ontology/domain",
    });
  });

  it("isOpen() returns true when the identifier matches, safely handling Number/String type mixing", () => {
    mountComponent({ openedTerms: [1, "2", 300] });
    expect(wrapper.vm.isOpen(1)).toBe(true);
    expect(wrapper.vm.isOpen("2")).toBe(true);

    expect(wrapper.vm.isOpen("1")).toBe(true);
    expect(wrapper.vm.isOpen(2)).toBe(true);
  });

  it("can check subjectNode method", () => {
    mountComponent(); // Term is active
    wrapper.vm.subjectNode(["A", "B", "C"]);
    expect(wrapper.vm.search).toBe("A");
    expect(wrapper.vm.toggleNode("A")).toHaveBeenCalled;

    wrapper.vm.subjectNode([]);
    expect(wrapper.vm.search).toBe(null);
  });

  it("can check noSelection method", () => {
    mountComponent(); // Term is active
    wrapper.vm.noSelection(true);
    expect(wrapper.vm.search).toBe(null);
  });

  describe("watch: search", () => {
    beforeEach(() => {
      // Hijack the global clock so we can instantly resolve setTimeouts
      vi.useFakeTimers();
    });

    afterEach(() => {
      // Put the clock back to normal so other tests aren't affected
      vi.useRealTimers();
      vi.restoreAllMocks();
    });
    it("clears open terms when search is reset to null", async () => {
      mountComponent();

      // 1. Give 'search' a fake value first so Vue registers a change later
      wrapper.vm.search = { identifier: 999 };
      await wrapper.vm.$nextTick(); // Wait for the watcher to run once

      // 2. Clear the spy so we don't accidentally count the setup step
      mockActions.openTerms.mockClear();

      // 3. NOW trigger the watcher by clearing the search!
      wrapper.vm.search = null;
      await wrapper.vm.$nextTick();

      // 4. Assert it called the action with an empty array
      expect(mockActions.openTerms).toHaveBeenCalled();
      const payload = mockActions.openTerms.mock.calls[0][1];
      expect(payload).toEqual([]);
    });
  });
  describe("watch: term", () => {
    it("activates the term and opens all unique parents when a new term is selected", async () => {
      // 1. Setup our mock data
      const mockTerm = { identifier: "110", name: "Brain" };
      const mockTree = [{ fakeNode: true }]; // Doesn't matter what this is, just needs to exist

      // We mock findAllPaths to return two different paths that lead to the same term.
      // Notice how 'root-node' is in both paths to test that the Set() deduplicates it!
      const mockPaths = [
        ["root-node", "parent-A", "110"],
        ["root-node", "parent-B", "110"],
      ];

      // 2. Spy on the component's methods and Vuex actions
      const activateTermsSpy = vi
        .spyOn(wrapper.vm, "activateTerms")
        .mockResolvedValue();
      const openTermsSpy = vi
        .spyOn(wrapper.vm, "openTerms")
        .mockImplementation(() => {});
      const findAllPathsSpy = vi
        .spyOn(wrapper.vm, "findAllPaths")
        .mockReturnValue(mockPaths);

      // Explicitly set the tree state on the wrapper so findAllPaths has something to read
      vi.spyOn(wrapper.vm, "tree", "get").mockReturnValue(mockTree);

      // 🌟 THE KILLSHOT: Call the watcher function directly!
      // This bypasses Vue entirely and just tests your pure JavaScript logic.
      await wrapper.vm.$options.watch.term.call(wrapper.vm, mockTerm);

      // 3. Verify it activated the term
      expect(activateTermsSpy).toHaveBeenCalledWith(mockTerm);

      // 4. Verify it searched the tree correctly
      expect(findAllPathsSpy).toHaveBeenCalledWith(mockTree, "110");

      // 5. Verify it extracted parents, removed the target ('110'), and deduplicated ('root-node')
      // The expected output should just be the unique parents.
      expect(openTermsSpy).toHaveBeenCalledWith([
        "root-node",
        "parent-A",
        "parent-B",
      ]);
    });

    it("clears active terms when the term is set to null", async () => {
      // 1. Spy on the methods we expect to be called (or NOT called)
      const activateTermsSpy = vi
        .spyOn(wrapper.vm, "activateTerms")
        .mockResolvedValue();
      const openTermsSpy = vi
        .spyOn(wrapper.vm, "openTerms")
        .mockImplementation(() => {});

      // 2. Call the watcher with a falsy value (e.g., clearing the search)
      await wrapper.vm.$options.watch.term.call(wrapper.vm, null);

      // 3. Verify it called activateTerms with NO arguments
      expect(activateTermsSpy).toHaveBeenCalledWith();

      // 4. Verify it never tried to open terms
      expect(openTermsSpy).not.toHaveBeenCalled();
    });
  });
});
