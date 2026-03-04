import { vi } from "vitest";

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


// --- 5. Silence Vue warnings (Optional) ---
// If you want to suppress specific warnings (like "Vuetify is not installed"), you can do it here.
// const originalConsoleWarn = console.warn;
// console.warn = (...args) => {
//   if (args[0].includes('Vuetify')) return;
//   originalConsoleWarn(...args);
// };
