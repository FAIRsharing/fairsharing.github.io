import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";
import sinon from "sinon";
import Vuex from "vuex";

import Maintainers from "@/components/Editor/GeneralInformation/Maintainers.vue";
import GraphClient from "@/lib/GraphClient/GraphClient";
import allUsersQuery from "@/lib/GraphClient/queries/getAllUsers.json";
import recordStore from "@/store/recordData.js";
import usersStore from "@/store/users";
import {
  VSlotStub,
  VFormStub,
  VOverlayStub,
  VDialogStub,
  VTextFieldStub,
  VTooltipStub,
  VIconStub,
  VBtnStub,
  VRouterLinkStub,
  VDataTableSlotsStub,
} from "../../../../stubs/index.js";

let maintainer = {
  username: "jean",
  id: 100,
  orcid: "0000-",
};
let extra = {
  username: "de fleur",
  id: 101,
  orcid: "1111-",
};
recordStore.state.sections = {
  generalInformation: {
    data: {
      maintainers: [maintainer],
      watchers: [maintainer, extra],
    },
    initialData: {
      maintainers: [maintainer],
      watchers: [maintainer, extra],
    },
  },
};
const initialSections = structuredClone(recordStore.state.sections);
const $store = new Vuex.Store({
  modules: {
    record: recordStore,
    users: usersStore,
  },
});

let wrapper;

