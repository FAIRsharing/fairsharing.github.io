import stringUtils from "@/utils/stringUtils.js";


describe("stringUtils.js", function(){
    it("capitalises initial letter of a string", function () {
        expect(stringUtils.filters.capitalize("wibble")).toBe("Wibble");
        expect(stringUtils.filters.capitalize("")).toBe("");
        expect(stringUtils.methods.cleanString("snake_case")).toBe("snake case");
        expect(stringUtils.methods.cleanString(123)).toBe(123);
    })
})