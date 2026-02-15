import { describe, expect, it, vi } from "vitest";
import generalUtils, {
  LightenDarkenColor,
  toBase64,
} from "@/utils/generalUtils.js";

describe("generalUtils.js", function () {
  it("can check getHostName method", function () {
    import.meta.env.VITE_HOSTNAME = "https://test.com";
    expect(generalUtils.methods.getHostname()).toBe("https://test.com");
  });

  it("can check getAPIEndPoint method", function () {
    import.meta.env.VITE_API_ENDPOINT = "https://test.com";
    expect(generalUtils.methods.getAPIEndPoint()).toBe("https://test.com");
  });
  it("can sortObj method sorts object keys alphabetically", () => {
    const input = {
      zebra: 1,
      apple: 2,
      monkey: 3,
    };

    const result = generalUtils.methods.sortObj(input);
    const keys = Object.keys(result);

    // Verify the order is strictly alphabetical
    expect(keys).toEqual(["apple", "monkey", "zebra"]);

    // Verify values are preserved correctly
    expect(result.apple).toBe(2);
    expect(result.zebra).toBe(1);
  });

  it("can check formatDate method", function () {
    let dummyDate = "2020-10-27T09:34:54Z";
    expect(generalUtils.methods.formatDate(dummyDate)).toBe("Oct 27, 2020");
  });

  it("can check formatDateIso method", function () {
    let dummyDate = "2020-10-27T09:34:54Z";
    expect(generalUtils.methods.formatDateIso(dummyDate)).toBe("Oct 27, 2020");
  });

  it("can check compareRecordDescUpdate method", function () {
    let a = {};
    let b = {};
    //When a > b
    a.updatedAt = "2020-09-28T09:34:54Z";
    b.updatedAt = "2020-09-27T09:34:54Z";
    expect(generalUtils.methods.compareRecordDescUpdate(a, b)).toBe(-1);

    //When a < b
    a.updatedAt = "2020-09-27T09:34:54Z";
    b.updatedAt = "2020-09-28T09:34:54Z";
    expect(generalUtils.methods.compareRecordDescUpdate(a, b)).toBe(1);
  });

  it("can check LightenDarkenColor function", function () {
    expect(LightenDarkenColor("#aaa222", 50)).toBe("#fff333");
    expect(LightenDarkenColor("#ffffff", 50)).toBe("#ffffff");
    expect(LightenDarkenColor("#AA7E4A", 0)).toBe("#aa7e4a");
    expect(LightenDarkenColor("#aaa", 50)).toBe("#ff0fff");
    expect(LightenDarkenColor("#000", 50)).toBe("#0000ff");
    expect(LightenDarkenColor("#AAAA00", 50)).toBe("#ffff00");
  });

  it("can check toBase64 function", function () {
    const blob = new Blob(["image/jpg"]);
    const mFile = new File([blob], "img.jpeg", {
      type: "image/jpeg",
    });
    const dummy = {
      readAsDataURL: vi.fn(),
      onload: () =>
        new Promise((resolve) => {
          resolve();
        }),
      onerror: () =>
        new Promise((reject) => {
          reject(new Error("reject 1"));
        }),
      result: "vv",
    };
    window.FileReader = vi.fn(() => dummy);
    toBase64(mFile);
    dummy.onload();
    dummy.onerror("a");
    expect(toBase64({})).rejects;
    expect(dummy.readAsDataURL).toHaveBeenCalledTimes(2);
  });
});
