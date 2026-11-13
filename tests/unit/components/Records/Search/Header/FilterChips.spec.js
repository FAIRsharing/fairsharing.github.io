import { shallowMount } from "@vue/test-utils";
import { reactive } from "vue";

import FilterChips from "@/components/Records/Search/Header/FilterChips.vue";

const $route = reactive({
  path: "/search",
  name: "search",
  query: {
    grants: "ABCDEF",
    publications: "pub1,pub2,pub3",
    page: 1,
  },
});

const $router = {
  push: vi.fn(),
};

describe("FilterChips.vue", () => {
  let wrapper;

  beforeEach(async () => {
    vi.useFakeTimers();
    $router.push.mockClear();
    $route.query = {
      grants: "ABCDEF",
      publications: "pub1,pub2,pub3",
      page: 1,
    };
    wrapper = shallowMount(FilterChips, {
      mocks: { $route, $router },
    });
  });

  afterEach(() => {
    FilterChips.methods.removeParam.cancel();
    FilterChips.methods.removeAllParams.cancel();
    wrapper.unmount();
    vi.useRealTimers();
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("FilterChips");
  });

  it("can remove a parameter value", async () => {
    await wrapper.vm.removeParam("publications", "pub2");
    expect($router.push).toHaveBeenCalledTimes(1);
    expect($router.push).toHaveBeenCalledWith({
      name: "search",
      query: { grants: "ABCDEF", publications: "pub1,pub3", page: 1 },
    });
    let query = wrapper.vm.buildNewQuery("grants", "ABCDEF");
    expect(query).toStrictEqual({ page: 1, publications: "pub1,pub2,pub3" });
    query = wrapper.vm.buildNewQuery("publications", "pub4");
    expect(query).toStrictEqual({
      page: 1,
      grants: "ABCDEF",
      publications: "pub1,pub2,pub3",
    });
    await wrapper.vm.removeParam("publications", "pub3");
    expect($router.push).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(2000);
    expect($router.push).toHaveBeenCalledTimes(2);
    expect($router.push).toHaveBeenLastCalledWith({
      name: "search",
      query: { grants: "ABCDEF", publications: "pub1,pub2", page: 1 },
    });
    wrapper.vm.$route.query = { object: {} };
    expect(wrapper.vm.getChips).toStrictEqual([
      { paramName: "object", paramVal: {} },
    ]);
  });

  it("can remove all parameters value", async () => {
    await wrapper.vm.removeAllParams();
    expect($router.push).toHaveBeenCalledTimes(1);
    expect($router.push).toHaveBeenCalledWith({ name: "search", query: {} });
  });
});
