import {
    hasValue,
    isEmail,
    isRequired,
    isUrl,
    isLongEnough,
    isOrcid,
    isImage,
    isAllowedSize,
    isEmailOrUrl
} from "@/utils/rules.js"

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

    it("can check if it's an email or url", () => {
        let tester = isEmailOrUrl();
        expect(tester("test@test.com")).toBe(true);
        expect(tester("test")).toBe("Invalid e-mail/URL.");
        expect(tester("wibble.com")).toBe(true);
        expect(tester("hardcore.science")).toBe(true);
        expect(tester("this.isfartoolong")).toBe("Invalid e-mail/URL.");
    });

    it("can check if the field is present", () => {
        let tester = isRequired();
        expect(tester(1)).toBe(true);
        expect(tester()).toBe("Required");
        expect(tester({})).toBe("Required");
    });

    it("can check if it's a URL", () => {
        let tester = isUrl();
        expect(tester('a string')).toEqual("Invalid URL.");
        expect(tester('wibble.com')).toBe(true);
        expect(tester('')).toBe(true);
        expect(tester("hardcore.science")).toBe(true);
        expect(tester("this.isfartoolong")).toBe("Invalid URL.");
    });

    it("can check if a user has typed enough", () => {
        let tester = isLongEnough(10);
        expect(tester('')).toEqual(`Value is not long enough (0/10)`);
        expect(tester('12')).toEqual(`Value is not long enough (2/10)`);
        expect(tester('0123456789')).toBe(true);
    });

    it("can identify ORCID ids", () => {
        let tester = isOrcid(true);
        expect(tester('')).toEqual("Doesn't look like a valid ORCID ID.");
        expect(tester('0000-0000-0000-0000')).toBe(true);
        tester = isOrcid(false);
        expect(tester('')).toBe(true);
    });

    it("can test if file is an image", () => {
        let test = isImage();
        expect(test({
            type: "image/png"
        })).toBe(true);
        expect(test({
            type: "notImage"
        })).toBe("File type should be PNG or JPEG");
    });
    it("can test if file size is allowed", () => {
        let test = isAllowedSize(3);
        expect(test(null)).toBe(false);
        expect(test([{size:2000},{size:40000000000}])).toBe("One or some of your selected files' size is more than 3 MB!");
        expect(test([{size:2000}])).toBe(true);
        expect(test([{size:50000000000}])).toBe("file size should be less than 3 MB!");
    });

});
