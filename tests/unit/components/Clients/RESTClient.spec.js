import Client from "@/components/Client/RESTClient.js";
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
        if(stub){
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

    it("can get info about the user", async () => {
        let resp = await client.getUser("userToken");
        expect(resp).toBe("testData");
    });

    it("can process network errors", async () => {
        stub.restore();
        let resp = await client.executeQuery({
            url: "testURL"
        });
        expect(resp.data.error.message).toBe("Network Error")
    })
});
