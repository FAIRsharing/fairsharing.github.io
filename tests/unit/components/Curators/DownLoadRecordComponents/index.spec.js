import { describe, expect, it, vi } from "vitest";
import * as ComponentLoader from "@/components/Curators/DownLoadRecordsComponents/index.js";

vi.mock(
  "@/components/Curators/DownLoadRecordsComponents/RecordsWithoutDois.vue",
  () => ({
    default: "Mock_RecordsWithoutDois",
  }),
);

vi.mock(
  "@/components/Curators/DownLoadRecordsComponents/RecordsNeedingReview.vue",
  () => ({
    default: "Mock_RecordsNeedingReview",
  }),
);

vi.mock(
  "@/components/Curators/DownLoadRecordsComponents/CuratorSummaryStatistics.vue",
  () => ({
    default: "Mock_CuratorSummaryStatistics",
  }),
);

vi.mock(
  "@/components/Curators/DownLoadRecordsComponents/RecordsCreatedByMonth.vue",
  () => ({
    default: "Mock_RecordsCreatedByMonth",
  }),
);

vi.mock(
  "@/components/Curators/DownLoadRecordsComponents/RecordEditsByMonth.vue",
  () => ({
    default: "Mock_RecordEditsByMonth",
  }),
);

describe("Dynamic Component Imports", () => {
  it("lazy loads RecordsWithoutDois from the correct path", async () => {
    const module = await ComponentLoader.RecordsWithoutDois();
    expect(module.default).toBe("Mock_RecordsWithoutDois");
  });

  it("lazy loads RecordsNeedingReview from the correct path", async () => {
    const module = await ComponentLoader.RecordsNeedingReview();
    expect(module.default).toBe("Mock_RecordsNeedingReview");
  });

  it("lazy loads CuratorSummaryStatistics from the correct path", async () => {
    const module = await ComponentLoader.CuratorSummaryStatistics();
    expect(module.default).toBe("Mock_CuratorSummaryStatistics");
  });

  it("lazy loads RecordsCreatedByMonth from the correct path", async () => {
    const module = await ComponentLoader.RecordsCreatedByMonth();
    expect(module.default).toBe("Mock_RecordsCreatedByMonth");
  });

  it("lazy loads RecordEditsByMonth from the correct path", async () => {
    const module = await ComponentLoader.RecordEditsByMonth();
    expect(module.default).toBe("Mock_RecordEditsByMonth");
  });
});
