import { shallowMount  } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import History from "@/components/Records/Record/History/RecordHistory.vue";

const vuetify = createVuetify();

describe("RecordHistory.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(History, {
      vuetify,
      props: {
        history: [],
        legacyLogs: [],
      },
    });
  });

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("RecordHistory");
  });

  it("has proper watchers", () => {
    wrapper.vm.page = 2;
    expect(wrapper.vm.currentPanel.length).toBe(0);
    expect(wrapper.vm.legacyPanels.length).toBe(0);

    wrapper.vm.subTab = 2;
    expect(wrapper.vm.currentPanel.length).toBe(0);
    expect(wrapper.vm.legacyPanels.length).toBe(0);
    // wrapper.vm.reverseDate = false;
    wrapper.vm.$options.watch.reverseDate.call(wrapper.vm, false);
    expect(wrapper.vm.currentPanel.length).toBe(0);
    expect(wrapper.vm.legacyPanels.length).toBe(0);
    expect(wrapper.vm.page).toBe(1);

    wrapper.vm.selectedTab = 0;
    expect(wrapper.vm.currentPanel.length).toBe(0);
    expect(wrapper.vm.legacyPanels.length).toBe(0);
    expect(wrapper.vm.page).toBe(1);
  });

  it("can reverse arrays", () => {
    wrapper = shallowMount(History, {
      vuetify,
      props: {
        history: [["tab_1", [1, 2, 3]]],
        legacyLogs: [],
      },
    });
    expect(wrapper.vm.paginatedData).toStrictEqual([3, 2, 1]);
    wrapper.vm.reverseDate = false;
    expect(wrapper.vm.paginatedData).toStrictEqual([1, 2, 3]);
  });
});
