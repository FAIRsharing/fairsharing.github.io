import generalUtils, {LightenDarkenColor, toBase64} from "@/utils/generalUtils.js";

describe("generalUtils.js", function(){

    it("can check getHostName method", function () {
        process.env.VUE_APP_HOSTNAME = 'https://api.fairsharing.org'
        expect(generalUtils.methods.getHostname()).toBe("https://api.fairsharing.org");
    })

    it("can check getAPIEndPoint method", function () {
        process.env.VUE_APP_API_ENDPOINT = 'https://dev-api.fairsharing.org'
        expect(generalUtils.methods.getAPIEndPoint()).toBe("https://dev-api.fairsharing.org");
    })

    it("can check LightenDarkenColor function", function () {
        expect(LightenDarkenColor('#aaa222',50)).toBe("#fff333");
        expect(LightenDarkenColor('#ffffff',50)).toBe("#ffffff");
        expect(LightenDarkenColor('#AA7E4A',0)).toBe("#aa7e4a");
        expect(LightenDarkenColor('#aaa',50)).toBe("#ff0fff");
        expect(LightenDarkenColor('#000',50)).toBe("#0000ff");
        expect(LightenDarkenColor('#AAAA00',50)).toBe("#ffff00");
    })

    it("can check toBase64 function",  function () {
        const blob = new Blob(['image/jpg']);
        const mFile = new File([blob], 'img.jpeg', {
            type: 'image/jpeg',
        });
        const dummy = {
            readAsDataURL: jest.fn(),
            onload: () => new Promise((resolve) => {
                resolve()
            }),
            onerror:()=>new Promise((reject)=>{
                reject(new Error("reject 1"));
            }),
            result: 'vv'
        }
        window.FileReader = jest.fn(() => dummy)
        toBase64(mFile)
        dummy.onload()
        dummy.onerror('a')
        expect(toBase64({})).rejects
        expect(dummy.readAsDataURL).toHaveBeenCalledTimes(2);
    })

})
