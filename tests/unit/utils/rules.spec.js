import { hasValue, isEmail, isRequired } from "@/utils/rules.js"

describe('Form validation rules', () => {

    it("can check if it has the correct value", () => {
        let tester = hasValue(12);
        expect(tester(12)).toBe(true);
        expect(tester(13)).toBe("Invalid repeated password")
    });

    it("can check if it's an email", () => {
        let tester = isEmail();
        expect(tester("test@test.com")).toBe(true);
        expect(tester("test")).toBe("Invalid e-mail.");
    });

    it("can check if the field is present", () => {
        let tester = isRequired();
        expect(tester(1)).toBe(true);
        expect(tester()).toBe("Required.")
    })

});
