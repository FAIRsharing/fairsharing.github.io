import { vi } from "vitest";
import GraphQLClient from "@/lib/GraphClient/GraphClient.js";
import RESTClient from "@/lib/Client/RESTClient.js";

// Vue 2 -> Vue 3 test compatibility for legacy specs.
vi.mock("@vue/test-utils", async () => {
  const actual = await vi.importActual("@vue/test-utils");

  const normalizeOptions = (options = {}) => {
    const normalized = { ...options };
    const globalConfig = { ...(normalized.global || {}) };

    if (normalized.propsData && !normalized.props) {
      normalized.props = normalized.propsData;
    }

    const legacyPlugins = [normalized.store, normalized.router, normalized.vuetify]
      .filter(Boolean);
    if (legacyPlugins.length > 0) {
      globalConfig.plugins = [...(globalConfig.plugins || []), ...legacyPlugins];
    }

    if (normalized.mocks) {
      globalConfig.mocks = { ...(globalConfig.mocks || {}), ...normalized.mocks };
    }
    globalConfig.mocks = {
      $scrollTo: vi.fn(),
      ...(globalConfig.mocks || {}),
    };

    if (normalized.stubs) {
      globalConfig.stubs = { ...(globalConfig.stubs || {}), ...normalized.stubs };
    }

    if (normalized.mixins) {
      globalConfig.mixins = [...(globalConfig.mixins || []), ...normalized.mixins];
    }

    normalized.global = globalConfig;

    delete normalized.localVue;
    delete normalized.store;
    delete normalized.router;
    delete normalized.vuetify;
    delete normalized.mocks;
    delete normalized.stubs;
    delete normalized.mixins;
    delete normalized.propsData;

    return normalized;
  };

  const withDestroyAlias = (wrapper) => {
    if (wrapper && typeof wrapper.unmount === "function" && !wrapper.destroy) {
      wrapper.destroy = () => wrapper.unmount();
    }
    return wrapper;
  };

  const createLocalVue = () => ({
    use() {},
    mixin() {},
  });

  return {
    ...actual,
    createLocalVue,
    mount: (component, options) =>
      withDestroyAlias(actual.mount(component, normalizeOptions(options))),
    shallowMount: (component, options) =>
      withDestroyAlias(actual.shallowMount(component, normalizeOptions(options))),
  };
});

vi.mock("vuetify", async () => {
  const actual = await vi.importActual("vuetify");

  class VuetifyCompat {
    constructor(config = {}) {
      return actual.createVuetify(config);
    }
  }

  if (!globalThis.Vuetify) {
    globalThis.Vuetify = VuetifyCompat;
  }

  return {
    ...actual,
    default: VuetifyCompat,
  };
});

vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");

  class VueRouterCompat {
    constructor(config = {}) {
      return actual.createRouter({
        history: actual.createMemoryHistory(),
        routes: config.routes || [],
      });
    }
  }

  return {
    ...actual,
    default: VueRouterCompat,
  };
});

// Jest compatibility shim for legacy specs still using `jest.*`.
if (!globalThis.jest) {
  globalThis.jest = {
    fn: vi.fn,
    spyOn: vi.spyOn,
    mock: vi.mock,
    clearAllMocks: vi.clearAllMocks,
    resetAllMocks: vi.resetAllMocks,
    restoreAllMocks: vi.restoreAllMocks,
    useFakeTimers: vi.useFakeTimers,
    useRealTimers: vi.useRealTimers,
    advanceTimersByTime: vi.advanceTimersByTime,
    runAllTimers: vi.runAllTimers,
    runOnlyPendingTimers: vi.runOnlyPendingTimers,
    setSystemTime: vi.setSystemTime,
    setTimeout: () => {},
  };
}

// --- 1. ResizeObserver Polyfill ---
// Vuetify uses this to detect when elements (like drawers or cards) change size.
// JSDOM doesn't support it, so we mock it to prevent crashes.
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// --- 2. IntersectionObserver Polyfill ---
// Used by Vuetify for lazy-loading images or infinite scrolling.
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// --- 3. window.matchMedia Polyfill ---
// CRITICAL for $vuetify.display (mdAndDown, lgAndUp, etc.)
// We default 'matches' to false, meaning the test assumes "Desktop" view by default.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// --- 4. Mock global CSS support ---
// Prevents errors in some Vuetify computed properties
global.CSS = {
  supports: () => false,
  escape: (str) => str,
};

if (!Object.groupBy) {
  Object.groupBy = (items, callback) => {
    return items.reduce((acc, item) => {
      const key = callback(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
  };
}

// Prevent accidental network access to local API endpoints in unit tests.
const nativeFetch = globalThis.fetch ? globalThis.fetch.bind(globalThis) : null;
const mockedFetch = async (input, init) => {
  const url =
    typeof input === "string" ? input : (input && input.url) || "";
  if (
    url.includes("localhost:3000") ||
    url.includes("127.0.0.1:3000") ||
    url.includes("undefined/graphql")
  ) {
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (nativeFetch) return nativeFetch(input, init);
  throw new Error(`Unexpected fetch in tests: ${url}`);
};
globalThis.fetch = vi.fn(mockedFetch);
if (typeof window !== "undefined") {
  window.fetch = globalThis.fetch;
}

// Short-circuit GraphQL requests that would otherwise target localhost in tests.
const originalGetData = GraphQLClient.prototype.getData;
GraphQLClient.prototype.getData = async function (queryString) {
  const url = this.url || "";
  if (
    url.includes("localhost:3000") ||
    url.includes("127.0.0.1:3000") ||
    url.includes("undefined/graphql")
  ) {
    return { data: { data: {} } };
  }
  return originalGetData.call(this, queryString);
};

const originalExecuteQuery = RESTClient.prototype.executeQuery;
RESTClient.prototype.executeQuery = async function (query) {
  const url = query?.baseURL || "";
  if (
    url.includes("localhost:3000") ||
    url.includes("127.0.0.1:3000") ||
    url.startsWith("undefined") ||
    url.includes("/undefined/")
  ) {
    return { data: {} };
  }
  return originalExecuteQuery.call(this, query);
};


// --- 5. Silence Vue warnings (Optional) ---
// If you want to suppress specific warnings (like "Vuetify is not installed"), you can do it here.
// const originalConsoleWarn = console.warn;
// console.warn = (...args) => {
//   if (args[0].includes('Vuetify')) return;
//   originalConsoleWarn(...args);
// };
