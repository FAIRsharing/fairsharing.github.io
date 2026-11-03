import { vi } from "vitest";
import { defineComponent, h } from "vue";
// ============================================================
// 1. Vue Test Utils compatibility
// ============================================================

vi.mock("@vue/test-utils", async () => {
  const actual = await vi.importActual("@vue/test-utils");

  actual.config.global.renderStubDefaultSlot = true;

  // Generic Vuetify stub.
  // Prevents read-only DOM property errors such as `prefix`.
  const makeInertStub = (name) =>
    defineComponent({
      name,
      inheritAttrs: false,

      setup(_, { slots }) {
        return () =>
          h(
            "div",
            {
              "data-test": name.toLowerCase(),
            },
            slots.default?.() || [],
          );
      },
    });

  // Text input stub supporting v-model.
  const makeTextInputStub = (name, tag = "input") =>
    defineComponent({
      name,

      props: {
        modelValue: {
          default: null,
        },
      },

      emits: ["update:modelValue"],

      setup(props, { emit, attrs }) {
        return () =>
          h(tag, {
            ...attrs,

            "data-test": name.toLowerCase(),

            value: props.modelValue ?? "",

            onInput: (event) => {
              emit("update:modelValue", event.target.value);
            },
          });
      },
    });

  const normalizeOptions = (options = {}) => {
    const normalized = { ...options };

    const globalConfig = {
      ...(normalized.global || {}),
    };

    // --------------------------------------------------------
    // Directives
    // --------------------------------------------------------

    globalConfig.directives = {
      "safe-html": {},
      ...(globalConfig.directives || {}),
      ...(normalized.directives || {}),
    };

    // --------------------------------------------------------
    // Vue 2 propsData compatibility
    // --------------------------------------------------------

    if (normalized.propsData && !normalized.props) {
      normalized.props = normalized.propsData;
    }

    // --------------------------------------------------------
    // Vue 2 plugin compatibility
    // --------------------------------------------------------

    const legacyPlugins = [
      normalized.store,
      normalized.router,
      normalized.vuetify,
    ].filter(Boolean);

    globalConfig.plugins = [...(globalConfig.plugins || []), ...legacyPlugins];

    // --------------------------------------------------------
    // Global mocks
    // --------------------------------------------------------

    globalConfig.mocks = {
      $scrollTo: vi.fn(),

      $sanitize: (value) => value,

      $filters: {
        capitalize: (value) => {
          if (typeof value !== "string" || !value.length) {
            return value;
          }

          return value.charAt(0).toUpperCase() + value.slice(1);
        },
      },

      ...(globalConfig.mocks || {}),
      ...(normalized.mocks || {}),
    };

    // --------------------------------------------------------
    // Vuetify stubs
    // --------------------------------------------------------

    globalConfig.stubs = {
      "router-link": true,
      "router-view": true,

      VSelect: makeInertStub("VSelect"),

      VAutocomplete: makeInertStub("VAutocomplete"),

      VCombobox: makeInertStub("VCombobox"),

      VTextField: makeTextInputStub("VTextField"),

      VTextarea: makeTextInputStub("VTextarea", "textarea"),

      ...(globalConfig.stubs || {}),
      ...(normalized.stubs || {}),
    };

    // --------------------------------------------------------
    // Mixins
    // --------------------------------------------------------

    globalConfig.mixins = [
      ...(globalConfig.mixins || []),
      ...(normalized.mixins || []),
    ];

    normalized.global = globalConfig;

    // Remove Vue 2-specific options
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

  // Vue 2 destroy() compatibility
  const withDestroyAlias = (wrapper) => {
    if (wrapper && typeof wrapper.unmount === "function" && !wrapper.destroy) {
      wrapper.destroy = () => wrapper.unmount();
    }

    return wrapper;
  };

  // Vue 2 createLocalVue compatibility
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
      withDestroyAlias(
        actual.shallowMount(component, normalizeOptions(options)),
      ),
  };
});

// ============================================================
// 2. Vuetify compatibility
// ============================================================

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

// ============================================================
// 3. Vue Router compatibility
// ============================================================

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

// ============================================================
// 4. Jest compatibility
// ============================================================

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

// ============================================================
// 5. ResizeObserver polyfill
// ============================================================

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// ============================================================
// 6. IntersectionObserver polyfill
// ============================================================

if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// ============================================================
// 7. matchMedia polyfill
// ============================================================

if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,

    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,

      onchange: null,

      addListener: vi.fn(),
      removeListener: vi.fn(),

      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),

      dispatchEvent: vi.fn(),
    })),
  });
}

// ============================================================
// 8. CSS support
// ============================================================

if (!globalThis.CSS) {
  globalThis.CSS = {};
}

if (!globalThis.CSS.supports) {
  globalThis.CSS.supports = () => false;
}

if (!globalThis.CSS.escape) {
  globalThis.CSS.escape = (value) => String(value);
}

// ============================================================
// 9. Object.groupBy polyfill
// ============================================================

if (!Object.groupBy) {
  Object.groupBy = (items, callback) => {
    const result = Object.create(null);

    Array.from(items).forEach((item, index) => {
      const key = callback(item, index);

      if (!Object.hasOwn(result, key)) {
        result[key] = [];
      }

      result[key].push(item);
    });

    return result;
  };
}

// ============================================================
// 10. FileReader polyfill
// ============================================================

if (!globalThis.FileReader) {
  globalThis.FileReader = class FileReader {
    constructor() {
      this.onload = null;
      this.onerror = null;
      this.result = null;
    }

    readAsDataURL() {
      this.result = null;

      if (typeof this.onload === "function") {
        this.onload({
          target: this,
        });
      }
    }

    abort() {}
  };
}

// ============================================================
// 11. Network safety
// ============================================================

// Do not globally override GraphQLClient or RESTClient prototypes.
// Mock their methods in individual spec files instead.
//
// Example:
//
// vi.spyOn(GraphQLClient.prototype, "executeQuery")
//   .mockResolvedValue(mockData);
//
// This keeps API behavior explicit and prevents tests from
// silently receiving empty API responses.

// ============================================================
// End of setup.js
// ============================================================