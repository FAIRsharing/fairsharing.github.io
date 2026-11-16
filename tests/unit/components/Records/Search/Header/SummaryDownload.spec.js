import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { reactive } from "vue";
import { flushPromises, shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";
import SummaryDownload from "@/components/Records/Search/Header/SummaryDownload.vue";
import recordsStore from "@/store/recordSearch.js";
import introspectionStore from "@/store/introspector.js";
import usersStore from "@/store/users.js";
import GraphClient from "@/lib/GraphClient/GraphClient.js";
import downloadQuery from "@/lib/GraphClient/queries/downloadSearchResults.json";
import {
  VBtnStub,
  VDialogStub,
  VSlotStub,
  VTooltipStub,
} from "../../../../../stubs/index.js";

const vuetify = createVuetify();

const initialRecords = structuredClone(recordsStore.state);
const $store = new Vuex.Store({
  modules: {
    records: recordsStore,
    users: {
      ...usersStore,
      state: {
        ...usersStore.state,
        user: () => ({ id: 1, credentials: { token: "test-token" } }),
      },
    },
    introspection: {
      ...introspectionStore,
      state: {
        ...introspectionStore.state,
        searchQueryParameters: {
          args: [
            "q",
            "page",
            "perPage",
            "orderBy",
            "fairsharingRegistry",
            "grants",
            "registry",
            "licences",
            "isRecommended",
          ].map((name) => ({
            name,
            type: {
              kind: "SCALAR",
              name: ["page", "perPage", "licences"].includes(name)
                ? "Int"
                : name === "isRecommended"
                  ? "Boolean"
                  : "String",
            },
          })),
        },
      },
    },
  },
});

const initialRoute = {
  name: "Standards",
  path: "standard",
  query: {
    fairsharingRegistry: "Standard",
    grants: "string",
    publications: null,
    isRecommended: "false",
    registry: "[abc,def]",
    licences: 123,
  },
};
const $route = reactive(structuredClone(initialRoute));

describe("SummaryDownload.vue", function () {
  let wrapper;

  let querySpy, headerSpy, initializeSpy, urlSpy, clickSpy;
  const initialDownloadParams = structuredClone(downloadQuery.queryParam);

  beforeEach(() => {
    Object.assign($store.state.records, structuredClone(initialRecords), {
      hits: 3,
    });
    $store.state.users.user = () => ({
      id: 1,
      credentials: { token: "test-token" },
    });
    Object.assign($route, structuredClone(initialRoute), {
      fullPath: "/standard?q=test",
    });
    vi.stubEnv("VITE_HOSTNAME", "https://fairsharing.org/");
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-12T12:00:00Z"));
    querySpy = vi
      .spyOn(GraphClient.prototype, "executeQuery")
      .mockResolvedValue({
        downloadSearchResults: { fileData: ["id,name", "42,Example"] },
      });
    headerSpy = vi.spyOn(GraphClient.prototype, "setHeader");
    initializeSpy = vi.spyOn(GraphClient.prototype, "initalizeHeader");
    urlSpy = vi
      .spyOn(window.URL, "createObjectURL")
      .mockReturnValue("blob:test-download");
    clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    wrapper = shallowMount(SummaryDownload, {
      global: {
        plugins: [vuetify, $store],
        mocks: { $route },
        stubs: {
          VTooltip: VTooltipStub,
          VBtn: VBtnStub,
          VDialog: VDialogStub,
          VCard: VSlotStub,
          VCardTitle: VSlotStub,
          VCardText: VSlotStub,
          VCardActions: VSlotStub,
          VSpacer: true,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
    vi.restoreAllMocks();
    vi.useRealTimers();
    vi.unstubAllEnvs();
    downloadQuery.queryParam = structuredClone(initialDownloadParams);
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("SummaryDownload");
  });

  it("can calculate the current path", () => {
    expect(wrapper.vm.currentPath[0]).toBe("Standard");
  });

  it("decodes nonempty query values and maps known record paths", async () => {
    Object.assign($route, {
      path: "/databases",
      query: { q: "cell%20biology", page: 0, empty: "", missing: null },
    });
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.currentPath).toEqual(["Database", { q: "cell biology" }]);
    $route.path = "/custom";
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.currentPath[0]).toBe("Custom");
  });

  it("hides the download UI without hits and the button for anonymous users", async () => {
    $store.state.records.hits = 0;
    await wrapper.vm.$nextTick();
    expect(wrapper.find("button").exists()).toBe(false);
    $store.state.records.hits = 3;
    $store.state.users.user = () => ({});
    await wrapper.vm.$nextTick();
    expect(wrapper.find("button").exists()).toBe(false);
    expect(wrapper.find('[data-test="v-dialog"]').exists()).toBe(false);
  });

  it("opens the choice dialog and cancels without downloading", async () => {
    await wrapper.find("button a").trigger("click");
    expect(wrapper.vm.chooseDownloadActive).toBe(true);
    expect(wrapper.text()).toContain(
      "Do you need information on organisations?",
    );
    await wrapper
      .findAll("button")
      .find((b) => b.text() === "Cancel")
      .trigger("click");
    expect(wrapper.vm.chooseDownloadActive).toBe(false);
    expect(querySpy).not.toHaveBeenCalled();
  });

  it("closes the choice dialog through v-model", async () => {
    wrapper.vm.chooseDownload();
    await wrapper.vm.$nextTick();
    wrapper.findComponent(VDialogStub).vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.chooseDownloadActive).toBe(false);
    expect(querySpy).not.toHaveBeenCalled();
  });

  it.each([
    ["Yes", true],
    ["No", false],
  ])(
    "downloads a CSV with the %s organisation option",
    async (label, includeOrgs) => {
      $route.query = {
        q: "cell + biology!",
        page: "2",
        perPage: "10",
        orderBy: "name",
      };
      $store.commit("records/setCollectionIdsParam", [42, 43]);
      await wrapper.find("button a").trigger("click");
      await wrapper
        .findAll("button")
        .find((b) => b.text() === label)
        .trigger("click");
      await flushPromises();
      expect(downloadQuery.queryParam).toEqual({
        q: "cell  biology",
        includeOrgs,
        searchUrl: "https://fairsharing.org/standard?q=test",
        ids: [42, 43],
      });
      expect(querySpy).toHaveBeenCalledWith(downloadQuery);
      expect(initializeSpy).toHaveBeenCalledTimes(1);
      expect(headerSpy).toHaveBeenCalledWith("test-token");
      const blob = urlSpy.mock.calls[0][0];
      expect(blob.type).toBe("text/csv");
      expect(await blob.text()).toBe("id,name\n42,Example");
      const anchor = clickSpy.mock.contexts[0];
      expect(anchor.getAttribute("href")).toBe("blob:test-download");
      expect(anchor.getAttribute("download")).toBe(
        "fairsharing_download_1794484800.csv",
      );
      expect(document.contains(anchor)).toBe(false);
      expect(wrapper.vm.buttonDisabled).toBe(false);
      expect(wrapper.vm.chooseDownloadActive).toBe(false);
    },
  );

  it("keeps the button disabled while a download request is pending", async () => {
    let resolve;
    querySpy.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    $route.query = {};
    const pending = wrapper.vm.commenceDownload(false);
    await wrapper.vm.$nextTick();
    expect(wrapper.find("button").attributes("disabled")).toBeDefined();
    expect(downloadQuery.queryParam).toEqual({
      includeOrgs: false,
      searchUrl: "https://fairsharing.org/standard?q=test",
    });
    resolve({ downloadSearchResults: { fileData: [] } });
    await pending;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.buttonDisabled).toBe(false);
    expect(await urlSpy.mock.calls[0][0].text()).toBe("");
  });

  it("propagates an API rejection without creating a partial download", async () => {
    querySpy.mockRejectedValueOnce(new Error("Download unavailable"));
    await expect(wrapper.vm.commenceDownload(false)).rejects.toThrow(
      "Download unavailable",
    );
    expect(urlSpy).not.toHaveBeenCalled();
    expect(clickSpy).not.toHaveBeenCalled();
    expect(wrapper.vm.chooseDownloadActive).toBe(false);
  });
});
