import generalUtils, {LightenDarkenColor, toBase64} from "@/utils/generalUtils.js";

describe("generalUtils.js", function(){

it("can check getHostName method",function(){
        process.env.VUE_APP_HOSTNAME = 'https://api.fairsharing.org'
        expect(generalUtils.methods.getHostname()).toBe("https://api.fairsharing.org");
    })

    it("can check LightenDarkenColor function", function () {
        expect(LightenDarkenColor('#aaa222',50)).toBe("#fff333");
        expect(LightenDarkenColor('#ffffff',50)).toBe("#ffffff");
        expect(LightenDarkenColor('#AA7E4A',0)).toBe("#aa7e4a");
        expect(LightenDarkenColor('#aaa',50)).toBe("#ff0fff");
        expect(LightenDarkenColor('#000',50)).toBe("#0000ff");
        expect(LightenDarkenColor('#AAAA00',50)).toBe("#ffff00");
    })

    it("can check toBase64 function", function () {
        const fileContents       = 'data:image/png;base64,TEST1';
        const readAsDataURL      = jest.fn().mockImplementation(function () {
            this.onload = jest.fn();
        });

        const addEventListener   = jest.fn((_, evtHandler) => { evtHandler({
            target: {result: fileContents}} )});
        const dummyFileReader    = {addEventListener, readAsDataURL, result: fileContents};
        window.FileReader        = jest.fn(() => dummyFileReader);

        expect(toBase64({name:'as.jpg'})).toBe("#fff333");
    })




})
