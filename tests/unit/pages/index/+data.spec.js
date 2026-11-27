import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getHomepageJsonld: vi.fn(),
  setConfig: vi.fn(),
}));

vi.mock("@/lib/Client/RESTClient.js", () => ({
  default: vi.fn(function () {
    return { getHomepageJsonld: mocks.getHomepageJsonld };
  }),
}));
vi.mock("vike-vue/useConfig", () => ({
  useConfig: () => mocks.setConfig,
}));

import { data } from "@/pages/index/+data.js";

describe("homepage data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds non-empty schema.org data to the page head", async () => {
    mocks.getHomepageJsonld.mockResolvedValue({
      "@type": "WebSite",
      description: "<unsafe>",
    });

    const result = await data();
    const head = mocks.setConfig.mock.calls[0][0].Head;

    expect(result.JSONLD).toEqual({
      "@type": "WebSite",
      description: "<unsafe>",
    });
    expect(head.type).toBe("script");
    expect(head.props.innerHTML).toContain("\\u003cunsafe>");
  });

  it("returns null and leaves the head unchanged without schema.org data", async () => {
    mocks.getHomepageJsonld.mockResolvedValue(null);

    await expect(data()).resolves.toEqual({ JSONLD: null });
    expect(mocks.setConfig).not.toHaveBeenCalled();
  });
});
