import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vuex from "vuex";

import History from "@/components/Records/Record/History/RecordHistory.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
const vuetify = new Vuetify();

describe("RecordHistory.vue", function () {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(History, {
      localVue,
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
    let array = [1, 2, 3];
    let output = wrapper.vm.reverse(array, 0);
    expect(output).toStrictEqual([...array].reverse());
    wrapper.vm.reverseDate = false;
    let dict = { a: 1, b: 2, c: 3 };
    output = wrapper.vm.reverse(dict, 1);
    expect(output).toStrictEqual(array);
  });
});
