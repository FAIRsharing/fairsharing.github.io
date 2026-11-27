import { shallowMount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import Vuex from "vuex";

import Maintainers from "@/components/Records/Record/GeneralInfo/Maintainers.vue";
import Record from "@/store/recordData.js";
import users from "@/store/users";
import {
  VIconStub,
  VRouterLinkStub,
  VTooltipStub,
} from "../../../../../stubs/index.js";

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
  const wrappers = [];
  const mountComponent = (options = {}) => {
    const {
      maintainers = [],
      canClaim = true,
      isLoggedIn = false,
      id = "123",
      mobile = false,
    } = options;
    $store.state.record.currentRecord.fairsharingRecord.maintainers =
      maintainers;
    $store.state.users.user = function () {
      return { isLoggedIn: isLoggedIn };
    };
    const instance = shallowMount(Maintainers, {
      props: { canClaim },
      global: {
        plugins: [$store],
        mocks: {
          $vuetify: { display: { smAndDown: mobile } },
          $route: { params: { id } },
        },
        stubs: {
          "router-link": VRouterLinkStub,
          VTooltip: VTooltipStub,
          VIcon: VIconStub,
          Icon: true,
        },
      },
    });
    wrappers.push(instance);
    return instance;
  };

  beforeEach(() => {
    wrapper = mountComponent();
  });

  afterEach(() => wrappers.splice(0).forEach((instance) => instance.unmount()));

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

  it("renders maintainers with profile links, optional ORCIDs and separators", async () => {
    wrapper = mountComponent({
      maintainers: [
        {
          id: 12,
          username: "Alice",
          contact_name: "Alice",
          orcid: "0000-0001-2345-6789",
        },
        { id: 34, username: "Bob", contact_name: "Bob", orcid: null },
      ],
    });
    const profiles = wrapper.findAll('a[href^="/users/"]');
    expect(profiles.map((link) => link.text())).toEqual(["Alice", "Bob"]);
    expect(profiles.map((link) => link.attributes("href"))).toEqual([
      "/users/12",
      "/users/34",
    ]);
    expect(profiles[0].classes()).toContain("mr-1");
    expect(profiles[1].classes()).not.toContain("mr-1");
    const orcid = wrapper.get('a[href^="https://orcid.org/"]');
    expect(orcid.attributes("href")).toBe(
      "https://orcid.org/0000-0001-2345-6789",
    );
    expect(orcid.attributes("target")).toBe("_blank");
    expect(orcid.findComponent({ name: "Icon" }).props("item")).toBe("Orcid");
    expect(wrapper.findAll("span.mr-1").map((span) => span.text())).toEqual([
      ",",
      "",
    ]);
    expect(wrapper.text()).toContain("maintainer tooltip.");
    expect(wrapper.text()).not.toContain("This record is in need");
  });

  it.each([
    { canClaim: true, isLoggedIn: false },
    { canClaim: false, isLoggedIn: true },
  ])("renders the remaining claim state: %j", async (options) => {
    wrapper = mountComponent(options);
    expect(wrapper.text()).not.toContain("If you are affiliated");
    expect(wrapper.find("a.mr-1").exists()).toBe(false);
    expect(wrapper.find("p.underline-effect").exists()).toBe(options.canClaim);
    if (options.canClaim) {
      await wrapper.get("p.underline-effect").trigger("click");
      expect(wrapper.emitted("requestOwnership")).toEqual([[]]);
    }
  });

  it("right-aligns empty-state and claim text on mobile", () => {
    wrapper = mountComponent({ mobile: true, isLoggedIn: true });
    expect(wrapper.get(".justify-end").exists()).toBe(true);
    expect(
      wrapper
        .findAll("p")
        .every((paragraph) => paragraph.classes().includes("text-end")),
    ).toBe(true);
  });

  it("right-aligns the login instructions on mobile", () => {
    wrapper = mountComponent({ mobile: true, canClaim: false });
    expect(
      wrapper
        .findAll("p")
        .map((paragraph) => paragraph.classes().includes("text-end")),
    ).toEqual([true, true, true]);
    expect(wrapper.get("a").text()).toBe("login");
  });

  it("switches between claim controls and maintainer links as the store changes", async () => {
    $store.state.record.currentRecord.fairsharingRecord.maintainers = [
      { id: 9, username: "Maintainer", contact_name: "Maintainer" },
    ];
    await wrapper.vm.$nextTick();
    expect(wrapper.get('a[href="/users/9"]').text()).toBe("Maintainer");
    expect(wrapper.find("p.underline-effect").exists()).toBe(false);
    $store.state.record.currentRecord.fairsharingRecord.maintainers = [];
    await wrapper.vm.$nextTick();
    expect(wrapper.find('a[href="/users/9"]').exists()).toBe(false);
    expect(wrapper.find("p.underline-effect").exists()).toBe(true);
  });
});
