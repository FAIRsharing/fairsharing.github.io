import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  store: { name: "store" },
  router: {
    push: vi.fn(),
    isReady: vi.fn().mockResolvedValue(undefined),
  },
  bootstrapApp: vi.fn().mockResolvedValue(undefined),
  vuetify: { name: "vuetify" },
  metaManager: { name: "meta" },
  sanitize: vi.fn((value) => `clean:${value}`),
  accessibilityInit: vi.fn(),
  loadFull: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/store", () => ({ createMyStore: () => mocks.store }));
vi.mock("@/router", () => ({ createMyRouter: () => mocks.router }));
vi.mock("@/plugins/vuetify", () => ({ default: () => mocks.vuetify }));
vi.mock("@/utils/setupUtils", () => ({
  bootstrapApp: mocks.bootstrapApp,
  globalFilters: { capitalize: vi.fn() },
}));
vi.mock("vue-meta", () => ({ createMetaManager: () => mocks.metaManager }));
vi.mock("vue-3-sanitize", () => ({ default: { name: "sanitize-plugin" } }));
vi.mock("vue-3-linkify", () => ({ default: { name: "linkify" } }));
vi.mock("dompurify", () => ({ default: { sanitize: mocks.sanitize } }));
vi.mock("@/components/Static/APIDoc/CodeBlock.vue", () => ({
  default: { name: "CodeBlock" },
}));
vi.mock("highcharts-vue", () => ({ default: { name: "highcharts-vue" } }));
vi.mock("highcharts", () => ({ default: { name: "highcharts" } }));
vi.mock("highcharts/modules/accessibility", () => ({
  default: mocks.accessibilityInit,
}));
vi.mock("simple-analytics-vue", () => ({ default: { name: "analytics" } }));
vi.mock("vue-gtag", () => ({ default: { name: "gtag" } }));
vi.mock("vue-scrollto", () => ({ default: { name: "scroll-to" } }));
vi.mock("@tsparticles/vue3", () => ({ default: { name: "particles" } }));
vi.mock("tsparticles", () => ({ loadFull: mocks.loadFull }));

import onCreateApp from "@/pages/+onCreateApp.js";

function createApp() {
  const directives = {};
  const app = {
    use: vi.fn(() => app),
    component: vi.fn(),
    directive: vi.fn((name, handler) => {
      directives[name] = handler;
    }),
    config: { globalProperties: {} },
  };
  return { app, directives };
}

describe("onCreateApp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes the isolated store and router for server rendering", async () => {
    vi.stubEnv("SSR", true);
    const { app, directives } = createApp();

    await onCreateApp({ app, urlPathname: "/privacy" });

    expect(app.use).toHaveBeenCalledWith(mocks.store);
    expect(app.use).toHaveBeenCalledWith(mocks.router);
    expect(mocks.bootstrapApp).toHaveBeenCalledWith(mocks.store, mocks.router);
    expect(mocks.router.push).toHaveBeenCalledWith("/privacy");
    expect(mocks.router.isReady).toHaveBeenCalled();
    expect(app.component).toHaveBeenCalledWith(
      "CodeBlock",
      expect.objectContaining({ name: "CodeBlock" }),
    );

    const element = { innerHTML: "" };
    directives["safe-html"](element, { value: "<script>" });
    expect(element.innerHTML).toBe("clean:<script>");
    expect(mocks.sanitize).toHaveBeenCalledWith("<script>", {
      ADD_ATTR: ["target"],
    });
    expect(app.config.globalProperties.$filters).toBeDefined();
  });

  it("initializes browser-only plugins and particles", async () => {
    vi.stubEnv("SSR", false);
    const { app } = createApp();

    await onCreateApp({ app, urlPathname: "/" });

    expect(mocks.router.push).not.toHaveBeenCalled();
    expect(mocks.accessibilityInit).toHaveBeenCalledWith({ name: "highcharts" });

    const particlesCall = app.use.mock.calls.find(
      ([plugin]) => plugin?.name === "particles",
    );
    await particlesCall[1].init({ name: "engine" });
    expect(mocks.loadFull).toHaveBeenCalledWith({ name: "engine" });
    expect(app.use).toHaveBeenCalledWith(
      expect.objectContaining({ name: "gtag" }),
      expect.objectContaining({ config: expect.any(Object) }),
    );
  });
});
