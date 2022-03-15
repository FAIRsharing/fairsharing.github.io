import Client from "@/lib/Client/RESTClient.js"
import sinon from "sinon"

describe("RESTClient.js", function () {
    let restStub = sinon.stub(Client.prototype, "getUserRoles");

    restStub.returns([
        {
            id: 1,
            name: 'user'
        }
    ]);

    afterAll(() => {
        restStub.restore();
    });

    // See the following PR for why this test is here:
    // https://github.com/FAIRsharing/fairsharing.github.io/pull/1552
    it("can get user roles", async () => {
        const client = new Client();
        let response = await client.getUserRoles('token');
        expect(response).toStrictEqual([ { id: 1, name: 'user' } ]);
    });

    // TODO: Perhaps test other functions here...

});