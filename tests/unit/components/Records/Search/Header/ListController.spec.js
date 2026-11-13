import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import Vuex from "vuex";

import ListController from "@/components/Records/Search/Header/ListController.vue";
import recordsStore from "@/store/recordSearch.js";
import {
  VSkeletonLoaderStub,
  VMenuStub,
  VTooltipStub,
  VIconStub,
} from "../../../../../stubs/index.js";

const vuetify = createVuetify();

const $store = new Vuex.Store({
  modules: {
    records: recordsStore,
  },
});

describe("ListController.vue", function () {
  let wrapper;

  const initialRecords = structuredClone(recordsStore.state);
  beforeEach(() => {
    Object.assign($store.state.records, structuredClone(initialRecords), {
      totalPages: 8,
      currentPage: 2,
    });
    wrapper = shallowMount(ListController, {
      props: {
        options: { hasSorting: true, hasPagination: true, hasListType: true },
      },
      global: {
        plugins: [vuetify, $store],
        stubs: {
          VSkeletonLoader: VSkeletonLoaderStub,
          VMenu: VMenuStub,
          VTooltip: VTooltipStub,
          VIcon: VIconStub,
        },
      },
    });
  });
  afterEach(() => wrapper.unmount());

  it("can be instantiated", () => {
    expect(wrapper.vm.$options.name).toMatch("ListController");
  });

  it("can check changeListType function", () => {
    wrapper.vm.changeListType("stackList");
    expect(wrapper.vm.isColumnList).toBe(false);
    wrapper.vm.changeListType("columnList");
    expect(wrapper.vm.isColumnList).toBe(true);
  });

  it("renders sorting, pagination, list controls and their tooltips", () => {
    expect(wrapper.findComponent({ name: "Sorting" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Pagination" }).props()).toMatchObject(
      { totalPages: 8, currentPage: 2 },
    );
    expect(wrapper.findComponent({ name: "HitCount" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "SummaryDownload" }).exists()).toBe(
      true,
    );
    expect(wrapper.findAllComponents(VIconStub)).toHaveLength(3);
    for (const key of ["sort", "stackList", "gridList"])
      expect(wrapper.text()).toContain(wrapper.vm.listControllerData[key]);
  });

  it("updates the sort icon on mouse enter and leave", async () => {
    const icon = wrapper
      .findAllComponents(VIconStub)
      .find((i) => i.text() === "fas fa-sort-amount-up-alt");
    expect(icon.classes()).toContain("active");
    await icon.trigger("mouseenter");
    expect(wrapper.vm.isSortHovered).toBe(true);
    expect(icon.classes()).not.toContain("active");
    await icon.trigger("mouseleave");
    expect(wrapper.vm.isSortHovered).toBe(false);
    expect(icon.classes()).toContain("active");
  });

  it("emits list changes from the rendered stack and column icons", async () => {
    const icons = wrapper.findAllComponents(VIconStub);
    const stack = icons.find((i) => i.text() === "fas fa-list");
    const column = icons.find((i) => i.text() === "fas fa-th");
    expect(column.classes()).toContain("active");
    await stack.trigger("click");
    await column.trigger("click");
    expect(wrapper.emitted("ChangeListType")).toEqual([[false], [true]]);
    expect(stack.classes()).toContain("active");
    expect(column.classes()).not.toContain("active");
  });

  it.each(["hasSorting", "hasPagination", "hasListType"])(
    "hides the optional %s controls",
    async (option) => {
      await wrapper.setProps({
        options: {
          hasSorting: true,
          hasPagination: true,
          hasListType: true,
          [option]: false,
        },
      });
      if (option === "hasSorting")
        expect(wrapper.findComponent({ name: "Sorting" }).exists()).toBe(false);
      if (option === "hasPagination")
        expect(wrapper.findComponent({ name: "Pagination" }).exists()).toBe(
          false,
        );
      if (option === "hasListType")
        expect(wrapper.findAllComponents(VIconStub)).toHaveLength(1);
      expect(wrapper.findComponent({ name: "HitCount" }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: "SummaryDownload" }).exists()).toBe(
        true,
      );
    },
  );

  it("reacts to Vuex loading and pagination changes", async () => {
    $store.state.records.loading = true;
    $store.state.records.totalPages = 12;
    $store.state.records.currentPage = 3;
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: "Pagination" }).props()).toMatchObject(
      { totalPages: 12, currentPage: 3 },
    );
    expect(wrapper.findAll('[data-test="skeleton"]')).toHaveLength(4);
    for (const skeleton of wrapper.findAllComponents({
      name: "VSkeletonLoader",
    }))
      expect(skeleton.props("loading")).toBe(true);
  });
});
