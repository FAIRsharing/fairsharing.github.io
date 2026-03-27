import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import Vuex from "vuex";

import Maintainers from "@/components/Records/Record/GeneralInfo/Maintainers.vue";
import Record from "@/store/recordData.js";
import users from "@/store/users";

let editor = {
  namespaced: true,
  state: {
    recordTooltips: {
      maintainers: "maintainer tooltip.",
    },
  },
};

Record.state.currentRecord["fairsharingRecord"] = {
  doi: "FAIRsharing.wibble",
  subjects: [],
  domains: [],
  taxonomies: [],
  userDefinedTags: [{ label: "a" }],
  maintainers: [],
};
const $store = new Vuex.Store({
  modules: {
    record: Record,
    users,
    editor: editor,
  },
});

describe("Maintainers.vue", function () {
  let wrapper;
  const mountComponent = (options = {}) => {
    const {
      maintainers = [],
      canClaim = true,
      isLoggedIn = false,
      id = "123",
    } = options;
    Record.state.currentRecord.fairsharingRecord.maintainers = maintainers;
    users.state.user = function () {
      return { isLoggedIn: isLoggedIn };
    };
    return shallowMount(Maintainers, {
      props: { canClaim },
      global: {
        plugins: [$store],
        mocks: {
          $vuetify: { display: { smAndDown: false } },
          $route: { params: { id } },
        },
        stubs: {
          "router-link": true,
          RouterLink: true,
          Icon: true,
        },
      },
    });
  };

  // TODO: Mock properties in options {}.
  beforeEach(() => {
    wrapper = mountComponent();
  });

  it("can be initiated", () => {
    expect(wrapper.vm.$options.name).toMatch("Maintainers");
  });

  it("shows claim CTA for logged-in users and emits requestOwnership", async () => {
    wrapper = mountComponent({
      maintainers: [],
      canClaim: true,
      isLoggedIn: true,
    });
    expect(wrapper.text()).toContain("This record is in need of a maintainer.");
    expect(wrapper.text()).toContain(
      "If you are affiliated with this project,",
    );
    const claimLink = wrapper.find("p.underline-effect.text-blue");
    expect(claimLink.exists()).toBe(true);
    await claimLink.trigger("click");
    expect(wrapper.emitted("requestOwnership")).toBeTruthy();
  });

  it("shows login CTA for logged-out users when claiming is not available", () => {
    wrapper = mountComponent({
      maintainers: [],
      canClaim: false,
      isLoggedIn: false,
      id: "980190962",
    });
    const loginLink = wrapper.find("a.mr-1");
    expect(wrapper.text()).toContain(
      "If you are affiliated with this project,",
    );
    expect(loginLink.exists()).toBe(true);
    expect(loginLink.attributes("href")).toBe(
      `${wrapper.vm.serverLink}accounts/login?goTo=%2F980190962`,
    );
    expect(wrapper.text()).toContain("and claim it now!");
  });

  it("computes serverLink from environment", () => {
    expect(wrapper.vm.serverLink).toBe(import.meta.env.VITE_HOSTNAME);
  });
});
