import recordMixin from "@/utils/recordMixin.js";


describe("recordMixin.js", function(){
    it("capitalises initial letter of a string", function () {
        expect(recordMixin.filters.capitalize("wibble")).toBe("Wibble");
        expect(recordMixin.filters.capitalize("")).toBe("");
        expect(recordMixin.methods.cleanString("snake_case")).toBe("snake case");
        expect(recordMixin.methods.cleanString(123)).toBe(123);
    })
})