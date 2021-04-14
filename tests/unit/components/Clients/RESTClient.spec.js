import Client from "@/lib/Client/RESTClient.js";
import Vue from "vue";
const sinon = require("sinon");


describe("RESTClient", () =>{

    let client;
    let dataStub = {data: "testData"};
    let stub = sinon.stub(Client.prototype, "executeQuery");

    beforeAll( () => {
        stub.withArgs(sinon.match.any).returns(dataStub);
        client = new Client();
    });
    afterAll(() => {
        if (stub){
            stub.restore();
        }
    });

    it("can be instantiated as a singleton", function(){
        const instance2 = new Client();
        expect(client).toBe(instance2.constructor["_instance"]);
    });

    it ("can let user login", async () => {
        let resp = await client.login();
        expect(resp).toBe("testData");
    });

    it("can let users logout", async () => {
        let resp = await client.logout("thisisafaketoken");
        expect(resp).toBe("testData");
    });

    it("can let users create account", async () => {
        let resp = await client.createAccount("thisisalogin");
        expect(resp).toBe("testData");
    });

    it("can let users confirm their email", async () => {
        let resp = await client.confirmAccount("thisisaconfirmationtoken");
        expect(resp).toBe("testData");
    });

    it("can let users reset their password", async () => {
        let resp = await client.resetPassword("thisisjwtfaketoken");
        expect(resp).toBe("testData");
    });

    it("can let users re-send confirmation", async () => {
        let resp = await client.resendConfirmation({email: 'example@fairsharing.org'});
        expect(resp).toBe("testData");
    });

    it("can get info about the user", async () => {
        let resp = await client.getUser("userToken");
        expect(resp).toBe("testData");
    });

    it("can get the list of available profile types", async () => {
        let resp = await client.getProfileTypes();
        expect(resp).toBe("testData");
    });

    it("can create a new user defined tag", async() => {
        let data = await client.createNewUserDefinedTag("abc", 'def');
        expect(data).toBe("testData")
    });

    it("can create a new record", async() => {
        let data = await client.createRecord({}, 'def');
        expect(data).toBe("testData")
    });

    it("can get the extra metadata fields", async () => {
        let resp = await client.extraMetadataFields('model_and_format', 'userToken');
        expect(resp).toBe("testData");
    });

    it("can process network errors", async () => {
        stub.restore();
        jest.spyOn(console, 'error');
        console.error.mockImplementation(() => {});
        Vue.config.productionTip = false;
        Vue.config.devtools = false;
        let resp = await client.executeQuery({
            url: "http://google.com"
        });
        expect(resp.data.error.message).toBe("Network Error");
        console.error.mockRestore();
        Vue.config.productionTip = true;
        Vue.config.devtools = true;
    });

    it("can set authentication headers correctly", () => {
        expect(client.auth_headers('fun_token')['Authorization']).toEqual('Bearer fun_token');
    });
});
