import {describe, expect, it} from "vitest";
import {shallowMount} from "@vue/test-utils";

import DownloadRecords from "@/components/Curators/DownloadRecords.vue";

import {
    CuratorSummaryStatistics,
    RecordEditsByMonth,
    RecordsCreatedByMonth,
    RecordsNeedingReview,
    RecordsWithoutDois,
} from "@/components/Curators/DownLoadRecordsComponents";

describe("Curator -> DownloadRecords.vue", () => {
  it("mounts successfully", () => {
    const wrapper = shallowMount(DownloadRecords);

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.vm.$options.name).toBe("DownloadRecords");

    wrapper.unmount();
  });

  it("registers all child components", () => {
    const wrapper = shallowMount(DownloadRecords);

    expect(wrapper.vm.$options.components).toEqual({
      RecordsWithoutDois,
      RecordsNeedingReview,
      CuratorSummaryStatistics,
      RecordsCreatedByMonth,
      RecordEditsByMonth,
    });

    wrapper.unmount();
  });

  it("renders all five child components", () => {
    const wrapper = shallowMount(DownloadRecords, {
      global: {
        stubs: {
          VRow: {
            template: "<div><slot /></div>",
          },
          VCol: {
            template: "<div><slot /></div>",
          },
        },
      },
    });

    expect(wrapper.findComponent(RecordsWithoutDois).exists()).toBe(true);

    expect(wrapper.findComponent(RecordsNeedingReview).exists()).toBe(true);

    expect(wrapper.findComponent(CuratorSummaryStatistics).exists()).toBe(true);

    expect(wrapper.findComponent(RecordsCreatedByMonth).exists()).toBe(true);

    expect(wrapper.findComponent(RecordEditsByMonth).exists()).toBe(true);

    wrapper.unmount();
  });
});
