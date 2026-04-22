import { describe, expect, it } from "vitest";
import iconsMixin from "@/utils/iconsMixin.js"; // Adjust path to your file location

describe("getIconName", () => {
  // Extract the method for easier usage in tests
  const { getIconName } = iconsMixin.methods;

  it("converts spaces to underscores and lowercases the string", () => {
    const input = "My Icon Name";
    const result = getIconName(input);
    expect(result).toBe("my_icon_name");
  });

  it("removes all types of brackets: () [] {}", () => {
    const input = "Icon(Name)[With]{Brackets}";
    const result = getIconName(input);
    // "Icon(Name)[With]{Brackets}" -> "iconnamewithbrackets"
    expect(result).toBe("iconnamewithbrackets");
  });

  it("replaces forward slashes with underscores", () => {
    const input = "Type/Subtype/Value";
    const result = getIconName(input);
    expect(result).toBe("type_subtype_value");
  });

  it("handles complex strings with mixed special characters", () => {
    const input = "User (Group) / Type [A]";
    // 1. Spaces -> _   : "User_(Group)_/_Type_[A]"
    // 2. Brackets gone : "User_Group_/_Type_A"
    // 3. Slashes -> _  : "User_Group___Type_A"
    // 4. Lowercase     : "user_group___type_a"
    const result = getIconName(input);
    expect(result).toBe("user_group___type_a");
  });

  it("returns empty string if input is empty", () => {
    expect(getIconName("")).toBe("");
  });
});
