import UploadService from "@/lib/UploadingServices/UploadFilesService";
import RestClient from "@/lib/Client/RESTClient";
const sinon = require("sinon");
// jest.mock('./sound-player'); // SoundPlayer is now a mock constructor

describe("UpdateFilesService", () => {
    let client;
    let clientStub = {data: {data: {attributes: {}}}};
    let stub2 = sinon.stub(RestClient.prototype, "executeQuery");
    beforeAll( () => {
        stub2.withArgs(sinon.match.any).returns(clientStub);
        client = new RestClient();
    });
    afterAll(() => {
            stub2.restore();
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
        const mFile = new File(['attributes'], 'go.jpg');
        await UploadService.uploadLogo(mFile);
        expect(UploadService.formData.has('logo')).toBe(true)
    })

    it("uploadMultipleFilesPerRequest", async () => {
        const mFile = new File(['url'], 'go.jpg');
        const mFile2 = new File(['url'], 'go.jpg');
        let files = [mFile,mFile2]
        await UploadService.uploadMultipleFilesPerRequest(files);
        expect(UploadService.formData.has('files[1]')).toBe(true)
        files = [mFile]
        await UploadService.uploadMultipleFilesPerRequest(files);
        expect(UploadService.formData.has('files[1]')).toBe(false)
    })


})