import stringUtils from "@/utils/stringUtils.js";
import {truncate} from "@/utils/stringUtils"

describe("stringUtils.js", function(){

    it("capitalises initial letter of a string", function () {
        expect(stringUtils.filters.capitalize("wibble")).toBe("Wibble");
        expect(stringUtils.filters.capitalize("")).toBe("");
        expect(stringUtils.methods.cleanString("snake_case")).toBe("snake case");
        expect(stringUtils.methods.cleanString("snakeCase")).toBe("snakeCase");
        expect(stringUtils.methods.cleanString(123)).toBe(123);
    })

    it("replace a given number of characters with an ellipsis", function () {
        expect(stringUtils.methods.truncate("snake case", 3)).toBe("sn...");
        expect(stringUtils.methods.truncate("snake case", 15)).toBe("snake case");
    })

    it("can check exported truncate method", function () {
        expect(truncate.methods.truncate("snake case", 3)).toBe("sn...");
        expect(truncate.methods.truncate("snake case", 15)).toBe("snake case");
    })

    it("prettifies a csv list", () => {
        expect(stringUtils.methods.prettifyList("one,two")).toBe("one, two");
    });

})
