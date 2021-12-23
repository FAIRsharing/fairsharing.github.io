import UploadService from "@/lib/UploadingServices/UploadFilesService";
import RestClient from "@/lib/Client/RESTClient";
const sinon = require("sinon");
// jest.mock('./sound-player'); // SoundPlayer is now a mock constructor

describe("UpdateFilesService", () => {
    let client;
    let dataStub = {data: "testData"};
    let clientStub = {data: "a.jpg"};
    let stub = sinon.stub(UploadService, "uploadLogo");
    let stub2 = sinon.stub(RestClient.prototype, "executeQuery");
    beforeAll( () => {
        stub.withArgs(sinon.match.any).returns(dataStub);
        stub2.withArgs(sinon.match.any).returns(clientStub);
        client = new RestClient();
    });
    afterAll(() => {
            stub.restore();
    });

    it("can be instantiated as a singleton", function(){
        const instance3 = new RestClient();
        expect(client).toBe(instance3.constructor["_instance"]);
    });

    it ("can set setFormData", async () => {
        await UploadService.setFormData({id:1,token:'tokenB'});
        expect(UploadService.formData.get('id')).toBe("1");
        expect(UploadService.formData.get('token')).toBe("tokenB");
    });

    it("uploadLogo", async () => {
        await UploadService.formData.append('logo',{name:'a.jpg'});
        console.log(UploadService.formData)
        const resp = await UploadService.uploadLogo(null);
        console.log(resp)
    })

    it("uploadLogo", async () => {
        /*
                const dummy = {
                    readAsDataURL: jest.fn(),
                    onload: () => new Promise((resolve) => {
                        resolve()
                    }),
                    onerror:()=>new Promise((reject)=>{
                        reject(new Error("reject 1"));
                    }),
                    result: 'vv',
                    get:()=>'res'
                }
                window.FileReader = jest.fn(() => dummy)
                let resp = await client.uploadLogo({get:()=>{}});
        */
    });

})