import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  store: { name: "store" },
  router: {
    push: vi.fn(),
    isReady: vi.fn().mockResolvedValue(undefined),
  },
  bootstrapApp: vi.fn().mockResolvedValue(undefined),
  vuetify: { name: "vuetify" },
  vuetifyIsFactory: true,
  accessibilityIsFunction: true,
  metaManager: { name: "meta" },
  sanitize: vi.fn((value) => `clean:${value}`),
  accessibilityInit: vi.fn(),
  loadFull: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/store", () => ({ createMyStore: () => mocks.store }));
vi.mock("@/router", () => ({ createMyRouter: () => mocks.router }));
vi.mock("@/plugins/vuetify", () => ({
  get default() {
    return mocks.vuetifyIsFactory ? () => mocks.vuetify : mocks.vuetify;
  },
}));
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
  get default() {
    return mocks.accessibilityIsFunction ? mocks.accessibilityInit : {};
  },
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
    mocks.vuetifyIsFactory = true;
    mocks.accessibilityIsFunction = true;
    mocks.bootstrapApp.mockReset().mockResolvedValue(undefined);
    mocks.router.isReady.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => vi.unstubAllEnvs());

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
    expect(mocks.accessibilityInit).toHaveBeenCalledWith({
      name: "highcharts",
    });

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

  it("installs only server-safe plugins during SSR", async () => {
    vi.stubEnv("SSR", true);
    const { app, directives } = createApp();
    await onCreateApp({ app, urlPathname: "/privacy" });
    expect(app.use.mock.calls.map(([plugin]) => plugin)).toEqual([
      mocks.store,
      mocks.router,
      mocks.vuetify,
      mocks.metaManager,
      { name: "sanitize-plugin" },
    ]);
    expect(mocks.accessibilityInit).not.toHaveBeenCalled();
    expect(mocks.loadFull).not.toHaveBeenCalled();
    expect(directives.linkified).toEqual({ name: "linkify" });
  });

  it("supports an already-created Vuetify plugin", async () => {
    vi.stubEnv("SSR", true);
    mocks.vuetifyIsFactory = false;
    const { app } = createApp();
    await onCreateApp({ app, urlPathname: "/" });
    expect(app.use).toHaveBeenCalledWith(mocks.vuetify);
    expect(mocks.router.isReady).toHaveBeenCalledTimes(1);
  });

  it("handles accessibility modules that do not export an initializer", async () => {
    vi.stubEnv("SSR", false);
    mocks.accessibilityIsFunction = false;
    const { app } = createApp();
    await onCreateApp({ app, urlPathname: "/" });
    expect(mocks.accessibilityInit).not.toHaveBeenCalled();
    expect(app.use).toHaveBeenCalledWith({ name: "highcharts-vue" });
    expect(app.use).toHaveBeenCalledWith({ name: "scroll-to" });
    expect(mocks.router.isReady).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])(
    "configures analytics for PROD=%s",
    async (production) => {
      vi.stubEnv("SSR", false);
      vi.stubEnv("PROD", production);
      vi.stubEnv("VITE_ANALYTICS_ID", "G-TEST-ID");
      const { app } = createApp();
      await onCreateApp({ app, urlPathname: "/" });
      expect(app.use).toHaveBeenCalledWith(
        { name: "analytics" },
        { skip: !production },
      );
      expect(app.use).toHaveBeenCalledWith(
        { name: "gtag" },
        { config: { id: "G-TEST-ID" } },
      );
    },
  );

  it("waits for router readiness before finishing initialization", async () => {
    vi.stubEnv("SSR", true);
    let finish;
    mocks.router.isReady.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const { app } = createApp();
    let completed = false;
    const initialization = onCreateApp({ app, urlPathname: "/records" }).then(
      () => {
        completed = true;
      },
    );
    await vi.waitFor(() =>
      expect(mocks.router.isReady).toHaveBeenCalledTimes(1),
    );
    expect(completed).toBe(false);
    expect(mocks.router.push).toHaveBeenCalledWith("/records");
    finish();
    await initialization;
    expect(completed).toBe(true);
  });

  it("propagates bootstrap failures before installing optional plugins", async () => {
    vi.stubEnv("SSR", true);
    const error = new Error("Bootstrap failed");
    mocks.bootstrapApp.mockRejectedValueOnce(error);
    const { app } = createApp();
    await expect(onCreateApp({ app, urlPathname: "/" })).rejects.toBe(error);
    expect(app.use.mock.calls.map(([plugin]) => plugin)).toEqual([
      mocks.store,
      mocks.router,
    ]);
    expect(mocks.router.push).not.toHaveBeenCalled();
    expect(mocks.router.isReady).not.toHaveBeenCalled();
  });

  it("propagates router readiness failures", async () => {
    vi.stubEnv("SSR", true);
    const error = new Error("Router failed");
    mocks.router.isReady.mockRejectedValueOnce(error);
    const { app } = createApp();
    await expect(onCreateApp({ app, urlPathname: "/" })).rejects.toBe(error);
    expect(mocks.bootstrapApp).toHaveBeenCalledWith(mocks.store, mocks.router);
  });

  it("registers a directive that sanitizes each update before replacing HTML", async () => {
    vi.stubEnv("SSR", true);
    const { app, directives } = createApp();
    await onCreateApp({ app, urlPathname: "/" });
    const element = { innerHTML: "old content" };
    directives["safe-html"](element, { value: '<a target="_blank">Link</a>' });
    expect(element.innerHTML).toBe('clean:<a target="_blank">Link</a>');
    directives["safe-html"](element, { value: "Updated content" });
    expect(element.innerHTML).toBe("clean:Updated content");
    expect(mocks.sanitize).toHaveBeenLastCalledWith("Updated content", {
      ADD_ATTR: ["target"],
    });
  });
});
