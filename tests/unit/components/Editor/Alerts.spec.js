import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import Vuex from "vuex";

import Alerts from "@/components/Editor/Alerts.vue";
import recordStore from "@/store/recordData.js";

recordStore.state.sections = {
  organisations: {
    error: false,
    message: "Operation successful",
  },
};

describe("Edit -> Alerts.vue", function () {
  let wrapper;
  let $store = new Vuex.Store({
    modules: {
      record: recordStore,
    },
  });
  const createWrapper = () => {
    return shallowMount(Alerts, {
      global: {
        plugins: [$store],
      },
      props: {
        target: "organisations",
      },
    });
  };

  it("can be mounted", () => {
    wrapper = createWrapper();
    expect(wrapper.vm.$options.name).toMatch("Alerts");
  });

  it("can check computed message() when error is true", () => {
    wrapper = createWrapper();
    recordStore.state.sections.organisations.error = true;
    expect(wrapper.vm.message.type()).toBe("error");
  });

  it("can check computed message() when error is false", () => {
    wrapper = createWrapper();
    recordStore.state.sections.organisations.error = false;
    expect(wrapper.vm.message.type()).toBe("success");
  });
});