describe("Editor -> Maintainers.vue", () => {
  let graphStub;

  beforeAll(() => {
    graphStub = sinon.stub(GraphClient.prototype, "executeQuery");
  });

  afterAll(() => {
    graphStub.restore();
  });

  afterEach(async () => {
    await flushPromises();
    wrapper.unmount();
  });

  beforeEach(() => {
    $store.state.record.sections = structuredClone(initialSections);
    $store.state.users.usersList = [];
    $store.state.users.user = () => ({ credentials: { token: "test-token" } });
    $store.commit("users/clearMessages");
    graphStub.reset();
    graphStub.withArgs(allUsersQuery).returns({
      allUsers: [{ id: 1, username: "one", email: "one@one.com", orcid: null }],
    });
    wrapper = shallowMount(Maintainers, {
      global: {
        plugins: [$store],
        stubs: {
          "router-link": VRouterLinkStub,
          VForm: VFormStub,
          VOverlay: VOverlayStub,
          VDialog: VDialogStub,
          VChipGroup: VSlotStub,
          VChip: VSlotStub,
          VTooltip: VTooltipStub,
          VIcon: VIconStub,
          VTextField: VTextFieldStub,
          VDataTable: VDataTableSlotsStub,
          VCard: VSlotStub,
          VCardTitle: VSlotStub,
          VCardText: VSlotStub,
          VCardActions: VSlotStub,
          VLayout: VSlotStub,
          VBtn: VBtnStub,
          VSpacer: true,
        },
      },
    });
  });

  it("can be mounted", () => {
    wrapper.vm.$options.watch.searchString.call(wrapper.vm, "test");
    expect(wrapper.vm.$options.name).toMatch("Maintainers");
    expect(
      wrapper.vm.getSection("generalInformation").data.maintainers,
    ).toStrictEqual([maintainer]);
    expect(
      wrapper.vm.getSection("generalInformation").data.watchers,
    ).toStrictEqual([maintainer, extra]);
  });

  it("can add a new maintainer", async () => {
    wrapper.vm.selectMaintainers();
    let count = wrapper.vm.maintainers.length;
    expect(wrapper.vm.menu).toStrictEqual({
      show: true,
      label: "Add maintainer",
      index: null,
      content: {
        name: null,
        id: null,
        orcid: null,
      },
    });
    wrapper.vm.formValid = true;
    wrapper.vm.menu.content = maintainer;
    wrapper.vm.addItem(maintainer);
    // The same maintainer will not be added again.
    expect(wrapper.vm.maintainers.length).toEqual(count);
    let nextMaintainer = {
      username: "another",
      id: 2222,
      orcid: null,
    };
    wrapper.vm.menu.content = nextMaintainer;
    wrapper.vm.addItem(nextMaintainer);
    expect(wrapper.vm.maintainers.length).toEqual(count + 1);
  });

  it("can remove maintainers", () => {
    wrapper.vm.maintainers = [
      structuredClone(maintainer),
      { username: "another", id: 2222, orcid: null },
    ];
    expect(wrapper.vm.maintainers.length).toEqual(2);
    expect(wrapper.vm.watchers.length).toEqual(2);
    wrapper.vm.removeMaintainer(0);
    expect(wrapper.vm.maintainers.length).toEqual(1);
    expect(wrapper.vm.watchers.length).toEqual(2);
    wrapper.vm.completeRemoval(maintainer.id);
    expect(wrapper.vm.watchers.length).toEqual(1);
  });

  it("determines if a maintainer is newly added", () => {
    expect(wrapper.vm.isNew(maintainer)).toBe(false);
    let nextMaintainer = {
      username: "another",
      id: 2222,
      orcid: null,
    };
    expect(wrapper.vm.isNew(nextMaintainer)).toBe(true);
  });

  it("avoids re-adding maintainers to the list", () => {
    wrapper.vm.maintainers.push(maintainer);
    expect(wrapper.vm.isAlreadyMaintainer(maintainer)).toBe(true);
    let nextMaintainer = {
      username: "unknown",
      id: 1234,
      orcid: null,
    };
    expect(wrapper.vm.isAlreadyMaintainer(nextMaintainer)).toBe(false);
  });

  it("handles formValid form v-model updates", async () => {
    await wrapper.setData({ formValid: false });
    const form = wrapper.findComponent({ name: "v-form" });
    expect(form.props("modelValue")).toBe(false);
    await form.vm.$emit("update:modelValue", true);
    expect(wrapper.vm.formValid).toBe(true);
  });

  it("passes maintainer search text to the table and clears it", async () => {
    await wrapper.setData({ searchString: "jean" });
    await flushPromises();
    wrapper.vm.selectMaintainers();
    await wrapper.vm.$nextTick();
    const table = wrapper.findComponent({ name: "VDataTable" });
    expect(table.props("search")).toBe("jean");
    expect(wrapper.vm.loading).toBe(false);
    const requestCount = graphStub.callCount;
    await wrapper.setData({ searchString: "" });
    await flushPromises();
    expect(table.props("search")).toBe("");
    expect(graphStub.callCount).toBe(requestCount);
  });

  it("renders saved and newly added maintainer chips", async () => {
    wrapper.vm.addItem(extra);
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll(".bg-blue")).toHaveLength(1);
    expect(wrapper.findAll(".borderBlue")).toHaveLength(1);
    expect(wrapper.text()).toContain("jean (100)");
    expect(wrapper.text()).toContain("de fleur (101)");
  });

  it("opens the selector, searches users and adds a result through the table", async () => {
    await wrapper.find(".shadowChip").trigger("click");
    await wrapper.find('[aria-label="Search"]').setValue("  one  ");
    await flushPromises();
    expect(allUsersQuery.queryParam.q).toBe("one");
    expect(wrapper.find('a[href="/users/1"]').text()).toBe(
      "https://fairsharing.org/users/1",
    );
    const add = wrapper
      .findAllComponents(VIconStub)
      .find(
        (i) =>
          i.text() === "fas fa-plus-circle" && !i.classes().includes("mr-3"),
      );
    await add.trigger("click");
    expect(wrapper.vm.maintainers).toContainEqual({
      id: 1,
      username: "one",
      orcid: null,
    });
    expect(add.attributes("disabled")).toBeDefined();
    await wrapper.find("button.bg-warning").trigger("click");
    expect(wrapper.vm.menu.show).toBe(false);
  });

  it.each([true, false])(
    "removes a maintainer and optionally its watcher entry: %s",
    async (removeWatcher) => {
      await wrapper
        .findAllComponents(VIconStub)
        .find((i) => i.text() === "fas fa-times-circle")
        .trigger("click");
      expect(wrapper.vm.maintainers).toEqual([]);
      expect(wrapper.vm.showRemoveWatcher).toBe(true);
      await wrapper
        .findAll("button")
        .find((b) => b.text() === (removeWatcher ? "Yes" : "No"))
        .trigger("click");
      expect(wrapper.vm.watchers.map((w) => w.id)).toEqual(
        removeWatcher ? [101] : [100, 101],
      );
      expect(wrapper.vm.showRemoveWatcher).toBe(false);
    },
  );

  it("does not request watcher removal for an unwatched maintainer", () => {
    wrapper.vm.addItem({ username: "Unwatched", id: 200, orcid: null });
    wrapper.vm.removeMaintainer(1);
    expect(wrapper.vm.maintainers).toEqual([maintainer]);
    expect(wrapper.vm.showRemoveWatcher).toBe(false);
    expect(wrapper.vm.watchers).toEqual([maintainer, extra]);
  });

  it("closes both overlays through their model events", async () => {
    wrapper.vm.selectMaintainers();
    await wrapper.vm.$nextTick();
    wrapper.findComponent(VOverlayStub).vm.$emit("update:modelValue", false);
    wrapper.vm.removeMaintainer(0);
    await wrapper.vm.$nextTick();
    wrapper.findComponent(VDialogStub).vm.$emit("update:modelValue", false);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.menu.show).toBe(false);
    expect(wrapper.vm.showRemoveWatcher).toBe(false);
    expect(wrapper.vm.watchers).toHaveLength(2);
  });

  it.each(["", "ab", null])(
    "does not search for empty or short text: %j",
    async (searchString) => {
      await wrapper.setData({ searchString });
      await flushPromises();
      expect(graphStub.called).toBe(false);
      expect(wrapper.vm.loading).toBe(false);
    },
  );

  it("shows loading until user search completes and handles API failures", async () => {
    let resolve;
    graphStub.returns(
      new Promise((done) => {
        resolve = done;
      }),
    );
    await wrapper.setData({ searchString: "pending" });
    expect(wrapper.vm.loading).toBe(true);
    resolve({ allUsers: [] });
    await flushPromises();
    expect(wrapper.vm.loading).toBe(false);
    graphStub.resetBehavior();
    graphStub.rejects(new Error("Search unavailable"));
    await wrapper.setData({ searchString: "failure" });
    await flushPromises();
    expect(wrapper.vm.loading).toBe(false);
    expect($store.state.users.messages().getUsersList).toEqual({
      error: true,
      message: "Search unavailable",
    });
  });
});
